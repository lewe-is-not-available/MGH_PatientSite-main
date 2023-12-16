import React, { useState, useEffect, useRef } from "react";
import supabase from "../../config/Supabase";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";
import moment from "moment";
import AcceptConfirm from "./NextConfirm";
import _ from "lodash";
import TodayAppModal from "./TodayAppModal";
import { CgEnter } from "react-icons/cg";
import DocCurrentModal from "./DocCurrentModal";
import LastConfirm from "./LastConfirm";
import emailjs from "@emailjs/browser";

const Doc_Dash = ({ user }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // console.log(user);
  const [DOC, setDOC] = useState();
  const [doctor, setdoctor] = useState([]);
  async function fetchDoctor() {
    const { data: doc, error: docErr } = await supabase
      .from("profile")
      .select()
      .eq("id", user?.id)
      .single();
    try {
      if (docErr) throw docErr;
      else {
        const { data: docData } = await supabase
          .from("dr_information")
          .select()
          .eq("email", doc?.email)
          .single();
        setDOC(docData?.id);
        setdoctor(docData);
      }
    } catch (error) {
      console.log(docErr);
    }
  }
  //*get patient appointments
  const [books, setBook] = useState([]);
  const [archive, setarchive] = useState([]);
  const [filt, setfilt] = useState([]);
  const [Loaded, setLoaded] = useState(true);
  const fetchBooks = async () => {
    setLoaded(false);
    const { data, error } = await supabase
      .from("patient_Appointments")
      .select()
      .eq("doc_id", DOC);
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      setLoaded(true);
      setfilt(data);
    }
  };
  useEffect(() => {
    //*Realtime data
    const fetchAndSubscribe = async () => {
      await fetchBooks();
      await fetchDoctor();

      const realtime = supabase
        .channel("room2")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "patient_Appointments" },
          (payload) => {
            fetchBooks(payload.new);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "dr_information",
            filter: `email=eq.${doctor.email}`,
          },
          (payload) => {
            fetchDoctor(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [DOC]);

  //*Get count of books
  const [allApp, setAllApp] = useState([]);
  useEffect(() => {
    if (filt) {
      const filtered = filt.filter((item) => {
        const comp1 = item.status.includes("Confirmed");
        return comp1;
      });
      setBook(filtered);
      const AllAppfiltered = filt.filter((item) => {
        const comp = item.status.includes("pending confirmation");
        const comp1 = item.status.includes("pending request");
        return comp || comp1;
      });
      setAllApp(AllAppfiltered);
    }
    if (books) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [filt]);

  useEffect(() => {
    const filterArch = filt.filter((item) => {
      const comp = item.status.includes("Completed");
      return comp;
    });
    setarchive(filterArch);
    if (books) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [filt, setarchive]);

  const [nextQueue, setNextQueue] = useState([]);
  const [currentQueue, setcurrentQueue] = useState();
  const [nextSched, setNextSched] = useState();
  const [lastQueue, setlastQueue] = useState();
  //*fetch current queue
  async function fetchQue() {
    try {
      if (doctor) {
        const { data: queNum, error: queErr } = await supabase
          .from("patient_Appointments")
          .select()
          .match({
            doc_id: doctor?.id,
            date: moment(new Date()).format("yyyy-M-D"),
          })
          .or("status.eq.Confirmed,status.eq.rescheduled")
          .order("queue", { ascending: true });
        if (queErr) {
          throw queErr;
        }
        if (queNum) {
          setNextQueue(queNum);
        }

        const { data: currentQue, error: currErr } = await supabase
          .from("patient_Appointments")
          .select()
          .match({
            doc_id: doctor?.id,
            date: moment(new Date())?.format("yyyy-M-D"),
            status: "Consultation Ongoing",
          });
        if (currErr) {
          throw Error(currErr.message);
        }
        if (currentQue) {
          setcurrentQueue(currentQue[0]);
        }

        const { data: nxtSched, error: nxtErr } = await supabase
          .from("patient_Appointments")
          .select()
          .eq("doc_id", doctor?.id)
          .or("status.eq.Confirmed,status.eq.rescheduled")
          .order("date", { ascending: true });
        if (nxtErr) {
          throw nxtErr;
        }
        if (nxtSched !== undefined && nxtSched.length !== 0) {
          const nxtDate = _.filter(nxtSched, ["date", nxtSched[0]?.date]);
          setNextSched(_.orderBy(nxtDate, ["queue", "asc"]));
        }

        const { data: lastQue, error: lastQueErr } = await supabase
          .from("patient_Appointments")
          .select()
          .match({
            doc_id: doctor?.id,
            status: "Awaiting Doctor's Confirmation",
          });
        if (lastQueErr) {
          throw Error(lastQueErr.message);
        }
        if (lastQue) {
          setlastQueue(lastQue[0]);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }
  //*Get current patient's profile
  const [imgName, setimgName] = useState([]);
  const [imgName1, setimgName1] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);
  const [isImgEmpty1, setImgEmpty1] = useState(false);
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";

  async function getImages() {
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .list(currentQueue?.email + "/profile/", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "asc" },
        });
      if (error) throw error;
      else {
        setImgEmpty(true);
        setimgName(data[0]?.name);
      }
      if (nextSched) {
        const { data: img, error: imgErr } = await supabase.storage
          .from("images")
          .list(nextSched[0]?.email + "/profile/", {
            limit: 100,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (imgErr) throw imgErr;
        else {
          setImgEmpty1(true);
          setimgName1(img[0]?.name);
        }
      }
    } catch (error) {
      console.log(error.message);
      setImgEmpty(false);
      setImgEmpty1(false);
    }
  }

  useEffect(() => {
    if ((currentQueue, nextSched)) {
      getImages();
    }
  }, [currentQueue, nextSched]);

  //console.log(nextQueue && nextQueue[1]?.fname);
  //*Realtime function
  useEffect(() => {
    fetchQue();
    const fetchAndSubscribe = async () => {
      await fetchQue();

      const realtime = supabase
        .channel("room10")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `doc_id=eq.${doctor.id}`,
          },
          () => {
            fetchQue();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [doctor]);

  //*Handle next consultation
  const [next, setNext] = useState(false);
  const [load, setLoad] = useState(false);
  async function handleAccept(e) {
    e.preventDefault();
    setNext(true);
    setLoad(true);
    try {
      const { error: nextErr } = await supabase
        .from("patient_Appointments")
        .update({ status: "Completed" })
        .eq("book_id", currentQueue?.book_id);
      if (nextErr) throw nextErr;

      const { error: nextCurrentErr } = await supabase
        .from("patient_Appointments")
        .update({ current: nextQueue[0].queue })
        .match({
          doc_id: doctor.id,
          date: moment(new Date()).format("yyyy-M-D"),
        })
        .or("status.eq.Confirmed,status.eq.rescheduled");
      if (nextCurrentErr) throw nextCurrentErr;
      const { error: CurrentErr } = await supabase
        .from("patient_Appointments")
        .update({ status: "Consultation Ongoing" })
        .eq("book_id", nextQueue[0]?.book_id);
      if (CurrentErr) throw CurrentErr;
      else {
        setNext(false);
        setLoad(false);
        const templateParams = {
          from_name: "MGHsite",
          from_email: "loewiayon12@gmail.com",
          to_email: nextQueue[0].email,
          to_name: nextQueue[0]?.fname,
          message: "Here is your gmeet link " + doctor.gmeet,
        };
        
        emailjs
          .send(
            "service_ftpnlnq",
            "template_smy7g6s",
            templateParams,
            "pAzXNFE5xjRINEjRR"
          )
          .then(
            function (response) {
              console.log("SUCCESS!", response.status, response.text);
            },
            function (error) {
              console.log("FAILED...", error);
            }
          );
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      setNext(false);
      setLoad(false);
    }
  }
  //*Get day if Doctor's schedule is today
  const today = moment(new Date()).format("dddd");
  const docSchedToday = doctor?.schedule?.filter((item) =>
    item.day.includes(today)
  );
  //*get check in and check out of doctor
  const checkIn = moment(
    new Date(`2000-01-01T${docSchedToday && docSchedToday[0]?.startTime}`)
  ).format("HHmm");
  const checkOut = moment(
    new Date(`2000-01-01T${docSchedToday && docSchedToday[0]?.endTime}`)
  ).format("HHmm");

  //*Get time today per minute
  const [timeNow, setCount] = useState();
  useEffect(() => {
    //*change per minute
    const interval = setInterval(() => {
      setCount(moment(new Date()).format("HHmm"));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeNow]);

  const isSchedToday = _.inRange(timeNow, checkIn, checkOut);

  useEffect(() => {
    //*Update start of queue
    const StartQueue = async () => {
      try {
        if (isSchedToday) {
          const isStarting = _.filter(filt, ["status", "Consultation Ongoing"]);
          if (isStarting.length === 0) {
            fetchQue();
            const { error: CurrentErr } = await supabase
              .from("patient_Appointments")
              .update({ status: "Consultation Ongoing" })
              .eq("book_id", nextQueue[0]?.book_id);
            if (CurrentErr) throw CurrentErr;
          }
          const templateParams = {
            from_name: "MGHsite",
            from_email: "loewiayon12@gmail.com",
            to_email: nextQueue[0].email,
            to_name: nextQueue[0]?.fname,
            message: "Here is your gmeet link " + doctor.gmeet,
          };

          emailjs
            .send(
              "service_ftpnlnq",
              "template_smy7g6s",
              templateParams,
              "pAzXNFE5xjRINEjRR"
            )
            .then(
              function (response) {
                console.log("SUCCESS!", response.status, response.text);
              },
              function (error) {
                console.log("FAILED...", error);
              }
            );
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    StartQueue();
  }, [isSchedToday]);

  const nextSchedDay =
    nextSched &&
    _.filter(doctor?.schedule, {
      day: moment(new Date(nextSched[0]?.date)).format("dddd"),
    })[0];
  //*Update status for the rest of queue if time exceeded
  const isElapsed = _.lte(checkOut, timeNow);
  useEffect(() => {
    //*Update start of queue
    const StartQueue = async () => {
      try {
        if (isElapsed) {
          const { error: CurrentErr } = await supabase
            .from("patient_Appointments")
            .update({ status: "Awaiting Doctor's Confirmation" })
            .eq("book_id", currentQueue?.book_id);
          if (CurrentErr) throw CurrentErr;

          if (nextQueue.length !== 0) {
            fetchQue();
            const { error: nextErr } = await supabase
              .from("patient_Appointments")
              .update({ status: "pending request" })
              .match({
                doc_id: doctor.id,
                date: moment(new Date()).format("yyyy-M-D"),
              })
              .or("status.eq.Confirmed,status.eq.rescheduled");
            if (nextErr) throw nextErr;

            console.log("success");
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    StartQueue();
  }, [isElapsed]);

  //*Modal states
  const [todayModal, setTodayModal] = useState(false);
  const [currModal, setCurrModal] = useState(false);
  const [last, setLast] = useState(false);

  if (next || todayModal || currModal || last) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }

  return (
    <>
      {next && (
        <div className="absolute z-50 w-full h-full">
          <AcceptConfirm
            setAccept={setNext}
            load={load}
            handleAccept={handleAccept}
          />
        </div>
      )}
      {last && (
        <div className="absolute z-50 w-full h-full">
          <LastConfirm
            setAccept={setLast}
            data={currentQueue}
            setCurrModal={setCurrModal}
          />
        </div>
      )}

      {todayModal && (
        <div className="absolute z-50 w-full h-full">
          <TodayAppModal
            setAccept={setTodayModal}
            ol={nextQueue.length === 0 ? nextSched : nextQueue}
          />
        </div>
      )}
      {currModal && (
        <div className="absolute z-40 w-full h-full">
          <DocCurrentModal
            data={lastQueue ? lastQueue : currentQueue}
            doc={doctor}
            nextQueue={nextQueue}
            setCurrModal={setCurrModal}
            setNext={setNext}
            next={next}
            last={last}
            setLast={setLast}
            load={load}
          />
        </div>
      )}
      <div className="text-center h-auto">
        {/* feautures */}
        <div className="flex justify-center mb-20">
          <div className="grid grid-cols-2 features gap-6 w-full">
            <Link
              to="/Doctor/Appointments"
              className="Docboxes"
              data-aos="fade-up"
            >
              <div className="AdmintitleText">All Pending Appointments: </div>
              <div className="w-full rounded-xl mb-4">
                <h1 className="text-5xl font-semibold">
                  {Loaded ? (
                    allApp.length
                  ) : (
                    <l-tailspin
                      size="55"
                      stroke="4"
                      speed="0.9"
                      color="black"
                    ></l-tailspin>
                  )}
                </h1>
              </div>
              <p>Booked Appointments to confirm</p>
            </Link>
            <Link
              to="/DoctorConsultHistory"
              className="Docboxes "
              data-aos="fade-up"
            >
              <div className="AdmintitleText">Total Archives: </div>
              <div className="w-full rounded-xl mb-4">
                <h1 className="text-5xl font-semibold">
                  {Loaded ? (
                    archive.length
                  ) : (
                    <l-tailspin
                      size="55"
                      stroke="4"
                      speed="0.9"
                      color="black"
                    ></l-tailspin>
                  )}
                </h1>
              </div>
              <p>Completed Consultations</p>
            </Link>
            <div className="col-span-2 gap-x-5">
              <div
                className="abs py-4 px-6 w-full border-[1px] text-sm 
  text-left flex flex-col items-start bg-white rounded-xl transition duration-200 
  hover:shadow-none "
                data-aos="fade-up"
              >
                <div className="grid grid-cols-3 w-full py-3 items-center bg-green-500 text-white">
                  <div className=""></div>
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-xl">
                      {isSchedToday
                        ? "Your schedule for Today"
                        : "You have no schedule for today"}
                    </p>
                    {!isSchedToday && (
                      <p className="text-xl">next schedule is at:</p>
                    )}
                    <div className="text-xl font-thin flex items-center">
                      <p className="">{nextSchedDay?.day}</p>
                      <p className="mx-4">|</p>
                      <p>
                        {" "}
                        {moment(
                          new Date(`2000-01-01T${nextSchedDay?.startTime}`)
                        ).format("LT")}{" "}
                        -{" "}
                        {moment(
                          new Date(`2000-01-01T${nextSchedDay?.endTime}`)
                        ).format("LT")}
                      </p>
                    </div>
                  </div>
                  <div className="justify-center flex">
                    {!currentQueue && !lastQueue ? (
                      <div></div>
                    ) : (
                      <button
                        onClick={() => setCurrModal(true)}
                        className="px-3 py-1 flex items-center rounded-lg hover:bg-green-600 hover:text-lg transition duration-75 text-base text-white border-2 border-white font-semibold bg-green-500"
                      >
                        <CgEnter className="mr-1 text-xl" />
                        <span>Enter meeting</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full rounded-xl mb-4">
                  <div className="text-3xl font-semibold mt-4">
                    {nextSched !== undefined &&
                    nextSched?.length !== 0 &&
                    Loaded ? (
                      <div className="flex">
                        {currentQueue ? (
                          <>
                            <img
                              className="object-cover rounded-full w-[5.6rem] h-fit mr-3"
                              src={`${
                                isImgEmpty
                                  ? CDNURL +
                                    currentQueue?.email +
                                    "/profile/" +
                                    imgName
                                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                              }`}
                              alt="/"
                            />{" "}
                            <div className="text-xl flex flex-col font-light space-y-3 w-1/2">
                              <p className="w-full text-lg text-left">
                                You have an ongoing consultation for patient
                                <br />
                                <span className="font-semibold ml-1">
                                  {currentQueue?.fname}
                                </span>
                                <Link
                                  to={
                                    "/Doctor/Appointments/Details/" +
                                    currentQueue?.book_id
                                  }
                                  className="text-base text-primary ml-1"
                                >
                                  View Details
                                </Link>
                              </p>
                              {nextQueue[0] && (
                                <p className="text-base flex items-center">
                                  Next Consultation is with{" "}
                                  <span className="font-semibold ml-1">
                                    {nextQueue[0]?.fname}
                                  </span>
                                </p>
                              )}
                            </div>
                            <div className="text-lg mx-2 w-1/2 font-light flex-col flex items-start">
                              Your total of confirmed Appointments for today
                              <div className="text-6xl flex font-semibold my-2">
                                <h1>{nextQueue.length}</h1>
                              </div>
                              <p
                                onClick={(e) =>
                                  setTodayModal(true) || e.preventDefault()
                                }
                                className="text-lg select-none cursor-pointer font-light text-primary"
                              >
                                View all
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              className="object-cover rounded-full w-[5.6rem] h-fit mr-3"
                              src={`${
                                isImgEmpty1
                                  ? CDNURL +
                                    nextSched[0]?.email +
                                    "/profile/" +
                                    imgName1
                                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                              }`}
                              alt="/"
                            />{" "}
                            <div className="text-xl flex flex-col font-light space-y-3 w-1/2">
                              <p className="w-full text-lg text-left">
                                Your next appointment schedule is with <br />
                                <span className="font-semibold mx-1">
                                  {nextSched[0]?.fname}
                                </span>{" "}
                                at:
                                <br />
                                <p className="text-3xl font-semibold mt-3">
                                  {moment(new Date(nextSched[0]?.date)).format(
                                    "LL"
                                  )}
                                </p>
                              </p>
                            </div>
                            <div className="text-lg mx-2 w-1/2 font-light flex-col flex items-start">
                              Your total of confirmed appointments for the next
                              schedule
                              <div className="text-6xl flex font-semibold my-2">
                                <h1>{nextSched?.length}</h1>
                              </div>
                              <p
                                onClick={(e) =>
                                  setTodayModal(true) || e.preventDefault()
                                }
                                className="text-lg select-none cursor-pointer font-light text-primary"
                              >
                                View all
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex w-full justify-center my-9">
                        <l-tailspin
                          size="55"
                          stroke="4"
                          speed="0.9"
                          color="black"
                        ></l-tailspin>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Doc_Dash;

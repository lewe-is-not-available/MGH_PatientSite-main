import React, { useState, useEffect } from "react";
import supabase from "../../config/Supabase";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";
import moment from "moment";
import AcceptConfirm from "./NextConfirm";
import _ from "lodash";
import TodayAppModal from "./TodayAppModal";

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
        const comp = item.status.includes("pending");
        return comp;
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

  const [nextQueue, setNextQueue] = useState();
  const [currentQueue, setcurrentQueue] = useState();
  //*fetch current queue
  async function fetchQue() {
    try {
      if (doctor) {
        const { data: queNum, error: queErr } = await supabase
          .from("patient_Appointments")
          .select()
          .match({
            doc_id: doctor?.id,
            date: moment(new Date()).format("yyyy-M-19"),
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
            date: moment(new Date())?.format("yyyy-M-19"),
            status: "Consultation Ongoing",
          });
        if (currErr) {
          throw Error(currErr.message);
        }
        if (currentQue) {
          setcurrentQueue(currentQue);
        }
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  }
  //console.log(currentQueue);
  //*Get current patient's profile
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(currentQueue[0]?.email + "/profile/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    setImgEmpty(true);
    setimgName(data[0]?.name);

    if (error) {
      setImgEmpty(false);
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentQueue) {
      getImages();
    }
  }, [currentQueue]);

  //console.log(nextQueue && nextQueue[1]?.fname);
  //*Realtime function
  useEffect(() => {
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
          (payload) => {
            fetchQue(payload.new);
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
  async function handleAccept(e) {
    e.preventDefault();
    setNext(true);
    try {
      const { error: nextErr } = await supabase
        .from("patient_Appointments")
        .update({ status: "Completed" })
        .eq("book_id", currentQueue[0]?.book_id);
      if (nextErr) throw nextErr;

      const { error: nextCurrentErr } = await supabase
        .from("patient_Appointments")
        .update({ current: nextQueue[0].queue })
        .match({
          doc_id: doctor.id,
          date: moment(new Date()).format("yyyy-M-19"),
          status: "Confirmed",
        });

      if (nextCurrentErr) throw nextCurrentErr;
      const { error: CurrentErr } = await supabase
        .from("patient_Appointments")
        .update({ status: "Consultation Ongoing" })
        .eq("book_id", nextQueue[0]?.book_id);
      if (CurrentErr) throw CurrentErr;
    } catch (error) {
      toast.error(error.message);
      console.log(error);
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
        if (isSchedToday && nextQueue) {
          const isStarting = _.filter(filt, ["status", "Consultation Ongoing"]);
          if (isStarting.length === 0) {
            const { error: CurrentErr } = await supabase
              .from("patient_Appointments")
              .update({ status: "Consultation Ongoing" })
              .eq("book_id", nextQueue[0]?.book_id);
            if (CurrentErr) throw CurrentErr;
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    StartQueue();
  }, [isSchedToday]);

  //*Open Modal for appointments today
  const [todayModal, setTodayModal] = useState(false);

  if (next || todayModal) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }
  return (
    <>
      {next && (
        <div className="absolute z-50 w-full h-full">
          <AcceptConfirm setAccept={setNext} handleAccept={handleAccept} />
        </div>
      )}

      {todayModal && (
        <div className="absolute z-50 w-full h-full">
          <TodayAppModal setAccept={setTodayModal} ol={nextQueue} />
        </div>
      )}

      <div className="text-center h-auto">
        {/* feautures */}
        <div className="flex justify-center mb-20">
          <div className="grid grid-cols-2 features gap-6 w-full">
            <button
              onClick={(e) => setNext(true) || e.preventDefault()}
              className="px-4 col-span-2 py-1 bg-white abs rounded-md hover:shadow-none"
            >
              Start next appointment
            </button>
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
                {isSchedToday ? (
                  <>
                    <div className="flex justify-center w-full py-3 items-center bg-green-500 text-white">
                      <div className="flex flex-col items-center">
                        <p className="font-semibold text-xl">
                          Your schedule for Today
                        </p>
                        <div className="text-xl font-thin flex items-center">
                          <p className="">{docSchedToday[0]?.day}</p>
                          <p className="mx-4">|</p>
                          <p>
                            {" "}
                            {moment(
                              new Date(
                                `2000-01-01T${
                                  docSchedToday && docSchedToday[0]?.startTime
                                }`
                              )
                            ).format("LT")}{" "}
                            -{" "}
                            {moment(
                              new Date(
                                `2000-01-01T${
                                  docSchedToday && docSchedToday[0]?.endTime
                                }`
                              )
                            ).format("LT")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full rounded-xl mb-4">
                      <div className="text-3xl font-semibold mt-4">
                        {Loaded ? (
                          <div className="flex">
                            <img
                              className="object-cover rounded-full w-[5.6rem] h-fit mr-3"
                              src={`${
                                isImgEmpty
                                  ? CDNURL +
                                    currentQueue[0]?.email +
                                    "/profile/" +
                                    imgName
                                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                              }`}
                              alt="/"
                            />
                            <div className="text-xl flex flex-col font-light space-y-3 w-1/2">
                              <p className="w-full text-lg text-left">
                                You have an ongoing consultation for patient{" "}
                                <br />
                                <span className="font-semibold ml-1">
                                  {currentQueue[0]?.fname}
                                </span>
                                <Link
                                  to={
                                    "/Doctor/Appointments/Details/" +
                                    currentQueue[0]?.book_id
                                  }
                                  className="text-base text-primary ml-1"
                                >
                                  View Details
                                </Link>
                              </p>
                              <p className="text-base">
                                Here is your gmeet link:{" "}
                                <a href={doctor.gmeet} className="text-primary">
                                  Click here
                                </a>
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
                          </div>
                        ) : (
                          <l-tailspin
                            size="55"
                            stroke="4"
                            speed="0.9"
                            color="black"
                          ></l-tailspin>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="AdmintitleText">Next Appointment: </div>
                    <div className="w-full rounded-xl mb-4">
                      <h1 className="text-3xl font-semibold">
                        {Loaded ? (
                          <>
                            {/* {moment(mostRecentDate).format("LL")} at{" "}
                            {moment(
                              new Date(`2000-01-01T${docSched && docSched[0]}`)
                            ).format("LT")} */}
                          </>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Doc_Dash;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { TbCalendarTime } from "react-icons/tb";
import { LuCalendarCheck2, LuCalendarX2 } from "react-icons/lu";
import AcceptConfirm from "./AcceptConfirm";
import ReschedConfirm from "./ReschedConfirm";
import CancelConfirm from "./CancelConfirm";
import ImageModal from "./ImageModal";
import moment from "moment";

const AppointmentDetails = ({ user }) => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  //*get patient's appointment details
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [Email, setEmail] = useState("");
  const [isSomeone, setisSomeone] = useState();

  const fetchData = async () => {
    const { data: book, error: bookErr } = await supabase
      .from("patient_Appointments")
      .select()
      .eq("book_id", id)
      .single();

    if (bookErr) {
      toast.error(bookErr.message, {
        toastId: "error",
      });
    }
    if (book.someone === "Yes") {
      setisSomeone(true);
    } else {
      setisSomeone(false);
    }
    setEmail(book.email);
    setData(book);
    setLoading(false);
  };

  //*realtime for fetching last queue number
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      await fetchData();
      const realtime = supabase
        .channel("room20")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `book_id=eq.${id}`,
          },
          (payload) => {
            fetchData(payload.new.data);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, []);

  //*getting image
  const [StatusVisible, setStatusVisible] = useState(true);
  useEffect(() => {
    if (Email) {
      async function getImages() {
        const { data: PatientImg, error: PatientImgErr } =
          await supabase.storage.from("images").list(Email + "/profile/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (PatientImg[0]) {
          setImgEmpty(true);
          setimgName(PatientImg[0].name);
        }

        if (PatientImgErr) {
          setImgEmpty(false);
          console.log(PatientImgErr);
        }
      }
      getImages();
    }
    if (data.status === "rejected" || data.status === "completed") {
      setStatusVisible(false);
    }
  }, [setimgName, Email, setImgEmpty]);

  //*Get doctor details
  const [Doc, setDoc] = useState([]);
  async function fetchDoc() {
    if (data.docname) {
      const { data: DocDetails, error: failDoc } = await supabase
        .from("dr_information")
        .select()
        .eq("name", data.docname)
        .single();
      try {
        if (failDoc) throw failDoc;
        setDoc(DocDetails);
      } catch (failDoc) {
        console.log(failDoc);
      }
    }
  }

  //*Realtime Doctor
  useEffect(() => {
    fetchDoc(data.docname);
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dr_information" },
        () => {
          fetchDoc();
        }
      )
      .subscribe();
  }, [data.docname]);

  //*getting image for doctor
  const [docImg, setDocImg] = useState();
  const [isDocImgEmpty, setisDocImgEmpty] = useState(false);
  useEffect(() => {
    if (Doc.email) {
      async function getImageDoc() {
        const { data: DocPic, error: DocPicErr } = await supabase.storage
          .from("images")
          .list(Doc.email + "/profile/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (DocPic[0]) {
          setisDocImgEmpty(true);
          setDocImg(DocPic[0].name);
        }

        if (DocPicErr) {
          setisDocImgEmpty(false);
          toast.error(DocPicErr.message, { autoClose: false });
          console.log(DocPicErr);
        }
      }
      getImageDoc();
    }
  }, [Doc]);

  //*get payment
  const [payImg, setPayImg] = useState([]);
  const [PayName, setPayName] = useState();
  async function getPayment() {
    const { data: DocPic, error: DocPicErr } = await supabase.storage
      .from("images")
      .list(data.email + "/payment/" + data.book_id + "/", {
        limit: 10,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (DocPic) {
      setPayImg(DocPic);
    } else if (DocPicErr) {
      toast.error(DocPicErr.message, { autoClose: false });
      console.log(DocPicErr);
    }
  }
  useEffect(() => {
    getPayment();
  }, [data.email]);

  //*Get last queue number
  const [lastQue, setLastQue] = useState();
  const [lastReschedQue, setLastReschedQue] = useState();
  async function fetchQue() {
    try {
      if (Doc && data) {
        const { data: queNum, error: queErr } = await supabase
          .from("patient_Appointments")
          .select("queue")
          .match({
            doc_id: Doc?.id,
            date: data?.date,
            status: "Confirmed",
          })
          .order("queue", { ascending: false })
          .limit(10);

        if (queNum) {
          setLastQue(queNum[0]);
        }
        if (queErr) {
          throw Error(queErr.message + "184");
        }

        const { data: ResQueNum, error: ResQueErr } = await supabase
          .from("patient_Appointments")
          .select("queue")
          .match({
            doc_id: Doc?.id,
            date: data?.date,
            status: "rescheduled",
          })
          .order("queue", { ascending: false })
          .limit(1);

        if (ResQueNum) {
          console.log(ResQueNum);
          setLastReschedQue(ResQueNum[0]);
        }

        if (ResQueErr) {
          throw Error(ResQueErr.message + "206");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  //*realtime for fetching last queue number
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      await fetchQue();

      const realtime = supabase
        .channel("room13")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `doc_id=eq.${Doc.id}`,
          },
          (payload) => {
            fetchQue(payload.new.data);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `date=eq.${data.date}`,
          },
          (payload) => {
            fetchQue(payload.new.data);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `status=eq.Confirmed`,
          },
          (payload) => {
            fetchQue(payload.new.data);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [Doc, data]);

  //*accepting the appointment
  async function handleAccept(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("patient_Appointments")
        .update({
          status: "Confirmed",
          queue: lastQue?.queue ? lastQue.queue + 1 : 200 + 1,
        })
        .eq("book_id", id);
      if (error) throw error;
      else {
        setAccept(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }

    //navigate("/Confirm_Appointments");
  }

  //*Modal States
  const [accept, setAccept] = useState(false);
  const [resched, setResched] = useState(false);
  const [reject, setReject] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  if (accept || resched || reject || imageModal) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }

  return (
    <>
      <div className="sticky top-1">
        {accept && (
          <AcceptConfirm setAccept={setAccept} handleAccept={handleAccept} />
        )}
        {imageModal && (
          <ImageModal
            CDNURL={CDNURL}
            email={data.email}
            book_id={data.book_id}
            payImg={PayName}
            setImageModal={setImageModal}
          />
        )}
        {resched && (
          <ReschedConfirm
            user={user}
            lastReschedQue={lastReschedQue}
            setResched={setResched}
            id={id}
          />
        )}
        {reject && (
          <CancelConfirm
            setReject={setReject}
            id={id}
            handleAccept={handleAccept}
          />
        )}
      </div>

      <div className="back flex flex-col items-center h-auto pb-14 min-h-screen w-full">
        <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
          Appointment details
        </h1>
        <section className="flex flex-col px-12 py-10 mt-10 rounded-xl bg-white w-[80%] abs">
          {loading ? (
            <div className="flex justify-center w-full ">
              <Oval
                height={80}
                width={80}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-x-4 row-span-2">
              <div className="flex flex-col text-center items-center row-span-2">
                <img
                  className="object-cover rounded-full shadow-xl w-[13rem] mb-5 h-[13rem]"
                  src={`${
                    isImgEmpty
                      ? CDNURL + data.email + "/profile/" + imgName
                      : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                  }`}
                  alt="/"
                />
                <div className="w-full space-y-3">
                  <p>
                    <span className="font-semibold">Patient Name:</span>
                    <br />
                    {data.fname} {data.lname}
                  </p>
                  <p>
                    <span className="font-semibold">Patient Email:</span>
                    <br />
                    {data.email}{" "}
                  </p>
                  <p>
                    <span className="font-semibold">Contact Number:</span>
                    <br />
                    {data.number}
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-left items-left mt-12 space-y-6 row-span-2">
                <p>
                  <span className="font-semibold">Booking Reference id:</span>
                  <br />
                  {data.book_id}
                </p>
                <p>
                  <span className="font-semibold">Patient Birthdate:</span>
                  <br />
                  {moment(new Date(data.bday)).format("LL")}
                </p>
                <p>
                  <span className="font-semibold">Booked:</span>
                  <br />
                  {moment(new Date(data.created_at)).calendar()}
                </p>
                <p>
                  <span className="font-semibold">Appointment day:</span>
                  <br />
                  {moment(new Date(data.date)).format("LL")}
                </p>

                <p>
                  <span className="font-semibold">Reason of appointment:</span>
                  <br />
                  {data.reason}
                </p>
              </div>
              <div className="flex flex-col text-left items-left mt-10 space-y-2">
                <p>
                  <span className="font-semibold">Booked for someone?</span>
                  <br />
                  {data.someone}{" "}
                </p>

                {isSomeone && (
                  <>
                    <p>
                      <span className="font-semibold">
                        Relation of patient to the person who booked:
                      </span>
                      <br />
                      {data.relation}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Name of the authorized representative:
                      </span>
                      <br />
                      {data.appointee}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col mt-10 space-y-4 mx-7">
                {(data?.status === "Confirmed" ||
                  data?.status === "rescheduled") && (
                  <div className="flex flex-col justify-center mb-10 space-x-3">
                    <span className="font-semibold">Queuing Number:</span>
                    <h2 className="text-6xl font-semibold">{data.queue}</h2>
                  </div>
                )}

                <div className="flex flex-col text-left items-left">
                  <span className="font-semibold">Status:</span>
                  {data.status === "Consultation Ongoing" && (
                    <p className="px-4 py-1 text-white rounded-full bg-green-500 w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "pending" && (
                    <p className="px-4 py-1 text-white rounded-full bg-primary w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "Confirmed" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-emerald-500 w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "rescheduled" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-rose-500 w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "rejected" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-red-500 w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "Completed" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-green-500 w-fit">
                      {data.status}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-span-2 h-full">
                <h1 className="font-semibold">Payment</h1>
                <div className="flex space-x-3 items-center">
                  {payImg ? (
                    <>
                      {payImg.map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col text-left items-center"
                        >
                          <p className="w-full">
                            {i === 0 && "1st attempt"}
                            {i === 1 && "2nd attempt"}
                            {i === 2 && "last attempt"}
                          </p>
                          <img
                            onClick={(e) =>
                              setImageModal(true) ||
                              e.preventDefault() ||
                              setPayName(item.name)
                            }
                            className="object-cover cursor-pointer shadow-xl w-[13rem] mb-5 h-[13rem]"
                            src={
                              CDNURL +
                              data.email +
                              "/payment/" +
                              data.book_id +
                              "/" +
                              item.name
                            }
                            alt="/"
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No Payment Sent</p>
                  )}
                </div>
              </div>
              {StatusVisible && (
                <div className="flex items-center space-x-6 col-span-4 mt-3 justify-end">
                  {data.status === "pending" && (
                    <div>
                      <button
                        onClick={(e) => setAccept(true) || e.preventDefault()}
                        className="transition py-2 px-7 flex items-center text-white duration-100 bg-green-600 hover:bg-green-800 rounded-full "
                      >
                        <LuCalendarCheck2 className="text-2xl mr-1" />
                        <span>Accept Appointment</span>
                      </button>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={(e) => setResched(true) || e.preventDefault()}
                      className="transition flex px-7 py-2 text-white duration-100 hover:bg-primary-700 bg-primary-500 rounded-full "
                    >
                      <TbCalendarTime className="text-2xl mr-1" />

                      <span>Reschedule Appointment</span>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={(e) => setReject(true) || e.preventDefault()}
                      className="transition flex items-center px-7 py-2 text-white duration-100 bg-red-600 hover:bg-red-800 rounded-full "
                    >
                      <LuCalendarX2 className="text-2xl mr-1" />
                      <span>Reject Appointment</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
          Doctor's details
        </h1>
        <section className="flex flex-col px-12 py-10 mt-10 rounded-xl bg-white w-[80%] abs">
          {loading ? (
            <div className="flex justify-center w-full ">
              <Oval
                height={80}
                width={80}
                color="#4fa94d"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          ) : (
            <div className="grid grid-cols-3 text-lg row-span-2 gap-3">
              {Doc && (
                <>
                  <div className="flex flex-col  text-center items-center">
                    <img
                      className="object-cover rounded-md shadow-xl w-[15rem] mb-5 h-[15rem]"
                      src={`${
                        isDocImgEmpty
                          ? CDNURL + Doc.email + "/profile/" + docImg
                          : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
                      }`}
                      alt="/"
                    />
                  </div>

                  <div className="flex flex-col text-left items-left mt-10 space-y-8 pr-6">
                    <p className="">
                      <span className="font-semibold">Doctor's Name:</span>
                      <br />
                      {Doc.honorific} {Doc.name}
                    </p>
                    <p>
                      <span className="font-semibold">Consultation type:</span>
                      <br />
                      {Doc.type === "ol"
                        ? "Online Consultation"
                        : "Face to face"}
                    </p>
                  </div>
                  <div className="flex flex-col text-left items-left mt-10 space-y-8 pr-6">
                    <p>
                      <span className="font-semibold">Doctor id:</span>
                      <br />
                      {Doc.id}
                    </p>
                    <p>
                      <span className="font-semibold">Specialization:</span>
                      <br />
                      {Doc.specialization}
                    </p>
                    <p>
                      <span className="font-semibold">Sub-specialization:</span>
                      <br />
                      {Doc.subspecial}
                    </p>
                  </div>
                </>
              )}
              <div className="col-span-4 flex justify-center text-xl font-semibold ">
                <p>Schedule</p>
              </div>
              <div className="flex-col items-center  col-span-4">
                <div className="bg-green-600 grid grid-cols-4 w-full text-white py-2 col-span-4 justify-center px-10">
                  <p className="col-span-2">Days</p>
                  <p className="text-center">Check In</p>
                  <p className="text-center">Check Out</p>
                </div>
                {Doc.schedule &&
                  Doc.schedule.map((item, i) => (
                    <div
                      key={i}
                      className="col-span-3 bg-slate-200 py-2 grid grid-cols-4 w-full my-3 px-10"
                    >
                      <div className="col-span-2 ">{item.day}</div>
                      <div className="text-center">
                        {moment(
                          new Date(`2000-01-01T${item.startTime}`)
                        ).format("LT")}
                      </div>
                      <div className="text-center">
                        {moment(
                          new Date(`2000-01-01T${item.startTime}`)
                        ).format("LT")}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
};
export default AppointmentDetails;

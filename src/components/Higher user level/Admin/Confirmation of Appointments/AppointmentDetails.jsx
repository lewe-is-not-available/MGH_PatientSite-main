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
  useEffect(() => {
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
    fetchData();
  }, [id]);
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
      setStatusVisible(false)
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
  //*date format
  const date = new Date(data.created_at);
  function formateDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
  }
  //*accepting the appointment
  const navigate = useNavigate();
  async function handleAccept(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("patient_Appointments")
      .update({ status: "Confirmed" })
      .eq("book_id", id);
    if (error) {
      console.log(error);
    }
    navigate("/Confirm_Appointments");
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

  //*Convert to am/pm time
  const convertToAMPM = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <ReschedConfirm user={user} setResched={setResched} id={id} />
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
            <div className="grid grid-cols-4 row-span-2">
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
              <div className="flex flex-col text-left items-left mt-10 space-y-3 row-span-2">
                <p>
                  <span className="font-semibold">Booking Reference id:</span>
                  <br />
                  {data.book_id}
                </p>
                <p>
                  <span className="font-semibold">Patient Birthdate:</span>
                  <br />
                  {data.bday}
                </p>
                <p>
                  <span className="font-semibold">Booked at:</span>
                  <br />
                  {formateDateTime(date)}
                </p>
                <p>
                  <span className="font-semibold">Appointment day:</span>
                  <br />
                  {data.date}
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
                <div className="flex flex-col justify-center space-x-3">
                  <span className="font-semibold">Queuing Number:</span>
                  <h2 className="text-6xl font-semibold">{data.queue}</h2>
                </div>
                <div className="flex flex-col text-left items-left mt-10 space-y-8">
                  {data.status === "rejected" ? (
                    <>
                      <div className="flex flex-col">
                        <span className="font-semibold">Status:</span>
                        <p className="px-3 text-white rounded-full bg-red-500 w-fit">
                          {data.status}
                        </p>
                        <p className="font-semibold mt-2">remark:</p>
                        <p>{data.remark}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col justify-center space-x-3">
                        <span className="font-semibold">Queuing Number:</span>
                        <h2 className="text-6xl font-semibold">6</h2>
                      </div>
                      <div>
                        <span className="font-semibold">Status:</span>
                        <br />
                        <p className="px-3 text-white rounded-full bg-primary w-fit">
                          {data.status}
                        </p>
                      </div>
                    </>
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
                  <div>
                    <button
                      onClick={(e) => setAccept(true) || e.preventDefault()}
                      className="transition py-2 px-7 flex items-center text-white duration-100 bg-green-600 hover:bg-green-800 rounded-full "
                    >
                      <LuCalendarCheck2 className="text-2xl mr-1" />
                      <span>Accept Appointment</span>
                    </button>
                  </div>
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
                  Doc.schedule.map((item) => (
                    <div className="col-span-3 bg-slate-200 py-2 grid grid-cols-4 w-full my-3 px-10">
                      <div className="col-span-2 ">{item.day}</div>
                      <div className="text-center">
                        {convertToAMPM(item.startTime)}
                      </div>
                      <div className="text-center">
                        {convertToAMPM(item.endTime)}
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

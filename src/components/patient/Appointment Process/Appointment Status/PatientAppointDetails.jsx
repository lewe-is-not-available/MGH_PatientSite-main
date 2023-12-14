import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import ImageModal from "../../../Higher user level/Admin/Confirmation of Appointments/ImageModal";
import moment from "moment/moment";
import { IoAdd, IoStar } from "react-icons/io5";
import AddModal from "./AddModal";
import ReactToPrint from "react-to-print";
import { TfiPrinter } from "react-icons/tfi";
import AppDetailPDF from "./AppDetailPDF";

const AppointmentDetails = () => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  //*Print function

  const AppPrint = useRef();

  //*get patient's appointment details
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [Email, setEmail] = useState("");
  const [isSomeone, setisSomeone] = useState();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("patient_Appointments")
      .select()
      .eq("book_id", id)
      .single();

    if (error) {
      toast.error(error + " error", {
        toastId: "error",
      });
    }
    if (data.someone === "Yes") {
      setisSomeone(true);
    } else {
      setisSomeone(false);
    }
    setEmail(data.email);
    setData(data);
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

  //*getting image for patient
  useEffect(() => {
    if (Email) {
      async function getImages() {
        const { data, error } = await supabase.storage
          .from("images")
          .list(Email + "/profile/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (data[0]) {
          setImgEmpty(true);
          setimgName(data[0].name);
        }

        if (error) {
          setImgEmpty(false);
          console.log(error);
        }
      }
      getImages();
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

  //*getting image for doctor
  const [docImg, setDocImg] = useState();
  const [isDocImgEmpty, setisDocImgEmpty] = useState(false);
  useEffect(() => {
    if (Doc.email) {
      async function getImageDoc() {
        const { data, error } = await supabase.storage
          .from("images")
          .list(Doc.email + "/profile/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (data[0]) {
          setisDocImgEmpty(true);
          setDocImg(data[0].name);
        }

        if (error) {
          setisDocImgEmpty(false);
          console.log(error);
        }
      }
      getImageDoc();
    }
  }, [Doc]);
  //*Realtime
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      await fetchDoc();
      const realtime = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "dr_information",
            filter: `name=eq.${data.docname}`,
          },
          (payload) => {
            fetchDoc(payload.new.data);
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [data.docname]);

  //*get payment
  const [payImg, setPayImg] = useState([]);
  const [PayName, setPayName] = useState();
  const [imageModal, setImageModal] = useState(false);
  const [addImg, setAddImg] = useState(false);
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

  //*Disable scroll
  if (addImg || imageModal) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }

  //*Rating function
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState();
  const [message, setMessage] = useState();
  const [Load, setLoad] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoad(true);
    if (rating === null) {
      toast.error("Please give us a rating before submitting", {
        autoClose: false,
        id: "error",
      });
      setLoad(false);
      return;
    }
    const { error } = await supabase.from("ratings").insert({
      user_id: data.user_id,
      message,
      rate: rating,
      isconsult: "yes",
    });
    try {
      if (error) throw error;
      else {
        setSubmitted(true);
        setLoad(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoad(false);
    }
  }
  return (
    <>
      <div className="sticky top-1">
        {imageModal && (
          <ImageModal
            CDNURL={CDNURL}
            email={data.email}
            book_id={data.book_id}
            payImg={PayName}
            setImageModal={setImageModal}
          />
        )}
        {addImg && (
          <AddModal payImg={payImg} data={data} setAddImg={setAddImg} />
        )}
      </div>
      <div className="back flex flex-col items-center min-h-screen h-auto pb-10 w-full">
        <div className="hidden">
          <AppDetailPDF
            AppPrint={AppPrint}
            data={data}
            isImgEmpty={isImgEmpty}
            CDNURL={CDNURL}
            imgName={imgName}
            isSomeone={isSomeone}
            payImg={payImg}
            Doc={Doc}
            isDocImgEmpty={isDocImgEmpty}
            docImg={docImg}
          />
        </div>

        <div className="grid grid-cols-3 h-full w-full">
          <div className=""></div>

          <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
            Appointment details
          </h1>

          <div className="w-full flex justify-center items-center mt-5 -ml-6">
            {(data.status !== "pending" || data.status !== "rejected") && (
              <ReactToPrint
                trigger={() => {
                  return (
                    <button className="flex items-center bg-primary-300 hover:text-white py-1 transition duration-100 hover:bg-primary-600 px-3 rounded-full">
                      <TfiPrinter className="text-lg mr-1" />
                      Print
                    </button>
                  );
                }}
                content={() => AppPrint.current}
                documentTitle="Appointment Details"
                pageStyle="print"
              />
            )}
          </div>
        </div>

        <section className="flex flex-col px-12 py-10 mt-10 rounded-lg bg-white w-[80%] abs">
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
                    {data.email}
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
                  <span className="font-semibold">Booked at:</span>
                  <br />
                  {/* {formateDateTime(date)} */}
                  {moment(new Date(data.created_at)).format("lll")}
                </p>
                <p>
                  <span className="font-semibold">Appointment day:</span>
                  <br />
                  {moment(new Date(data.date)).format("ll")}
                </p>
                <p>
                  <span className="font-semibold">Patient Birthdate:</span>
                  <br />
                  {moment(new Date(data.bday)).format("ll")}
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
              <div className="flex flex-col mt-10 space-y-4 mx-3">
                {(data?.status === "Confirmed" ||
                  data?.status === "rescheduled") && (
                  <div className="flex flex-col justify-center mb-10 space-x-3">
                    <span className="font-semibold">Queuing Number:</span>
                    <h2 className="text-6xl font-semibold">{data.queue}</h2>
                  </div>
                )}
                <div>
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
                  {data.status === "pending request" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-primary w-fit">
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
                  {data.status === "Awaiting Doctor's Confirmation" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-emerald-500 w-fit">
                      {data.status}
                    </p>
                  )}
                </div>
                {(data.status === "rejected" ||
                  data.status === "rescheduled") && (
                  <div><span className="font-semibold">remarks: <br /></span>{data.remark}</div>
                )}
              </div>

              {data.status !== "Completed" ? (
                <div className="col-span-2 h-full mt-6">
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
                    {data.status !== "rejected" && payImg.length !== 3 && (
                      <div
                        onClick={() => setAddImg(true)}
                        className="w-[13rem] h-[13rem] transition duration-100 border-2 border-dashed 
                  border-slate-400 hover:bg-slate-300 cursor-pointer justify-center text-center bg-slate-200 flex flex-col items-center"
                      >
                        <IoAdd className="text-5xl" />
                        <p className="text-sm w-full whitespace-nowrap">
                          add another screenshot
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {Load ? (
                    <>Loading</>
                  ) : (
                    <>
                      {submitted ? (
                        "submitted"
                      ) : (
                        <form onSubmit={onSubmit} className="w-full">
                          <label className="text-lg">
                            How was your consultation?
                          </label>
                          <div className="flex items-center justify-center mt-2 space-x-3 text-5xl text-slate-500">
                            {[...Array(5)].map((star, i) => {
                              const currentRating = i + 1;
                              return (
                                <label>
                                  <input
                                    type="radio"
                                    className="hidden"
                                    value={currentRating}
                                    onClick={() => setRating(currentRating)}
                                  />
                                  <IoStar
                                    className={
                                      currentRating <= (hover || rating)
                                        ? "text-[#ffc107]"
                                        : "text-[#c4e5e9]"
                                    }
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                  />
                                </label>
                              );
                            })}
                          </div>
                          <textarea
                            placeholder="Tell us something more about your experience"
                            type="text"
                            className="w-full p-2 border-2 border-slate-400 mt-3 mb-6"
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button
                            type="submit"
                            className="px-8 py-2 rounded-md transition duration-100 border-[#16891d] border-[2px] hover:bg-[#16891d] hover:text-white bg-[#a5e5a9] text-[#106716]"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </section>
        <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
          Doctor's details
        </h1>
        <section className="flex flex-col px-12 py-10 mt-10 rounded-lg bg-white w-[80%] abs">
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

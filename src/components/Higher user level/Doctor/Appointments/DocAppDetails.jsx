import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { TbCalendarTime } from "react-icons/tb";
import ReschedConfirm from "../../Admin/Confirmation of Appointments/ReschedConfirm";
import ImageModal from "../../Admin/Confirmation of Appointments/ImageModal";
import moment from "moment";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import Notif from "./Notif";
import AppDetailPDF from "../../../patient/Appointment Process/Appointment Status/AppDetailPDF";
import ReactToPrint from "react-to-print";
import { TfiPrinter } from "react-icons/tfi";

const DocAppDetails = ({ user }) => {
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
        .channel("room13")
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
  }, [setimgName, Email, setImgEmpty]);
  //*Get doctor details
  const [Doc, setDoc] = useState([]);
  async function fetchDoc() {
    if (data.doc_id) {
      const { data: DocDetails, error: failDoc } = await supabase
        .from("dr_information")
        .select()
        .eq("id", data.doc_id)
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

  //*Modal States
  const [resched, setResched] = useState(false);
  const [notif, setNotif] = useState(false);
  const [imageModal, setImageModal] = useState(false);

  if (resched || imageModal) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }
  const AppPrint = useRef();

  return (
    <>
      <div className="sticky top-1">
        {notif && <Notif setReject={setNotif} id={data.book_id} />}
      </div>
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
        {resched && (
          <ReschedConfirm setResched={setResched} id={id} user={user} />
        )}
      </div>

      <div className="back flex flex-col items-center h-auto pb-14 min-h-screen w-full">
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
        <div className="grid grid-cols-3 w-full items-center justify-center">
          <div className=""></div>
          <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
            Appointment details
          </h1>
          <div className="w-full flex justify-center items-center mt-5 -ml-6">
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
          </div>
        </div>

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
                    {data.fname}
                    {data.lname}
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
              <div className="flex flex-col text-left items-left mt-10 space-y-5 row-span-2">
                <div>
                  <span className="font-semibold">Booking Reference id:</span>
                  <br />
                  <p className="flex-wrap flex w-[17rem]">{data.book_id}</p>
                </div>
                <p>
                  <span className="font-semibold">Patient Birthdate:</span>
                  <br />
                  {moment(new Date(data.bday)).format("LL")}
                </p>
                <p>
                  <span className="font-semibold">Booked at:</span>
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
                {data?.type !== "f2f" && (
                  <div className="flex flex-col justify-center space-x-3">
                    <span className="font-semibold">Queuing Number:</span>
                    <h2 className="text-6xl font-semibold">{data.queue}</h2>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold">Status:</span>
                  {data.status === "Consultation Ongoing" && (
                    <p className="px-4 py-1 text-white rounded-full bg-green-500 w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "pending confirmation" && (
                    <p className="px-4 py-1 text-white rounded-full bg-primary w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "Confirmed" && (
                    <p className="px-4 py-1 flex items-center text-white rounded-full bg-emerald-500 w-fit">
                      {data.status}
                    </p>
                  )}
                  {data.status === "Completed" && (
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
              {data.status !== "Completed" && (
                <>
                  <div className="flex items-center space-x-6 col-span-4 mt-3 justify-end">
                    <div>
                      <button
                        onClick={(e) => setResched(true) || e.preventDefault()}
                        className="transition flex px-7 py-2 text-white duration-100 hover:bg-red-700 bg-red-500 rounded-full "
                      >
                        <TbCalendarTime className="text-2xl mr-1" />
                        <span>Reschedule Appointment</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default DocAppDetails;

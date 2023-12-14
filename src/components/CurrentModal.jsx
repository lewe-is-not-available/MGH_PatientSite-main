import React, { useEffect, useRef, useState } from "react";
import logo from "./images/MGHlogo.png";
import supabase from "./config/Supabase";
import { IoEnterOutline, IoStar } from "react-icons/io5";
import { CiWarning } from "react-icons/ci";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";

const CurrentModal = ({ data, doc, isElapsed, setCurrModal }) => {
  //*getting image for patient
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);
  useEffect(() => {
    async function getImages() {
      const { data: patientImg, error: ImgErr } = await supabase.storage
        .from("images")
        .list(data?.email + "/profile/", {
          limit: 10,
          offset: 0,
          sortBy: { column: "created_at", order: "asc" },
        });

      if (patientImg[0]) {
        setImgEmpty(true);
        setimgName(patientImg[0].name);
      }

      if (ImgErr) {
        setImgEmpty(false);
        console.log(ImgErr);
      }
    }
    getImages();
  }, [data]);
  const isCompleted = data?.status === "Completed";

  let modalRef = useRef();
  useEffect(() => {
    if (isElapsed || isCompleted) {
      let handler = (e) => {
        if (!modalRef.current?.contains(e.target)) {
          setCurrModal(false);
        }
      };

      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  }, [isElapsed, isCompleted]);

  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState();
  const [message, setMessage] = useState();
  const [load, setLoad] = useState(false);
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
    const { error } = await supabase
      .from("ratings")
      .insert({ user_id: data.id, message, rate: rating, isconsult: "yes" });
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
    <section className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white sticky top-10 -mt-[8rem] flex w-[65rem] min:h-[70%] flex-col items-center abs rounded-lg p-9"
      >
        <div className="sticky top-0 w-full flex flex-col items-center">
          <h1 className="text-green-800 font-semibold text-[33px] uppercase">
            consultation ongoing
          </h1>
          <div className="border-b-2 border-green-700 my-3 w-full"></div>
          <div className="w-full px-10 h-[70%] overflow-y-auto">
            <div className="company py-7  px-[8%] w-full flex justify-center items-center">
              <img src={logo} className="w-[7rem]" alt="/" />
              <p className="uppercase text-white font-semibold text-4xl">
                mendoza general <br /> hospital
              </p>
            </div>
            <div className="sticky w-full -mt-[4rem] -ml-[10rem] flex justify-center items-center">
              <img
                className="object-cover rounded-full border-[7px] bg-white border-white 
                shadow-xl w-[12rem] mb-5"
                src={`${
                  isImgEmpty
                    ? CDNURL + data?.email + "/profile/" + imgName
                    : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                }`}
                alt="/"
              />
              <p className="text-3xl font-semibold mt-7 ml-3 uppercase text-left">
                {data?.fname} {data?.lname} <br />
                <span className="normal-case font-light text-2xl">Patient</span>
              </p>
            </div>
            {isCompleted ? (
              <>
                {load ? (
                  <>Loading</>
                ) : (
                  <>
                    {submitted ? (
                      <div className="text-center w-full flex flex-col items-center mt-10">
                        <p className="text-3xl flex w-full items-center justify-center text-green-600">
                          <FaCheckCircle className="text-3xl mr-1" />{" "}
                          <span>Review Submitted Succesfully!</span>
                        </p>
                        <p className="text-xl mt-2">
                          Thank you for your response
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={onSubmit} className="w-full">
                        <label className="text-lg">How was your consultation with {doc.honorific} {doc.name}?</label>
                        <div className="flex items-center justify-center mt-2 space-x-3 text-5xl text-slate-500">
                          {[...Array(5)].map((star, i) => {
                            const currentRating = i + 1;
                            return (
                              <label key={i}>
                                <input
                                  required
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
                          required
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
            ) : (
              <>
                {isElapsed ? (
                  <div className="flex flex-col justify-center items-center h-36">
                    <p className="text-red-500 flex items-center text-2xl">
                      <CiWarning className="text-3xl" />
                      <span>
                        Your consultation has exceeded the schedule of your
                        doctor
                      </span>
                    </p>
                    <p className="text-xl mt-3 ">
                      Waiting for the doctor's response to see if you've
                      attended and finished the meeting or not.
                    </p>
                    <Link
                      onClick={() => setCurrModal(false)}
                      to={"/Appointment/Patient/Details/" + data.book_id}
                      className="px-5 py-2 text-xl mt-5 text-white bg-green-500 rounded-lg"
                    >
                      Check your appointment details
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className=" w-full flex space-x-7 justify-between">
                      <div className="flex flex-col w-[70%]">
                        <span className="text-green-900 text-2xl font-semibold">
                          Doctor
                        </span>
                        <p className="whitespace-nowrap">{doc?.name}</p>
                        <p>{doc?.specialization}</p>
                      </div>
                      <div className="flex flex-col w-full">
                        <span className="text-green-900 text-2xl w-full font-semibold">
                          Reason of appointment
                        </span>
                        <p>{data?.reason}</p>
                      </div>

                      <div className="flex flex-col w-full">
                        <span className="text-green-900 text-xl w-full font-semibold">
                          Click the button below to attend your consultation
                          meeting
                        </span>

                        <a
                          href={doc?.gmeet}
                          className="flex items-center mt-6 rounded-lg bg-green-500 px-5 py-[6px] w-fit text-white"
                        >
                          <IoEnterOutline className="text-3xl mr-2" />
                          Enter Consultation
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center my-3">
                      <div className="flex flex-col text-2xl">
                        <span className="text-green-900 font-semibold">
                          Queue number
                        </span>
                        <p className="text-4xl text-slate-500">{data?.queue}</p>
                      </div>
                      <div className="p-2 bg-red-400 text-white ml-20">
                        Your doctor is waiting, please attend your consultation
                        now
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentModal;

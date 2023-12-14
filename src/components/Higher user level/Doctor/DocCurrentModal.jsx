import React, { useEffect, useRef, useState } from "react";
import logo from "../../images/MGHlogo.png";
import { IoEnterOutline } from "react-icons/io5";
import { CiWarning } from "react-icons/ci";
import { Link } from "react-router-dom";
import supabase from "../../config/Supabase";
import { TbPlayerTrackNext } from "react-icons/tb";

const DocCurrentModal = ({
  data,
  doc,
  setCurrModal,
  nextQueue,
  setNext,
  next,
  last,
  setLast,
  load
}) => {
  let modalRef = useRef();
  useEffect(() => {
    if (!next && !last) {
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
  }, [modalRef, next, last]);
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

  return (
    <section className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full min-h-screen h-full z-40 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white sticky top-36 -mt-[8rem] flex w-[65rem] h-[58%] flex-col items-center abs rounded-lg p-6"
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
                  !load && imgName && isImgEmpty
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
            <>
              <div className=" w-full flex space-x-7 justify-between">
                <div className="flex flex-col w-[70%]">
                  <span className="text-green-900 text-2xl font-semibold">
                    Contact Details
                  </span>
                  <p>{data?.email}</p>
                  <p>{data?.number}</p>
                </div>
                <div className="flex flex-col w-full">
                  <span className="text-green-900 text-2xl w-full font-semibold">
                    Queue number
                  </span>
                  <p className="text-5xl text-slate-500">{data?.queue}</p>
                </div>

                <div className="flex flex-col w-full">
                  <span className="text-green-900 text-xl w-full font-semibold">
                    Reason for the appointment
                  </span>
                  <p>{data?.reason}</p>
                </div>
              </div>
            </>
          </div>
          <div className="sticky bottom-9 py-2 w-full space-x-7 bg-white flex justify-center items-center my-3">
            <a
              href={doc?.gmeet}
              className="flex items-center text-xl mt-6 rounded-lg transition duration-100 hover:bg-green-600 bg-green-500 px-5 py-[6px] w-fit text-white"
            >
              <IoEnterOutline className="text-3xl mr-2" />
              Enter Gmeet
            </a>
            {nextQueue.length === 0 ? (
              <button
                onClick={(e) => setLast(true) || e.preventDefault()}
                className="flex items-center mt-6 rounded-lg text-xl transition duration-100 hover:bg-green-600 bg-green-500 px-5 py-[6px] w-fit text-white"
              >
                <IoEnterOutline className="text-3xl mr-2" />
                Finish Consultation
              </button>
            ) : (
              <button
                onClick={(e) => setNext(true) || e.preventDefault()}
                className="flex items-center mt-6 rounded-lg text-xl transition duration-100 hover:bg-green-600 bg-green-500 px-5 py-[6px] w-fit text-white"
              >
                <TbPlayerTrackNext className="text-3xl mr-2" />
                Proceed to next consultation
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocCurrentModal;

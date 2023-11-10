import React, { useState, useEffect, useRef } from "react";
// import Medical from "./Medical";
// import { Link } from "react-router-dom";
// import SomeonDetails from "./SomeoneDetails";
//import { toast } from "react-toastify";
//import F2f from "./F2f";
//import supabase from "../../../config/Supabase";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { MdEmail, MdPhone, MdAccessTimeFilled } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";

const Online = ({ ol, CDNURL, getImages }) => {
  //*expand details
  const [expand, setExpand] = useState(false);

  function handleExpand(e) {
    e.preventDefault(); // Prevent the event from propagating to the parent Link component
    setExpand(!expand);
  }
  //*close expan when clicked outside
  let detailsRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!detailsRef.current.contains(e.target)) {
        setExpand(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setExpand]);
  //*date format
  const date = new Date(ol.created_at);
  function formateDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
  }
  //const CreatedAt = formateDateTime(date);
  //*if booked by someone set viewable
  const [isSomeone, setSomeone] = useState(false);
  const [SomeoneModal, setSomeoneModal] = useState(null);
  const id = ol.user_id;
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  useEffect(() => {
    getImages(id, setimgName, setImgEmpty);
  }, [ol]);

  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 1000 });
    Aos.refresh();
  }, []);

  // document.querySelectorAll("img")
  //   .forEach((img) => 
  //     img.addEventListener("load",() => 
  //       Aos.refresh()
  //     )
  // );

  return (
    <div
      data-aos="fade-right"
      key={ol.user_id}
      className="text-base flex w-full"
    >
      <section
        ref={detailsRef}
        onClick={handleExpand}
        className="group/pu bg-white abs mb-2 cursor-pointer text-gray-900 w-full rounded-xl transition duration-75 ease-in hover:bg-slate-100 text-center  "
      >
        <div
          scope="row"
          className=" py-3 mx-6 flex font-medium whitespace-nowrap justify-between"
        >
          <div className="flex">
            <img
              className="object-cover rounded-full w-[4rem] h-[4rem]"
              src={`${
                isImgEmpty
                  ? CDNURL + id + "/" + imgName
                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
              }`}
              alt="/"
            />
            <div className="ml-4 flex-col text-left text-sm">
              <p className="text-base uppercase font-semibold text-green-800">
                {ol.lname} {ol.fname}
              </p>
              <p className="">
                <span className="font-semibold text-green-950">
                  Booked at:{" "}
                </span>
                {formateDateTime(date)}
              </p>
              <p>
                <span className="font-semibold text-green-950">
                  Doctor Name:{" "}
                </span>
                {ol.docname}
              </p>
              <div
                className={`${
                  expand
                    ? "transition-all duration-300 ease-in overflow-y-visible max-h-[20rem]"
                    : "transition-all duration-300 ease-out overflow-y-hidden max-h-0"
                }`}
              >
                <div className="grid grid-cols-4 mt-3 gap-y-3 ">
                  <BsFillCalendarCheckFill className="text-lg  pr-[2px] pb-4 pt-2 row-span-2 h-full w-[24px]  text-green-600" />
                  <label className="w-fit text-base -ml-5 grid row-span-2 col-span-3  text-black">
                    Scheduled at <p className="text-slate-400">{ol.date}</p>
                  </label>
                  <MdAccessTimeFilled className="text-lg pb-3 pt-2 row-span-2 h-full w-[px] text-green-600" />
                  <label className="w-fit text-base -ml-5 grid row-span-2 col-span-3  text-black">
                    Time <p className="text-slate-400">{ol.time}</p>
                  </label>
                  <MdEmail className="text-lg pr-[2px]pb-4 pt-2 row-span-2 h-full w-[26px] text-green-600" />
                  <label className="w-fit text-base -ml-5 grid row-span-2 col-span-3  text-black">
                    Email <p className="text-slate-400">{ol.email}</p>
                  </label>
                  <MdPhone className="text-lg pr-[2px] pb-4 pt-2 row-span-2 h-full w-[26px] text-green-600" />
                  <label className="w-fit text-base -ml-5 grid row-span-2 col-span-3  text-black">
                    Phone <p className="text-slate-400">{ol.number}</p>
                  </label>
                </div>
                <div className="bg-slate-200 max-w-full flex justify-center ">
                  <Link
                    to={"/Appointment_Details/" + ol.book_id}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="px-3 transition duration-100 hover:text-white hover:bg-slate-600 bg-slate-100 rounded-md">
                      Appointment Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex self-start mt-2">
            <p className="bg-primary-500 text-center w-fit px-3 h-fit self-center mr-3 text-white rounded-full">
              {ol.status}
            </p>
            <button className=" mr-2 text-lg transition duration-200 group-hover/pu:bg-slate-400 p-3 rounded-lg">
              <div>
                <AiOutlineDown
                  className={`${
                    expand
                      ? "rotate-180 transition duration-300"
                      : "rotate-0 transition duration-300"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Online;

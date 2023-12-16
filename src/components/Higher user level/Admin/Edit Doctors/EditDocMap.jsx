import React, { useState, useEffect, useRef } from "react";
import supabase from "../../../config/Supabase";
import Aos from "aos";
import "aos/dist/aos.css";
import { MdEmail, MdPhone } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { HiClipboardList } from "react-icons/hi";

const EditDocMap = ({ ol }) => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";

  //TODO fix scroll animation
  //*expand details
  const [expand, setExpand] = useState(false);

  function handleExpand(e) {
    e.preventDefault(); // Prevent the event from propagating to the parent Link component
    setExpand(!expand);
  }
  //*close expan when clicked outside
  let detailsRef = useRef();
  useEffect(() => {
    if (ol) {
      let handler = (e) => {
        if (!detailsRef.current.contains(e.target)) {
          setExpand(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  }, [setExpand, ol]);

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

  const id = ol.email;
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(id + "/profile/", {
        limit: 100,
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
  useEffect(() => {
    if (ol) {
      getImages();
    }
  }, [ol]);

  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 500 });
    Aos.refresh();
  }, []);
  //console.log(CDNURL + ol.email + "/profile/" + imgName);
  return (
    <section key={ol.id} className="text-base flex w-full select-none">
      <div
        data-aos="fade-right"
        data-aos-anchor="#trigger-next"
        ref={detailsRef}
        onClick={handleExpand}
        className="group/pu bg-white abs mb-3 cursor-pointer text-gray-900 w-full rounded-xl transition duration-75 ease-in hover:bg-slate-100 text-center  "
      >
        <div
          id="trigger-next"
          scope="row"
          className=" py-3 mx-6 flex font-medium whitespace-nowrap justify-between"
        >
          <div className="flex">
            <img
              className="object-cover rounded-full w-[4rem] h-[4rem]"
              src={`${
                isImgEmpty
                  ? CDNURL + ol.email + "/profile/" + imgName
                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
              }`}
              alt="/"
            />
            <div className="ml-4 flex-col text-left text-sm">
              <p className="text-base uppercase font-semibold text-green-800">
                {ol.honorific} {ol.name}
              </p>
              <p className="">
                <span className="font-semibold text-green-950">
                  Specialization:{" "}
                </span>
                {ol.specialization}
              </p>
              <p>
                <span className="font-semibold text-green-950">
                  Sub-specialization:{" "}
                </span>
                {ol.subspecial}
              </p>
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
        <div
          className={`${
            expand
              ? "transition-all duration-300 ease-in overflow-y-visible opacity-100 max-h-[20rem]"
              : "transition-all duration-300 ease-out overflow-y-hidden opacity-0 max-h-0"
          }`}
        >
          <div className={`flex flex-col items-start mx-[6.4rem] mt-3 gap-y-3`}>
            <div className="flex">
              <BsFillCalendarCheckFill className="text-lg pr-[2px] pb-4 pt-2 row-span-2 h-full w-[24px]  text-green-600" />
              <label className="w-fit ml-4 text-left text-base text-black">
                Schedules{" "}
                <label className="text-slate-400 flex">
                  {ol.schedule &&
                    ol.schedule.map((sched, i) => (
                      <p 
                      key={i}
                      className="p-2 rounded-sm mr-2 bg-opacity-20 text-slate-400 bg-green-600">
                        {sched.day === "Thursday" ? "Th" : sched.day[0] + " "}
                      </p>
                    ))}
                </label>
              </label>
            </div>
            <div className="flex">
              <HiClipboardList className="text-lg pb-3 pt-2 row-span-2 h-full w-[26px] text-green-600" />
              <label className="w-fit ml-4 text-left text-base grid row-span-2 text-black">
                Consultation Type{" "}
                <p className="text-slate-400">
                  {ol.type === "ol"
                    ? "Online Consultations"
                    : "Face to face Consultations"}
                </p>
              </label>
            </div>

            <div className="flex">
              {" "}
              <MdEmail className="text-lg pr-[2px]pb-4 pt-2 row-span-2 h-full w-[26px] text-green-600" />
              <label className="w-fit ml-4 text-left text-base grid row-span-2 text-black">
                Email <p className="text-slate-400">{ol.email}</p>
              </label>
            </div>

            <div className="flex">
              {" "}
              <MdPhone className="text-lg pr-[2px] pb-4 pt-2 row-span-2 h-full w-[26px] text-green-600" />
              <label className="w-fit ml-4 text-left text-base grid row-span-2 text-black">
                Phone <p className="text-slate-400">{ol.phone}</p>
              </label>
            </div>
          </div>
          <div className="max-w-full mb-5 flex justify-center space-x-10">
            <Link
              to={"/Doctor_Details/" + ol.id}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="text-lg px-20 py-1 transition duration-100 hover:bg-[#377532] bg-[#3dbb34] text-white rounded-md">
                Doctor Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditDocMap;

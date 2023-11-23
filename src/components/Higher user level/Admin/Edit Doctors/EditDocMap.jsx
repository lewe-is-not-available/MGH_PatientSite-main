import React, { useState, useEffect, useRef } from "react";
import supabase from "../../../config/Supabase";
import Aos from "aos";
import "aos/dist/aos.css";
import { MdEmail, MdPhone, MdAccessTimeFilled } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";

const EditDocMap = ({ ol }) => {
  console.log(ol);
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";

  //TODO fix scroll animation
  //*expand details
  const [expand, setExpand] = useState(false);

  function handleExpand(e) {
    e.preventDefault(); // Prevent the event from propagating to the parent Link component
    setExpand(!expand);
  }
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
      .list(id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (data[1]) {
      setImgEmpty(true);
      setimgName(data[1].name);
    }

    if (error) {
      setImgEmpty(false);
      console.log(error);
    }
  }
  useEffect(() => {
    if (ol) {
      getImages(id, setimgName, setImgEmpty);
    }
  }, [ol, id, setImgEmpty, setimgName]);

  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 500 });
    Aos.refresh();
  }, []);

  return (
    <div
      data-aos="fade-up"
      key={ol.user_id}
      className="text-base flex w-full justify-center select-none"
    >
      <div
        className="docs bg-[#A5DD9D] max-[941px]:w-[16rem] max-[941px]:text-sm max-[941px]:px-5
        max-lg:w-[18rem] max-2xl:px-3 max-sm:w-[11rem] max-sm:text-[11px] max-sm:py-5 py-9 px-6 mb-9 rounded-xl 
        flex flex-col items-center space-y-3 max-sm:space-y-0 w-[20rem] text-base transition duration-100 ease-in-out
        "
      >
        <img
          src={`${
            isImgEmpty
              ? CDNURL + ol.email + "/" + imgName
              : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
          }`}
          alt="/"
          className="w-[15rem] max-2xl:w-[13rem] max-sm:w-[10rem] max-sm:mb-3 mb-6 rounded-lg"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        />
        <div className="w-full items-center flex flex-col">
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 font-bold">Name:</span>
            <p className="">{ol.Name}</p>
          </div>
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 w-fit whitespace-nowrap font-bold">
              Specialization:{" "}
            </span>
            <p className=" whitespace-nowrap overflow-hidden max-sm:max-w-[4.3rem] text-center overflow-ellipsis">
              {ol.specialization}
            </p>
          </div>
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 w-fit whitespace-nowrap font-bold">
              Sub-Special:{" "}
            </span>
            <p className="max-w-[10rem] max-[941px]:max-w-[7rem] max-sm:max-w-[4.3rem] whitespace-nowrap overflow-hidden text-center overflow-ellipsis">
              {ol.SubSpecial}
            </p>
          </div>
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 font-bold">Schedule: </span>
            <p className="mb-2">{ol.Schedule}</p>
          </div>
        </div>

        <Link
          to={"/ChooseType/" + ol.id}
          data-aos="fade-up"
          className="text-base max-sm:text-[11px] max-sm:px-1 max-sm:py-0 whitespace-nowrap bg-[#418D3F] max-[941px]:text-sm p-2 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]"
        >
          BOOK AN APPOINTMENT
        </Link>
      </div>
    </div>
  );
};

export default EditDocMap;

import React, { useState, useEffect, useRef } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import supabase from "../../config/Supabase";
import moment from "moment";

import { RiInformationLine } from "react-icons/ri";
import { Link } from "react-router-dom";

const TodayModalMap = ({ ol, setResched, setBookID, i }) => {
  //TODO fix scroll animation
  //*expand details
  const [expand, setExpand] = useState(false);
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  function handleExpand(e) {
    e.preventDefault();
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

  const id = ol.email;
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(id + "/profile/", {
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
    <>
      <div key={i} className="text-base flex w-full select-none">
        <section
          data-aos="fade-right"
          data-aos-anchor="#trigger-next"
          ref={detailsRef}
          className="group/pu bg-white abs mb-3 text-gray-900 w-full rounded-xl transition duration-75 ease-in hover:bg-slate-100 text-center  "
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
                    : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                }`}
                alt="/"
              />
              <div className="ml-4 flex-col text-left text-sm">
                <p className="text-base uppercase font-semibold text-green-800">
                  {ol.fname} {ol.lname} <span className="text-green-700 font-light normal-case">{ i === 0 && "(Next in consultation)"}</span>
                </p>
                <p className="">
                  {" "}
                  <span className="font-semibold text-green-950">
                    Queue No.:{" "}
                  </span>
                  {ol.queue}
                </p>
                <p>
                  <span className="font-semibold text-green-950">
                    Reason:{" "}
                  </span>
                  {ol.reason}
                </p>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Link
                to={"/Doctor/Appointments/Details/" + ol.book_id}
                className="bg-green-600 hover:bg-green-500 transition duration-100 flex text-center w-fit px-7 py-1 h-fit self-center mr-3 text-white rounded-lg"
              >
                <RiInformationLine className="text-2xl mr-1" />
                <span>View Details</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TodayModalMap;

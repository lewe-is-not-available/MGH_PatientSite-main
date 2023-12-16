import React, { useState, useEffect, useRef } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { MdEmail, MdPhone, MdAccessTimeFilled } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import moment from "moment/moment";
import supabase from "../../../config/Supabase";

const StatusMap = ({ ol }) => {
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

  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 500 });
    Aos.refresh();
  }, []);

  const [doc, setDoc] = useState();
  useEffect(() => {
    async function fetchDoc() {
      const { data: doct, error: docErr } = await supabase
        .from("dr_information")
        .select()
        .eq("name", ol?.docname)
        .single();
      if (docErr) {
        console.log(docErr.message);
      } else if (doct) {
        setDoc(doct);
      }
    }
    fetchDoc();
  }, [ol]);

  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  useEffect(() => {
    async function getImages() {
      const { data, error } = await supabase.storage
        .from("images")
        .list(doc?.email + "/profile/", {
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
  }, [doc]);
  return (
    <div key={ol.book_id} className="text-base flex w-full select-none">
      <div
        data-aos="fade-right"
        data-aos-anchor="#trigger-next"
        ref={detailsRef}
        onClick={handleExpand}
        className="group/pu bg-white abs mb-3 text-gray-900 w-full rounded-xl transition duration-75 ease-in hover:bg-slate-100 text-center  "
      >
        <div
          id="trigger-next"
          className=" py-3 mx-6 flex font-medium whitespace-nowrap justify-between"
        >
          <div className="flex">
            <img
              className="object-cover rounded-full w-[4rem] h-[4rem]"
              src={`${
                isImgEmpty
                  ? CDNURL + doc?.email + "/profile/" + imgName
                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
              }`}
              alt="/"
            />
            <Link
              to={"/Appointment/Patient/Details/" + ol.book_id}
              className="ml-4 flex-col text-left text-sm"
            >
              <p className="text-base uppercase font-semibold text-green-800">
                {ol.honorific}
                {ol.docname}
              </p>
              <p>
                <span className="font-semibold text-green-950">Created </span>
                {moment(new Date(ol.created_at)).calendar()}
              </p>
              <p className="">
                <span className="font-semibold text-green-950">
                  Appointed at:{" "}
                </span>
                {moment(new Date(ol.date)).format("LL")}
              </p>
            </Link>
          </div>
          <div className="flex items-center mt-2 mr-10">
            {ol.status === "Consultation Ongoing" && (
              <p className="px-3 items-center text-white rounded-full h-fit bg-green-500 w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "pending confirmation" && (
              <p className="px-3 items-center text-white rounded-full h-fit bg-primary w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "Confirmed" && (
              <p className="px-3 flex items-center text-white rounded-full h-fit bg-emerald-500 w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "Completed" && (
              <p className="px-3 flex items-center text-white rounded-full h-fit bg-emerald-500 w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "pending request" && (
              <p className="px-3 flex items-center text-white rounded-full h-fit bg-primary w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "rescheduled" && (
              <p className="px-3 flex items-center text-white rounded-full h-fit bg-rose-500 w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "rejected" && (
              <p className="px-3 flex items-center text-white rounded-full h-fit bg-red-500 w-fit">
                {ol.status}
              </p>
            )}
            {ol.status === "Awaiting Doctor's Confirmation" && (
              <p className="px-3 flex items-center text-white rounded-full h-fit bg-emerald-500 w-fit">
                {ol.status}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusMap;

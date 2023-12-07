import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// ICONS
import { IoCalendar } from "react-icons/io5";
import { BsBell } from "react-icons/bs";
import { LuClock4 } from "react-icons/lu";

import moment from "moment/moment";
import supabase from "./config/Supabase";

function NotificationConfig({ data }) {
  //*get profile image
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [img, setImg] = useState();
  const [isImgEmpty, setImgEmpty] = useState(false);
  async function getImages() {
    const { data: image, error } = await supabase.storage
      .from("images")
      .list(data.email + "/profile/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (image[0]) {
      setImgEmpty(true);
      setImg(image[0].name);
    } else if (error) {
      setImgEmpty(false);
      console.log(error);
    }
  }
  useEffect(() => {
    getImages();
  }, []);

  return (
    <Link
      to={"/Appointment/Admin/Details/" + data.book_id}
      className="abs bg-white w-[800px] py-2 px-5 flex gap-2 mt-2 rounded-md"
    >
      <div className="flex items-center">
        <div className="flex items-end">
          {/* Image */}
          <img
            className="object-cover rounded-full w-[4rem] h-[4rem]"
            src={`${
              isImgEmpty
                ? CDNURL + data.email + "/profile/" + img
                : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
            }`}
            alt="/"
          />
          {data.status === "rescheduled" && (
            <IoCalendar className="bg-red-500 px-1 text-[30px] rounded-full -ml-7 text-white" />
          )}
          {data.status === "pending" && (
            <BsBell className="bg-green-500 px-1 text-[30px] rounded-full -ml-7 text-white" />
          )}

          {data.status === "reminder" && (
            <LuClock4 className="bg-blue-500 px-1 text-[30px] rounded-full -ml-7 text-white" />
          )}
        </div>
      </div>

      <div className="grid">
        <label className="text-[#41843F] font-bold text-[20px] hover:underline cursor-pointer">
          {/* Set Name */}
          {data.fname} {data.lname}
        </label>
        <label>
          {/* Set Date */}
          {moment(new Date(data.created_at)).calendar()}
        </label>
        <label className="text-blue-500">
          {/* Set Appointment Resched,Cancel,Booked Remind */}
          {data.status === "rescheduled" && (
            <label> An appointment has been rescheduled</label>
          )}
          {data.status === "pending" && (
            <label>Patient booked an appointment</label>
          )}
          {data.status === "reminder" && (
            <label>Contact patient to remind the appointment</label>
          )}
        </label>
      </div>
    </Link>
  )
}

export default NotificationConfig;

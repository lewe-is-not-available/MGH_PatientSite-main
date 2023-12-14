import React, { useState, useEffect, useRef } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { AiOutlineDown } from "react-icons/ai";
import { MdEmail, MdPhone, MdAccessTimeFilled } from "react-icons/md";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import supabase from "../../../../config/Supabase";
import moment from "moment";
import { toast } from "react-toastify";
import { IoMdStar } from "react-icons/io";

const RatingsMap = ({ ol }) => {
  //TODO fix scroll animation
  //*expand details
  const [expand, setExpand] = useState(false);

  function handleExpand(e) {
    e.preventDefault(); // Prevent the event from propagating to the parent Link component
    setExpand(!expand);
  }
  const [user, setUser] = useState([]);

  const fetchUser = async () => {
    try {
      if (ol?.user_id) {
        const { data: userData, error: userErr } = await supabase
          .from("profile")
          .select()
          .eq("id", ol?.user_id);

        if (userData && userData[0]) {
          setUser(userData[0]);
        } else if (userErr) {
          throw userErr;
        }
      }
    } catch (error) {
      toast.error(error.message, {
        toastId: "dataError",
      });
      console.error(error.message);
    }
  };
  //*Realtime data
  useEffect(() => {
    const fetchAndSubscribe = async () => {
      await fetchUser();
      const realtime = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "profile" },
          () => {
            fetchUser();
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [ol]);

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

  const id = user.email;
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";

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
    if (user) {
      getImages(id, setimgName, setImgEmpty);
    }
  }, [user, id, setImgEmpty, setimgName]);

  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 300 });
    Aos.refresh();
  }, []);
  return (
    <div
      key={ol.id}
      className="text-base flex w-full justify-center select-none"
    >
      <section
        data-aos="fade-right"
        data-aos-anchor="#trigger-next"
        ref={detailsRef}
        onClick={handleExpand}
        className="group/pu bg-white abs mb-3 cursor-pointer text-gray-900 w-[80%] rounded-xl transition duration-75 ease-in hover:bg-slate-100 text-center  "
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
                  ? CDNURL + user.email + "/profile/" + imgName
                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
              }`}
              alt="/"
            />
            <div className="ml-4 flex-col text-left text-sm">
              <p className="text-base uppercase font-semibold text-green-800">
                {user.first_name} {user.last_name}
              </p>
              <p className="">{moment(new Date(ol.created_at)).calendar()}</p>
              <p>
                <span className="font-semibold flex items-center text-yellow-500">
                  <IoMdStar className="text-2xl" />
                  {ol.rate} Star
                </span>
                {ol.docname}
              </p>
              <p className="italic">"{ol.message}"</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RatingsMap;

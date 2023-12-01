import React, { useState, useEffect } from "react";
import doc from "../images/doc.jpg";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import supabase from "../config/Supabase";

const DocUniq = ({ Doctors }) => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";

  //*image
  const id = Doctors.email;
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
    if (Doctors) {
      getImages(id, setimgName, setImgEmpty);
    }
  }, [Doctors, id, setImgEmpty, setimgName]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  //console.log(CDNURL + Doctors.email + "/profile/" + imgName)
  return (
    <div
      data-aos="fade-up"
      key={Doctors.user_id}
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
              ? "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
              : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
          }`}
          alt="/"
          className="w-[15rem] h-full object-cover max-2xl:w-[13rem] max-sm:w-[10rem] max-sm:mb-3 mb-6 rounded-lg"
          data-aos="fade-up"
          data-aos-anchor-placement="top-bottom"
        />
        <div className="w-full items-center flex flex-col">
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 font-bold">Name:</span>
            <p className="">{Doctors.name}</p>
          </div>
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 w-fit whitespace-nowrap font-bold">
              Specialization:{" "}
            </span>
            <p className=" whitespace-nowrap overflow-hidden max-sm:max-w-[4.3rem] text-center overflow-ellipsis">
              {Doctors.specialization}
            </p>
          </div>
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 w-fit whitespace-nowrap font-bold">
              Sub-Special:{" "}
            </span>
            <p className="max-w-[10rem] max-[941px]:max-w-[7rem] max-sm:max-w-[4.3rem] whitespace-nowrap overflow-hidden text-center overflow-ellipsis">
              {Doctors.subspecial}
            </p>
          </div>
          <div className="flex" data-aos="fade-up">
            <span className="mr-2 font-bold">Schedule: </span>
            <p className="mb-2">
              {Doctors.schedule &&
                Doctors.schedule.map((item) => (
                  <>{item.day === "Thursday" ? "Th" : item.day[0]}</>
                ))}
            </p>
          </div>
        </div>

        <Link
          to={
            Doctors.type === "f2f"
              ? "/Face-to-face/" + Doctors.id
              : "/Online/" + Doctors.id
          }
          data-aos="fade-up"
          className="text-base max-sm:text-[11px] Docbtn max-sm:px-1 max-sm:py-0 whitespace-nowrap bg-[#418D3F] max-[941px]:text-sm p-2 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]"
        >
          BOOK AN APPOINTMENT
        </Link>
      </div>
    </div>
  );
};

export default DocUniq;

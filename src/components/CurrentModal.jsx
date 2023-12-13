import React, { useEffect, useState } from "react";
import logo from "./images/MGHlogo.png";
import supabase from "./config/Supabase";

const CurrentModal = ({ data }) => {
  //*getting image for patient
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);
  useEffect(() => {
    async function getImages() {
      const { data: patientImg, error: ImgErr } = await supabase.storage
        .from("images")
        .list(data.email + "/profile/", {
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
  }, []);
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div className="bg-white sticky top-36 -mt-[8rem] flex w-[80%] h-fit flex-col items-center abs rounded-lg p-9">
        <div className="sticky top-0 w-full flex flex-col items-center">
          <h1 className="text-green-800 font-semibold text-4xl  uppercase">
            consultation ongoing
          </h1>
          <div className="border-b-2 border-green-700 my-3 w-full"></div>
          <div className="w-full">
            <div className="company py-9 px-[8%] w-full flex justify-center items-center">
              <img src={logo} className="w-[7rem]" alt="/" />
              <p className="uppercase text-white font-semibold text-4xl">
                mendoza general <br /> hospital
              </p>
            </div>
            <div className="absolute w-full mt-[10rem] -ml-[17rem] flex justify-center items-center">
              <img
                className="object-cover rounded-full border-[7px] bg-white border-white shadow-xl w-[11rem] mb-5"
                src={`${
                  isImgEmpty
                    ? CDNURL + data.email + "/profile/" + imgName
                    : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                }`}
                alt="/"
              />
              <p className="text-3xl font-semibold mt-7 ml-3 uppercase text-left">
                {data.fname} {data.lname} <br />
                <span className="normal-case font-light text-2xl">Patient</span>
              </p>
            </div>
          </div>
          <div className="mt-[6rem] w-full grid grid-cols-3 ">asd</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentModal;

import doc from "./images/doc.jpg";
import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { HiOutlineInformationCircle } from "react-icons/hi";

const SearchResult = ({ Doctors }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="Doc_Uniq">
      <div
        data-aos="zoom-out"
        className="docs text-sm bg-[#A5DD9D] px-3 py-5 h-[98%] rounded-xl flex flex-col items-center space-y-3 w-[16rem] transition duration-100 ease-in-out mb-1"
      >
        <img
          src={doc}
          alt="/"
          className="w-[75%] mb-2 rounded-lg"
          data-aos="fade-up"
          data-aos-anchor-placement="bottom-bottom"
        />
        <div className="flex" data-aos="fade-up">
          <span className="mr-2 font-bold">Name:</span>
          <p className="text-base">{Doctors.Name}</p>
        </div>
        <div className="flex" data-aos="fade-up">
          <span className="mr-2 font-bold">Specialization: </span>{" "}
          <p className="w-28 text-base whitespace-nowrap overflow-hidden overflow-ellipsis">{Doctors.specialization}</p>
        </div>
        <div className="flex" data-aos="fade-up">
          <span className="mr-2 font-bold overflow whitespace-nowrap">Sub-Special: </span>{" "}
          <p className="w-32 text-base whitespace-nowrap overflow-hidden overflow-ellipsis">{Doctors.SubSpecial}</p>
        </div>
        <div className="flex" data-aos="fade-up">
          <span className="mr-2 font-bold">Schedule: </span>
          <p className="text-base mb-4">{Doctors.Schedule}</p>
        </div>
        <Link to={'/' + Doctors.id} data-aos="fade-up">
          <button className="flex text-base bg-[#418D3F] p-2 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]">
            <HiOutlineInformationCircle className="mr-1" size={23} /> Check
            Information
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SearchResult;

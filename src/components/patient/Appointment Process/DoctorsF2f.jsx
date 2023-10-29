import React, { useEffect } from "react";
import doc from "../../images/doc.jpg";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const DoctorsF2f = ({Doctors}) => {
    useEffect(() => {
        Aos.init({ duration: 1000 });
      }, []);
  return (
    <div className="">
    <div
      data-aos="fade-up"
      className="docs bg-[#A5DD9D] py-9 px-2 mb-9 rounded-xl flex flex-col items-center space-y-3 w-[288px] text-base transition duration-100 ease-in-out"
    >
      <img
        src={doc}
        alt="/"
        className="w-[75%] mb-6 rounded-lg"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
      />
      <div className="flex" data-aos="fade-up">
        <span className="mr-2 font-bold">Name:</span>
        <p className="text-base">{Doctors.Name}</p>
      </div>
      <div className="flex" data-aos="fade-up">
        <span className="mr-2 font-bold">Specialization: </span>
        <p className="text-base">{Doctors.specialization}</p>
      </div>
      <div className="flex" data-aos="fade-up">
        <span className="mr-2 font-bold">Sub-Special: </span>
        <p className="w-36 text-base whitespace-nowrap overflow-hidden overflow-ellipsis">{Doctors.SubSpecial}</p>
      </div>
      <div className="flex" data-aos="fade-up">
        <span className="mr-2 font-bold">Schedule: </span>
        <p className="text-base mb-2">{Doctors.Schedule}</p>
      </div>
      <Link
        to={'/Face-to-face/' + Doctors.id}
        data-aos="fade-up"
        className="text-base bg-[#418D3F] p-2 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]"
      >
        BOOK AN APPOINTMENT
      </Link>
    </div>
  </div>
  )
}

export default DoctorsF2f
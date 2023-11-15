import React from "react";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <div className="z-40  bg-[#41843F] w-full flex justify-between px-6 h-8 items-center text-white">
        <p className="font-sans">© Mendoza General Hospital</p>
        <a href="https://www.facebook.com/mendozageneralhospital">
          <FaFacebook className="mt-1 mr-2" size="19" />
        </a>
      </div>
    </div>
  );
};

export default Footer;

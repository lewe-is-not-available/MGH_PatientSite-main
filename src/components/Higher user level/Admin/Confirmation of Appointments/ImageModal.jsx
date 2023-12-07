import React, { useState } from "react";
import { cardio } from "ldrs";
import { LuCalendarCheck2 } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
cardio.register();
const ImageModal = ({ setImageModal, CDNURL, email, book_id, payImg }) => {
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen flex items-center justify-center">
      <div className="flex flex-col">
        <div className="w-full flex justify-end items-center text-5xl p-3  -mb-[3.9rem] z-50">
          <IoCloseOutline
            onClick={(e) => setImageModal(false) || e.preventDefault()}
            className="hover:text-white transition duration-100 cursor-pointer"
          />
        </div>
        {payImg ? (
          <img
            className="object-cover bg-white shadow-xl w-full mb-5 h-[40rem]"
            src={CDNURL + email + "/payment/" + book_id + "/" + payImg}
            alt="/"
          />
        ) : (
          <p>No Payment Sent</p>
        )}
      </div>
    </div>
  );
};

export default ImageModal;

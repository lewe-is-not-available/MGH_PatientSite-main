import React, { useRef, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const MessageModal = ({
  setOpenMessage,
  ol,
  imgName,
  isImgEmpty,
  CDNURL,
}) => {
  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 300 });
    Aos.refresh();
  }, []);

  //*close when clicked outside
  let messRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!messRef.current.contains(e.target)) {
        setOpenMessage(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [messRef]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex justify-center">
      <div
        ref={messRef}
        className="bg-white sticky mt-[5rem] flex flex-col items-center abs rounded-lg p-6 h-fit max-h-[60%] w-[50%]"
      >
        <div className="grid grid-cols-3  w-full">
          <div className=""></div>
          <div className="flex justify-center text-black text-2xl font-semibold">
            Message Details
          </div>
          <div className="w-full flex mb-5 justify-end">
            <button
              onClick={(e) => setOpenMessage(false) || e.preventDefault()}
              className="bg-slate-200 hover:bg-slate-300 transition duration-75 rounded-md px-3 select-none text-lg"
            >
              closez
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2 w-full overflow-y-auto">
          <div className="flex justify-center row-span-2 ">
            <img
              className="object-cover rounded-lg w-[8rem] h-[8rem]"
              src={`${
                isImgEmpty
                  ? CDNURL + ol.email + "/profile/" + imgName
                  : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
              }`}
              alt="/"
            />
          </div>
          <div className="col-span-2 grid grid-cols-3 text-lg text-black">
            <div className="flex flex-col">
              <label className="font-semibold">First Name:</label>
              <p>{ol.fname}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Last Name:</label>
              <p>{ol.lname}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Middle Name:</label>
              <p>{ol.mname}</p>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-2 text-lg text-black">
            <div className="flex flex-col">
              <label className="font-semibold">Email:</label>
              <p>{ol.email}</p>
            </div>
            <div className="flex flex-col">
              <label className="font-semibold">Contact Number:</label>
              <p>{ol.phone}</p>
            </div>
          </div>
          <div className="flex col-span-3 text-lg mt-5 text-black px-10">
            <label>
              <span className="font-semibold">Message Type:</span> {ol.type}
            </label>
          </div>
          <div className="col-span-3 text-lg text-black px-10">
            <div className="flex flex-col">
              <p className="font-semibold">Message:</p>
              <p>{ol.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;

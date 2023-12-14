import React, { useEffect, useRef } from "react";
import TodayModalMap from "./TodayModalMap";

const TodayAppModal = ({ setAccept, ol }) => {
  //console.log(ol)
  const isSchedToday = new Date(ol[0]?.date) === new Date()

  //*close when clicked outside
  let modelRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!modelRef.current?.contains(e.target)) {
        setAccept(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [modelRef]);

  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-full z-50 flex items-center justify-center">
      <div
        ref={modelRef}
        className="bg-white sticky top-36 -mt-[8rem] flex w-[50%] h-fit flex-col items-center abs rounded-lg p-6"
      >
        <>
          <h1 className="text-3xl font-semibold mb-6 mt-1">
            {isSchedToday ? ("Appointments for today"):("Appointments for next schedule")}
         
          </h1>
          <div className="h-[30rem] overflow-y-auto w-full px-3 py-3">
            {ol.map((item, i) => (
            <TodayModalMap ol={item} key={i} i={i} />
          ))}
          </div>
          
        </>
      </div>
    </div>
  );
};

export default TodayAppModal;

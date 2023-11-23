import React, { useState } from "react";
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

const Carousel = ({ slides }) => {
  const [Current, setCurrent] = useState(0);

  const previouseSlide = () => {
    if (Current === 0) {
      setCurrent(slides.length - 1);
    } else {
      setCurrent(Current - 1);
    }
  };
  const nextSlide = () => {
    if (Current === slides.length - 1) {
      setCurrent(0);
    } else {
      setCurrent(Current + 1);
    }
  };

  return (
    <div className="relative h-[35rem] max-xl:h-[25rem] max-[1072px]:h-[25rem] max-sm:h-[22.3rem] carousel overflow-hidden ">
      <div
        className={`flex items-center transition ease-out duration-700 translate-x-[-${
          Current * 100
        }]`}
        style={{
          transform: `translateX(-${Current * 100}%)`,
        }}
      >
        {slides.map((pic, index) => (
          <img
            key={index}
            src={pic}
            alt={`slide-${index}`}
            className=""
            placeholder="asd"
          />
        ))}
      </div>
      <div className="absolute top-0 flex w-full  h-full max-[768px]:h-[15rem] max-[768px]:text-4xl max-[1024px]:px-4 max-[1024px]:h-[21rem] justify-between px-10 max-sm:px-3 text-slate-100 text-6xl max-[1024px]:text-5xl max-sm:text-3xl">
        <button onClick={previouseSlide}>
          <AiOutlineLeft className="bg-slate-300 rounded-full p-3 max-sm:p-1 max-[1024px]:p-2 hover:bg-slate-400 transition duration-100" />
        </button>
        <button onClick={nextSlide}>
          <AiOutlineRight className="bg-slate-300 rounded-full p-3 max-sm:p-1 max-[1024px]:p-2 hover:bg-slate-400 transition duration-100" />
        </button>
      </div>
      <div
        className=" absolute bottom-0 py-8 max-[1280px]:mb-10 max-[950px]:mb-24 max-[858px]:mb-28 max-[1460px]:mb-8 max-[1398px]:mb-20
       max-[1534px]:mb-5 max-[800px]:mb-[10rem] max-[1072px]:mb-16 max-[765px]:mb-16 max-[710px]:mb-20 max-[669px]:mb-24 max-[571px]:mb-28
        max-[532px]:mb-32 max-[532px]:mb-[9rem] max-[464px]:mb-[11rem] max-[385px]:mb-[12rem] dots flex justify-center
        gap-3 max-sm:gap-2 w-full"
      >
        {slides.map((pic, i) => (
          <button
            onClick={() => setCurrent(i)}
            key={pic + i}
            className={`rounded-full p-2 max-sm:p-1 max-[768px]:p-[5px] ${
              i == Current ? "bg-slate-400 " : "bg-slate-100"
            } `}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

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
    <div className="relative h-[35rem] overflow-hidden ">
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
      <div className="absolute top-0 flex w-full h-full justify-between px-10 text-slate-100 text-6xl">
        <button onClick={previouseSlide}>
          <AiOutlineLeft className="bg-slate-300 rounded-full p-3 hover:bg-slate-400 transition duration-100" />
        </button>
        <button onClick={nextSlide}>
          <AiOutlineRight className="bg-slate-300 rounded-full p-3 hover:bg-slate-400 transition duration-100" />
        </button>
      </div>
      <div className="absolute bottom-0 py-8 flex justify-center gap-3 w-full">
        {slides.map((pic, i) => (
          <button
            onClick={() => setCurrent(i)}
            key={pic + i}
            className={`rounded-full p-2 ${
              i == Current ? "bg-slate-400 " : "bg-slate-100"
            } `}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

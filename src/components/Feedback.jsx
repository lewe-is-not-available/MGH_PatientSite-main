import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const Feedback = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div>
      <div
        className="hero3 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p className="text-5xl font-semibold" data-aos="fade-up">
          GIVE US YOUR FEEDBACK!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Tell us what you feel, leave a comment.
        </p>
      </div>
      <div className="back grid pt-16 px-56 pb-16">
        <form className="grid grid-cols-3 gap-3 font-semibold text-[#315E30]">
          <p data-aos="fade-up">
            First Name: <br />
            <input
              data-aos="fade-up"
              className="outline-none border-2 px-3 border-slate-300 focus:border-[#71b967d3] w-full"
            />
          </p>
          <p data-aos="fade-up">
            Last Name: <br />
            <input
              data-aos="fade-up"
              className="outline-none border-2 px-3 border-slate-300 focus:border-[#71b967d3] w-full"
            />
          </p>
          <p data-aos="fade-up">
            Middle Name: <br />
            <input
              data-aos="fade-up"
              className="outline-none border-2 px-3 border-slate-300 focus:border-[#71b967d3] w-full"
            />
          </p>
          <div className="grid grid-cols-2 gap-3 col-span-3">
            <p data-aos="fade-up">
              Email: <br />
              <input
                data-aos="fade-up"
                className="outline-none border-2 px-3 border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
            <p data-aos="fade-up">
              Contact Number: <br />
              <input
                data-aos="fade-up"
                className="outline-none border-2 px-3 border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
          </div>
          <div className="col-span-3">
            <p data-aos="fade-up">
              Your Feedback: <br />
              <textarea
                data-aos="fade-up"
                className="px-9 py-8 outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full h-72"
                placeholder="Type your message here"
              />
            </p>
          </div>
          <div
            data-aos="fade-up"
            className="col-span-3 flex justify-end mr-10 mt-4"
          >
            <button
              type="submit"
              className="text-base bg-[#418D3F] py-2 px-16 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;

import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Input, initTE } from "tw-elements";

const Contacts = () => {
  initTE({ Input });
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="back">
      {/* hero section */}
      <div
        className="hero3 py-28 flex flex-col items-center text-white space-y-10 w-full"
        data-aos="fade-up"
      >
        <p className="text-5xl font-semibold" data-aos="fade-up">
          CONTACT US!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Fill up the form below for further details
        </p>
      </div>
      {/* content */}
      <form
        data-aos="fade-right"
        className="grid grid-cols-2 pt-10 ml-20 pb-14"
      >
        <section className="grid grid-cols-3 gap-3 ml font-semibold text-[#315E30]">
          <p>
            First Name: <br />
            <input className="outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full" />
          </p>
          <p>
            Last Name: <br />
            <input className="outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full" />
          </p>
          <p>
            Middle Name: <br />
            <input className="outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full" />
          </p>
          <div className="grid grid-cols-2 gap-3 col-span-3">
            <p>
              Email: <br />
              <input className="outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
            <p>
              Contact Number: <br />
              <input className="outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
          </div>
          <div className="col-span-3">
            <div class="relative mb-3 bg-white" data-te-input-wrapper-init>
                <textarea
                  class="peer block min-h-[auto] font-thin w-full h-[18rem] rounded border-0 bg-transparent px-3 py-[1rem] 
                  leading-[1] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 
                  peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none
                   dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary 
                   [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="exampleFormControlTextarea1"
                  rows="4"
                  placeholder="Your message"
                ></textarea>
                <label
                  for="exampleFormControlTextarea1"
                  class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >
                  Your message
                </label>
              {/* <textarea
                class="peer block  min-h-[auto] w-full font-thin text-black rounded
                 px-3 h-48 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100
                  peer-focus:text-[#315E30] data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none
                   dark:placeholder:text-neutral-200 dark:peer-focus:text-black
                  [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                placeholder="Your message"
              ></textarea>
              <label
                class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] 
                truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.5rem]
                 peer-focus:scale-[0.9] peer-focus:text-[#315E30] peer-data-[te-input-state-active]:-translate-y-[1.5rem] 
                 peer-data-[te-input-state-active]:scale-[0.9] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-[#315E30]"
              >
                Your Message
              </label> */}
            </div>
          </div>
          <div className="col-span-3 flex justify-end mr-10 mt-4">
            <button
              type="submit"
              className="text-base bg-[#418D3F] py-2 px-16 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]"
            >
              Submit
            </button>
          </div>
        </section>
        {/* MGH Google map embed */}
        <div className="ml-20 flex flex-col justify-center" data-aos="fade-up">
          <p className="text-xl mb-2 text-[#315E30]">
            RXC7+C65, A Morales St, Santa Maria, Bulacan
          </p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.06727265407326!2d120.9630312506357!3d14.820971765282387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ac4ac9aa4e77%3A0xeb03c4b33a362a49!2sMendoza%20General%20Hospital!5e0!3m2!1sen!2sph!4v1696662564819!5m2!1sen!2sph"
            width="740"
            height="400"
            data-aos="fade-up"
            allowfullscreen="on"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </form>
      {/* Contact deatils */}
      <section id="Contact-num ">
        <div className="mt-[40px] flex flex-col space-y-2 pb-10 items-center">
          <p
            className="text-xl font-semibold text-[#315E30]"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            CONTACT NUMBER
          </p>
          <span
            className="text-[#315E30]"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            +639455963805
          </span>
          <p
            className="text-xl font-semibold text-[#315E30]"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            EMERGENCY HOT-LINE
          </p>
          <span
            className="text-[#315E30]"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            1234-567
          </span>
          <p
            className="text-xl font-semibold text-[#315E30]"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            E-MAIL ADDRESSES
          </p>
          <span
            className="text-[#315E30]"
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            JuanCruz@email.com
          </span>
        </div>
      </section>
    </div>
  );
};

export default Contacts;

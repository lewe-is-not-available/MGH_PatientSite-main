import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const Contacts = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div>
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
      className="back grid grid-cols-2 pt-10 px-10 pb-14 ">
        <section className="grid grid-cols-3 gap-3 font-semibold h-0 text-[#315E30]">
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
            <p>
              Your message: <br />
              <textarea
                className="px-9 py-8 outline-none border-2 border-slate-300 focus:border-[#71b967d3] w-full h-72"
                placeholder="Type your message here"
              />
            </p>
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

        <div className="ml-20 mt-8 flex flex-col justify-center mb-16" data-aos="fade-up">
          {/* <iframe
            className="w-full h-full"
            data-aos="fade-up"
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.13441027068!2d120.9628609499693!3d14.821032412797427!2m3!1f0!2f0!3f
              0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ac4ac9aa4e77%3A0xeb03c4b33a362a49!2sMendoza%20General%20Hospital!5e0!3m2!1sen!2sph!4v1687814755627!5m2!1sen!2sph"
          ></iframe> */}
          <p className="text-xl mb-2 text-[#315E30]">RXC7+C65, A Morales St, Santa Maria, Bulacan</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.06727265407326!2d120.9630312506357!3d14.820971765282387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ac4ac9aa4e77%3A0xeb03c4b33a362a49!2sMendoza%20General%20Hospital!5e0!3m2!1sen!2sph!4v1696662564819!5m2!1sen!2sph"
            width="730"
            height="400"
            data-aos="fade-up"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
          
        </div>
      </form>
    </div>
  );
};

export default Contacts;

import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const Contacts = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div>
         <div className="hero3 p-28 py-28 flex flex-col items-center text-white space-y-10 w-full" data-aos="fade-up">
        <p className="text-5xl font-semibold" data-aos="fade-up">
          CONTACT US!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Fill up the form below for further details
        </p>
      </div>

      <div className="back p-24" data-aos="fade-up">
      <iframe
        className=""
        data-aos="fade-up"
        title="map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d482.13441027068!2d120.9628609499693!3d14.821032412797427!2m3!1f0!2f0!3f
              0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ac4ac9aa4e77%3A0xeb03c4b33a362a49!2sMendoza%20General%20Hospital!5e0!3m2!1sen!2sph!4v1687814755627!5m2!1sen!2sph"
      ></iframe>
      </div>
    </div>
  );
};

export default Contacts;

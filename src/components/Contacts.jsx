import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Input, initTE } from "tw-elements";
import supabase from "./config/Supabase";
import { toast } from "react-toastify";
import { cardio } from "ldrs";
import { IoIosCheckmarkCircle } from "react-icons/io";

cardio.register();

const Contacts = ({ user, token }) => {
  //*Aos function
  initTE({ Input });
  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);
  //*getting inputs
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    email: "",
    phone: "",
    type: "",
    message: "",
  });
  //*onchange function
  function handleChange(e) {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  //*autofill value
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fname: user.first_name,
        mname: user.middle_name,
        lname: user.last_name,
        email: user.email,
        phone: user.phone,
      }));
    }
  }, [user]);

  //*Onsubmit function
  const [load, setLoad] = useState(false);
  const [submit, setSubmit] = useState(false);
  async function handlSubmit(e) {
    e.preventDefault()
    setLoad(true);
    const { error } = await supabase.from("messages").insert({
      user_id: user.id,
      fname: formData.fname,
      mname: formData.mname,
      lname: formData.lname,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      message: formData.message,
    });
    try {
      if (error) throw error;
      else {
        setSubmit(true);
        setLoad(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoad(false);
    }
  }

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
      <div data-aos="fade-right" className="grid grid-cols-2 pt-10 ml-20 pb-14">
        {load ? (
          <div className="flex flex-col items-center h-full justify-center">
            <l-cardio size="116" stroke="3" speed="1.3" color="black" />
            <h1 className="mt-3 text-2xl text-center">
              Submitting your message please wait
            </h1>
          </div>
        ) : (
          <>
            {submit ? (
              <div className="flex flex-col items-center h-full justify-center">
                <div className="mt-3 text-4xl flex items-center text-center text-green-700 space-x-1">
                  <IoIosCheckmarkCircle className="text-5xl" />
                  <span>Your message has been submitted succesfully!</span>
                </div>
                <button
                  onClick={() => setSubmit(false)}
                  className="px-8 py-2 text-xl mt-6 rounded-md transition duration-100 border-[#16891d] border-[2px] hover:bg-[#a5e5a9]
                 hover:text-[#106716] bg-[#16891d] text-white"
                >
                  Add another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handlSubmit}
                className="grid grid-cols-3 gap-3 ml font-semibold text-[#315E30]"
              >
                <p>
                  First Name: <br />
                  <input
                    required
                    value={formData.fname}
                    name="fname"
                    onChange={handleChange}
                    disabled={token}
                    className="outline-none border-2 font-light disabled:bg-slate-200 disabled:border-slate-300 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Last Name: <br />
                  <input
                    required
                    value={formData.lname}
                    name="lname"
                    disabled={token}
                    onChange={handleChange}
                    className="outline-none disabled:bg-slate-200 disabled:border-slate-300 border-2 font-light border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Middle Name: <br />
                  <input
                    name="mname"
                    disabled={token}
                    value={formData.mname}
                    onChange={handleChange}
                    className="outline-none border-2 font-light disabled:bg-slate-200 disabled:border-slate-300 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <div className="grid grid-cols-2 gap-3 col-span-3">
                  <p>
                    Email: <br />
                    <input
                      required
                      value={formData.email}
                      name="email"
                      onChange={handleChange}
                      className="outline-none border-2 font-light  border-slate-300 focus:border-[#71b967d3] w-full"
                    />
                  </p>
                  <p>
                    Contact Number: <br />
                    <input
                      required
                      value={formData.phone}
                      name="phone"
                      onChange={handleChange}
                      className="outline-none border-2 font-light border-slate-300 focus:border-[#71b967d3] w-full"
                    />
                  </p>
                </div>
                <div className="col-span-3">
                  <p>
                    Message type: <br />
                    <select
                      required
                      name="type"
                      onChange={handleChange}
                      className="outline-none border-2 font-light border-slate-300 focus:border-[#71b967d3] w-full h-8"
                    >
                      <option id="0"></option>
                      <option id="1">Complaint</option>
                      <option id="2">Commendation</option>
                      <option id="2">Service Inquiry</option>
                    </select>
                  </p>
                </div>
                <div className="col-span-3">
                  <p> Your message here:</p>
                  <textarea
                    required
                    name="message"
                    onChange={handleChange}
                    className="outline-none border-2 font-light h-56 border-slate-300 focus:border-[#71b967d3] w-full"
                  ></textarea>
                </div>
                <div className="col-span-3 flex justify-end mr-10 mt-4">
                  <button
                    type="submit"
                    className="text-base bg-[#418D3F] py-2 px-16 rounded-md text-white font-bold ring-[#418D3F] ring-2 transition duration-75 ease-in hover:bg-[#A5DD9D] hover:text-[#267124]"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* MGH Google map embed */}
        <div className="ml-20 flex flex-col justify-center" data-aos="fade-up">
          <p className="text-xl mb-2 text-[#315E30]">
            RXC7+C65, A Morales St, Santa Maria, Bulacan
          </p>
          <iframe
            title="MGH map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241.06727265407326!2d120.9630312506357!3d14.820971765282387!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ac4ac9aa4e77%3A0xeb03c4b33a362a49!2sMendoza%20General%20Hospital!5e0!3m2!1sen!2sph!4v1696662564819!5m2!1sen!2sph"
            width="740"
            height="400"
            data-aos="fade-up"
            allowFullScreen="on"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Contact deatils */}
      <section data-Aos="fade-up" id="Contact-num">
        <div className="pb-[33px] flex flex-col space-y-2 items-center">
          <p className="text-xl max-sm:text-base font-semibold text-[#315E30]">
            CONTACT NUMBERS
          </p>
          <label className="text-[#315E30] text-base max-sm:text-sm flex flex-col text-center space-y-3">
            <span data-aos="fade-up">+63 995 230 2499</span>
            <span data-aos="fade-up">+63 (44) 288 2417</span>
            <span data-aos="fade-up">+63 (44) 641 1582</span>
          </label>

          <p className="text-xl max-sm:text-base font-semibold text-[#315E30]">
            E-MAIL ADDRESSES
          </p>
          <span className="text-[#315E30] text-base max-sm:text-sm">
            mendozageneralhospital@gmail.com
          </span>
        </div>
      </section>
    </div>
  );
};

export default Contacts;

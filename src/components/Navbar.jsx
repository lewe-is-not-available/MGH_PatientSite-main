import React, { useState } from "react";
import logo from "./images/MGHlogo.png";
import { AiFillCaretDown } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import Login from "./Login";
import Aos from "aos";

const Navbar = () => {
  const [Show, FetchShow] = useState(null);

  const Close = () => FetchShow(false);
  const Open = () => FetchShow(true);



  return (
    <div>
      <div className="z-50 flex justify-between top-0 w-full bg-[#315E30] px-3 pl-5">
        <div className="">
          <Link to="/" className="hover:cursor-pointer flex p-3 ml-5">
            <div className="w-[65px]">
              <img src={logo} alt="/" />
            </div>
            <h1 className="font-bold text-6xl text-white pl-2">MGH</h1>
          </Link>
        </div>
        <div className="  mt-7 mr-12 text-lg font-semibold">
          <button
            type="submit"
            onClick={Open}
            className="ring-2 text-white ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center "
          >
            Sign-in
          </button>
        </div>
      </div>

      <div className="w-full bg-[#A5DD9D]">
        <div className="flex pl-3">
          <Link
            to="/"
            className="px-4 py-1 font-bold peer/ic relative mt-1 hover:mt-1"
          >
            <AiFillHome className="peer-hover/ic:shadow-md shadow-sm" />
          </Link>
          <li className="px-4 py-1 font-bold relative list-none peer/os hover:cursor-default flex">
            Online Services
          </li>
          <AiFillCaretDown className="mt-2 -ml-4 mr-2 transition duration-500 ease-in-out peer-hover/os:rotate-180 peer-hover/os:text-white" />
          <li className="px-4 py-1 font-bold relative list-none peer/about hover:cursor-default">
            About Us
          </li>
          <AiFillCaretDown className="mt-2 -ml-4 mr-2 transition duration-500 ease-in-out peer-hover/about:rotate-180 peer-hover/about:text-white" />
          <Link to="/Contacts" className="px-4 py-1 font-bold relative">
            Contact Us
          </Link>
          <Link to="/Rooms" className="px-4 py-1 font-bold relative">
            Available Rooms
          </Link>
          {/* Online Services Dropdown */}
          <div className="absolute opacity-0 max-h-0 flex transition-all duration-300 ease-in-out peer/osDp peer-hover/os:opacity-100 peer-hover/os:max-h-40 hover:max-h-40 hover:opacity-100 flex-col py-3 mt-8 ml-[60px] bg-[#A5DD9D] shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] rounded-b-lg">
            <Link
              to="/Appointment"
              className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer mb-2 px-2 w-full"
            >
              Appointment
            </Link>
            <Link
              to="/Feedback-Form"
              className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer px-2 w-full"
            >
              Patient's Feedback Form
            </Link>
          </div>
          {/* About Us Dropdown */}
          <div
            className="absolute opacity-0 max-h-0 flex transition-all duration-300 ease-in-out peer-hover/about:opacity-100 
                            peer-hover/about:overflow-y-visible peer-hover/about:max-h-40 hover:opacity-100 hover:max-h-40 flex-col py-3 mt-8 ml-[215px]
                             bg-[#A5DD9D] shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] rounded-b-lg"
          >
            <Link
              to="/Mission-and-Vision"
              className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer mb-2 px-2 pr-7 w-full"
            >
              Mission & Vision
            </Link>
            <Link
              to="/Hospital-Profile"
              className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer px-2 w-full"
            >
              Hospital Profile
            </Link>
          </div>
        </div>
      </div>
      <div className={`${Show ? "flex justify-center " : "hidden"}`}>
        <div className="absolute bg-white mt-40">
          <div className="mb-12 mt-4 mr-4 flex justify-end">
            <button onClick={Close} className="bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 hover:ring-slate-500 ring-transparent transition duration-100 ring-2 text-lg rounded-full px-2">
              close
            </button>
          </div>
          <Login/>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

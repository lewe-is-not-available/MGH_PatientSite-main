import React, { useState, useEffect } from "react";
import logo from "./images/MGHlogo.png";
import { AiFillCaretDown } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import Login from "./Login/Login";
import SignIn from "./Login/SigninButton";
import Reg from "./Login/Signup";
import { useNavigate } from "react-router-dom";
import supabase from "./config/Supabase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ token, setToken, isAdmin, isDoctor, isPatient }) => {
  //*Function to show/hide registration and login
  const [Show, FetchShow] = useState(null);
  const [regOpen, setRegOpen] = useState(false);
  const [patient, setPatient] = useState(false);
  const [doctor, setDoctor] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      if (isPatient) {
        setPatient(true);
      }
      if (isDoctor) {
        setDoctor(true);
      }
      if (isAdmin) {
        setAdmin(true);
      }
    }
  }, [token, isPatient, isAdmin, isDoctor]);

  const Close = () => FetchShow(false);
  const Open = () => {
    FetchShow(true);
    setRegOpen(false);
  };

  const Openreg = () => {
    setRegOpen(true);
    FetchShow(false);
  };
  const Closereg = () => setRegOpen(false);

  //*Logout Function
  const navigate = useNavigate();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error);
    } else {
      setToken(false);
      sessionStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="z-50 flex justify-between top-0 w-full bg-[#315E30] px-3 pl-5">
        <div className="">
          {doctor ? (
            <Link to="/Doctor" className="hover:cursor-pointer flex p-3 ml-5">
              <div className="w-[65px]">
                <img src={logo} alt="/" />
              </div>
              <h1 className="font-bold text-6xl text-white pl-2 flex">
                MGH
                {doctor && (
                  <p className="ml-3 font-thin text-4xl mt-4">Doctor's page</p>
                )}
              </h1>
            </Link>
          ) : (
            <Link to="/" className="hover:cursor-pointer flex p-3 ml-5">
              <div className="w-[65px]">
                <img src={logo} alt="/" />
              </div>
              <h1 className="font-bold text-6xl text-white pl-2 flex">
                MGH
                {admin && (
                  <p className="ml-3 font-thin text-4xl mt-4">Admin's page</p>
                )}
                {doctor && (
                  <p className="ml-3 font-thin text-4xl mt-4">Doctor's page</p>
                )}
              </h1>
            </Link>
          )}
        </div>
        <div className="  mt-7 mr-12 text-lg font-semibold">
          {token ? (
            <div className="flex space-x-4">
              <p className="text-white">{token.user.user_metadata.username}</p>
              <button
                onClick={handleLogout}
                className="ring-2 text-white ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center"
              >
                Sign out
              </button>
            </div>
          ) : (
            <SignIn open={Open} />
          )}
        </div>
      </div>

      <div className="w-full bg-[#A5DD9D]">
        <div className="flex pl-3">
          {doctor ? (
            ""
          ) : (
            <>
              <Link
                to="/"
                className="px-4 py-1 font-bold peer/ic relative nav mt-1 hover:mt-1"
              >
                <AiFillHome className="peer-hover/ic:shadow-md shadow-sm" />
              </Link>
            </>
          )}

          {admin || doctor ? (
            ""
          ) : (
            <>
              <li className="px-4 py-1 font-bold relative nav list-none peer/os hover:cursor-default flex">
                Online Services
              </li>
              <AiFillCaretDown className="mt-2 -ml-4 mr-2 transition duration-500 ease-in-out peer-hover/os:rotate-180 peer-hover/os:text-white" />
              <li className="px-4 py-1 font-bold relative nav list-none peer/about hover:cursor-default">
                About Us
              </li>
              <AiFillCaretDown className="mt-2 -ml-4 mr-2 transition duration-500 ease-in-out peer-hover/about:rotate-180 peer-hover/about:text-white" />
              <Link to="/Contacts" className="px-4 py-1 font-bold relative nav">
                Contact Us
              </Link>
            </>
          )}
          {admin && (
            <>
              <Link
                to="/Confirm_Appointments"
                className="px-4 py-1 font-bold relative nav"
              >
                Appointments
              </Link>
              <Link
                to="/Edit_doctors"
                className="px-4 py-1 font-bold relative nav"
              >
                Edit Doctors
              </Link>
              <Link
                to="/User_feedbacks"
                className="px-4 py-1 font-bold relative nav"
              >
                Feedbacks
              </Link>
            </>
          )}
          {doctor ? (
            <Link to="/Doctor" className="px-4 py-1 font-bold relative nav">
              Doctor
            </Link>
          ) : (
            ""
          )}
          {/* Online Services Dropdown */}
          <div className="absolute opacity-0 max-h-0 hidden transition-all duration-300 ease-in-out peer-hover/os:opacity-100
           peer-hover/os:max-h-40 hover:max-h-40 hover:flex peer-hover/os:flex peer-hover/os:hover:visible hover:opacity-100 flex-col py-3 mt-8 ml-[60px] bg-[#A5DD9D] 
           shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] rounded-b-lg">
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
            className="absolute opacity-0 max-h-0 hidden transition-all duration-300 ease-in-out peer-hover/about:opacity-100 
            peer-hover/about:visible hover:flex peer-hover/about:flex peer-hover/about:max-h-40 hover:opacity-100 hover:max-h-40 flex-col py-3 mt-8 ml-[215px]
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
            <Link
              to="/OnlineConsultationHistory"
              className="px-4 py-1 font-bold relative nav"
            >
              Online Consultation history
            </Link>
        </div>
      </div>

      <div className={`${regOpen ? "visible" : "hidden"}`}>
        <Reg Closereg={Closereg} open={Open} />
      </div>
      <div className={`${Show ? "visible" : "hidden"}`}>
        <Login
          close={Close}
          openReg={Openreg}
          setshow={FetchShow}
          token={token}
          setToken={setToken}
        />
      </div>
    </div>
  );
};

export default Navbar;

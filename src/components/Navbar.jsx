import React, { useState, useEffect } from "react";
import logo from "./images/MGHlogo.png";
import { Link } from "react-router-dom";
import Login from "./Login/Login";
import Reg from "./Login/Signup";
import { useNavigate } from "react-router-dom";
import supabase from "./config/Supabase";
import { ToastContainer } from "react-toastify";
import { BiMenu } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import DragandDrop from "./Sidebar/Drag_and_Drop";
import Consent from "./patient/Appointment Process/Consent";

const bodyScrollLock = require("body-scroll-lock");
const disableBodyScroll = bodyScrollLock.disableBodyScroll;
const enableBodyScroll = bodyScrollLock.enableBodyScroll;

const Navbar = ({
  token,
  setToken,
  isAdmin,
  isDoctor,
  isPatient,
  open,
  openSide,
  imgName,
  CDNURL,
  user,
  isImgEmpty,
  closeProfileUpload,
  isProfileOpen,
  setUploaded,
  FetchShow,
  Show,
  openTerms,
  isRead,
  setRead
}) => {
  // if (Show) {
  //   disableBodyScroll("root");
  // } else {
  //   enableBodyScroll("root");
  // }
 

  //*Function to show/hide registration and login
  const [doctor, setDoctor] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [patient, setPatient] = useState(false);

  //*to show login modal
  const [regOpen, setRegOpen] = useState(false);
  const Open = () => {
    FetchShow(true);
    setRegOpen(false);
  };
  const Close = () => {
    FetchShow(false);
  };
  const Openreg = () => {
    setRegOpen(true);
    FetchShow(false);
  };
  const Closereg = () => {
    setRegOpen(false);
  };
  if (Show || regOpen || isRead) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }

  useEffect(() => {
    if (token) {
      if (isDoctor) {
        setDoctor(true);
      }
      if (isAdmin) {
        setAdmin(true);
      }
      if (isPatient) {
        setPatient(true);
      }
    }
  }, [token, isAdmin, isDoctor, isPatient]);

  //*Logout Function
  const navigate = useNavigate();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error);
    } else {
      setToken(false);
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="z-50 flex justify-between top-0 w-full bg-[#315E30] px-3 pl-5">
        <div className="flex items-center">
          {/* Open button for side */}
          <div
            className={`${
              open
                ? "flex items-center transition-transform duration-200 ease-in -translate-x-20"
                : "flex items-center transition-transform duration-200 ease-out translate-x-0"
            }`}
          >
            <BiMenu
              onClick={openSide}
              className="text-[40px] ml-4 cursor-pointer text-white transition duration-100 hover:text-white hover:bg-slate-400 rounded-md p-1"
            />

            <Link
              to="/Dashboard"
              className="hover:cursor-pointer flex p-3 ml-5"
            >
              <div className="w-[65px]">
                <img src={logo} alt="/" />
              </div>
              <h1 className="font-bold text-6xl text-white pl-2 flex">
                MGH
                {patient && (
                  <p className="ml-3 font-thin text-4xl mt-4">Patient's page</p>
                )}
                {doctor && (
                  <p className="ml-3 font-thin text-4xl mt-4">Doctor's page</p>
                )}
                {admin && (
                  <p className="ml-3 font-thin text-4xl mt-4">Admin's page</p>
                )}
              </h1>
            </Link>
          </div>
        </div>
        <div className=" mt-7 mr-12 text-lg ">
          {token ? (
            <div className="flex space-x-4 -mt-2 items-center">
              <p className="text-white text-right font-medium uppercase">
                {token.user.user_metadata.username}
                <br />
                <span className="text-sm font-light lowercase">
                  {user.email}
                </span>
              </p>
              <img
                className="object-cover rounded-full w-[3rem] h-[3rem] "
                src={`${
                  isImgEmpty
                    ? CDNURL + user.id + "/" + imgName
                    : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                }`}
                alt="https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
              />
              <button
                onClick={handleLogout}
                className="ring-2 text-white ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="submit"
              onClick={Open}
              className="ring-2 text-white ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      <div className={`${regOpen ? "visible" : "hidden"}`}>
        <Reg Closereg={Closereg} open={Open} />
      </div>
      <div className={`${Show ? "visible" : "hidden"}`}>
        <Login
          doctor={doctor}
          admin={admin}
          patient={patient}
          close={Close}
          openReg={Openreg}
          setshow={FetchShow}
          token={token}
          setToken={setToken}
        />
      </div>
      <div className={`${isProfileOpen ? "visible" : "hidden"}`}>
        <DragandDrop
          isImgEmpty={isImgEmpty}
          setUploaded={setUploaded}
          user={user}
          imgName={imgName}
          isProfileOpen={isProfileOpen}
          closeProfileUpload={closeProfileUpload}
        />
      </div>
      {isRead && (
        <Consent
          setRead={setRead}
          openTerms={openTerms}
          isRead={isRead}
          token={token}
        />
      )}
    </div>
  );
};

export default Navbar;

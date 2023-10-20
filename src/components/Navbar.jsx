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
import { BiMenu } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({
  token,
  setToken,
  isAdmin,
  isDoctor,
  isPatient,
  open,
  openSide,
  Open,
  Show,
  regOpen,
  Openreg,
  Closereg,
  Close,
  FetchShow,
  imgName,
  CDNURL,
  user
}) => {
  //*Function to show/hide registration and login
  const [doctor, setDoctor] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [patient, setPatient] = useState(false);

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
  }, [token, isAdmin, isDoctor, isPatient]);

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

            {doctor ? (
              <Link to="/Doctor" className="hover:cursor-pointer flex p-3 ml-5">
                <div className="w-[65px]">
                  <img src={logo} alt="/" />
                </div>
                <h1 className="font-bold text-6xl text-white pl-2 flex">
                  MGH
                  {doctor && (
                    <p className="ml-3 font-thin text-4xl mt-4">
                      Doctor's page
                    </p>
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
                    <p className="ml-3 font-thin text-4xl mt-4">
                      Doctor's page
                    </p>
                  )}
                </h1>
              </Link>
            )}
          </div>
        </div>
        <div className=" mt-7 mr-12 text-lg ">
          {token ? (
            <div className="flex space-x-4 -mt-2 items-center">
              <p className="text-white text-right font-medium uppercase">
                {token.user.user_metadata.username}<br/><span className="text-sm font-light lowercase">{user.email}</span></p>
                <img
                className="object-cover rounded-full w-[3rem] h-[3rem] "
                src={CDNURL + user.id + "/" + imgName}
                alt="No image"
              />
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
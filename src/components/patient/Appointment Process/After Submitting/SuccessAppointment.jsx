import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import supabase from "../../../config/Supabase";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import SuccessLoggedIn from "./SuccessLoggedIn";
import { useNavigate } from "react-router-dom";

const AfterAppointment = ({ token, setToken }) => {
  //TODO: Make registration
  //!Fix login
  const nav = useNavigate();

  //*get input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  //*Login button funtion
  async function handleSubmit() {
    try {
      //*supabase user authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      //*successful sign-in
      nav("/Appointment/Success")
      setToken(data);

      //* error handling
    } catch (error) {
      toast.error(error.message, {
        id: "logerr",
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error);
    }
  }
  //*show/hide password function
  const [visible, setVisible] = useState(false);
  const isOpen = visible ? "text" : "password";

  return (
    <div className="back flex items-center h-screen justify-center">
      <div className="flex py-20 px-14 flex-col items-center abs rounded-md bg-white">
        {token ? (
          <>
            <SuccessLoggedIn />
          </>
        ) : (
          <>
            <div className=" flex items-center ">
              <h1 className="flex text-5xl items-center text-green-600 font-semibold">
                <BsCheckCircleFill className="text-5xl mr-3" />
                Great! You have been verified
              </h1>
            </div>
            <p className="text-2xl mt-5">
              You can now log in your account to view and monitor your
              appointment status.
            </p>
            <div className="border-t-2 border-slate-400 w-full h-14"></div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-[50%] text-xl"
            >
              <div className="">Email:</div>
              <input
                name="email"
                onChange={handleChange}
                type="text"
                placeholder="type your email here"
                className="border-b-2 outline-0 border-b-slate-400 focus:bg-slate-200 focus:border-b-green-800 px-3 h-10"
              />
              <div className="mt-6">Password:</div>
              <div className="flex items-center">
                <input
                  name="password"
                  onChange={handleChange}
                  type={isOpen}
                  placeholder="type your email here"
                  className="border-b-2  w-full outline-0 border-b-slate-400 focus:bg-slate-200 focus:border-b-green-800 px-3 h-10"
                />
                <div
                  onClick={() => setVisible(!visible)}
                  className="cursor-pointer mt-[2px] -ml-9 text-[24px] "
                >
                  {visible ? <PiEye /> : <PiEyeClosed />}
                </div>
              </div>

              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  className="mt-8 bg-green-500 select-none text-white px-6 rounded-md border-2 border-opacity-0 active:border-slate-800 hover:bg-green-600 transition duration-100"
                >
                  Sign In
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AfterAppointment;

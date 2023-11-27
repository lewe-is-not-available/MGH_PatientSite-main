import React, { useRef, useState } from "react";
import supabase from "../config/Supabase";
import {
  AiOutlineEyeInvisible,
  AiFillEye,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";

const Signup = ({ Closereg, open }) => {
  //*Open sign in modal and prevent form submit
  const handleSignIn = (e) => {
    e.preventDefault();
    open();
  };

  //*getting inputs
  const [date, setDate] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    Fname: "",
    Lname: "",
    Mname: "",
    Phone: "",
    confirmEmail: "",
    confrimPass: "",
    Address:""
  });

  //*Onchange event
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const errRef = useRef();
  const [err, setErr] = useState("");

  //*Verify Email from 6 digit code
  const [VerifyLoad, setVerifyLoad] = useState(true);
  const [isVerified, setisVerified] = useState(false);
  //console.log(isVerified);
  const email = formData.email;
  const token = formData.confirmEmail;
  const handleVerify = async (e) => {
    e.preventDefault();
    setisVerified(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) {
      setErr(error);
      setisVerified(false);
    } else {
      setVerifyLoad(false);
    }
  };
  //*Onsubmit
  const handleSubmit = async (e) => {
    if (formData.password !== formData.confrimPass) {
      e.preventDefault();
      toast.error("Your password isn't matched");
      return;
    }
    if (isVerified) {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        sendOtp: true,
        options: {
          data: {
            username: formData.username,
            first_name: formData.Fname,
            last_name: formData.Lname,
            middle_name: formData.Mname,
            phone: formData.Phone,
            birth_date: date,
            role: "patient",
            address: formData.Address
          },
        },
      });
      if (error) {
        setErr(error);
      } else {
        toast.info("veirification sent in your email.");
      }
    } else {
      e.preventDefault();
      toast.error("Please finish the verification first");
    }
  };

  //*show/hide password function
  const [visible, setVisible] = useState(false);
  const isOpen = visible ? "text" : "password";

  //console.log(formData);

  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed z-50 inset-0 bg-opacity-30">
      <ToastContainer />
      <>
        <div className="absolute abs bg-white mt-40 rounded-xl">
          <div className="justify-center flex -mb-10 pt-6 font-semibold text-xl">
            REGISTER
          </div>
          <div className="mb-8 mt-4 mr-4 flex justify-end">
            <button
              onClick={Closereg}
              className="bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 hover:ring-slate-500 ring-transparent transition duration-100 ring-2 text-lg rounded-full px-2"
            >
              close
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            {err && (
              <p
                className={
                  err
                    ? "err text-center py-1 mx-12 mb-3 -mt-1 bg-red-300"
                    : "offscreen"
                }
                aria-live="assertive"
              >
                {err.message}
              </p>
            )}

            <div className="px-10 pb-10">
              <div className="grid grid-cols-3 gap-x-3 gap-y-3">
                <div className="">
                  <p>First Name: </p>
                  <input
                    name="Fname"
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="">
                  <p>Last Name: </p>
                  <input
                    name="Lname"
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="">
                  <p>Middle Name: </p>
                  <input
                    name="Mname"
                    onChange={handleChange}
                    autoComplete="on"
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3 col-span-3 mb-3">
                  <div className="">
                    <p>Username: </p>
                    <input
                      name="username"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                       focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <p>Email: </p>
                    <input
                      name="email"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                      focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <p>Contact Number: </p>
                    <input
                      name="Phone"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <p>Brgy. or municipality: </p>
                    <textarea
                      name="Address"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <p>Date of Birth: </p>
                    <input
                      name="Birthday"
                      type="Date"
                      onChange={(e) => setDate(e.target.value)}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 mb-3">
                <div>
                  <p className="">Password:</p>
                  <div className="flex">
                    <input
                      name="password"
                      type={isOpen}
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="mb-3 px-2 w-[42%] text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <div
                      onClick={() => setVisible(!visible)}
                      className="cursor-pointer mt-1 ml-1 text-lg"
                    >
                      {visible ? (
                        <AiFillEye className="" />
                      ) : (
                        <AiOutlineEyeInvisible className="" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="">Confirm password: </p>
                  <div className="flex">
                    <input
                      name="confrimPass"
                      type={isOpen}
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-[42%] text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-[#418D3F] w-2/5 py-1 font-semibold text-lg text-white rounded-md transition duration-100 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
                >
                  Sign Up
                </button>
              </div>
              <div className="text-center">
                <p className="pt-4">Have account Already?</p>
                <button className="text-blue-500" onClick={handleSignIn}>
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    </div>
  );
};

export default Signup;

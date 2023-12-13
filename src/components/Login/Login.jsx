import React, { useEffect, useRef, useState } from "react";
//import useAuth from "../Hooks/useAuth";
import supabase from "../config/Supabase";
import { useNavigate } from "react-router-dom";
import { PiEye, PiEyeClosed } from "react-icons/pi";

const Login = ({ close, openReg, setToken, patient, token }) => {
  //TODO: Make registration
  //!Fix login
  // const navigate = useNavigate()
  //*open registration while preventing form to submit
  function handleRegistration(e) {
    e.preventDefault();
    openReg();
  }

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
  //*Login Function
  const errRef = useRef();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  //*navigates the user back to dashboard based on role
  const nav = useNavigate();

  //*Login button funtion
  async function handleSubmit(e) {
    e.preventDefault();
    if (token) {
      console.log(patient);
    }
    try {
      //*supabase user authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      //*successful sign-in
      nav("/Dashboard");
      setToken(data);
      setSuccess(true);

      //* error handling
    } catch (error) {
      setErr(error.message + "");
      console.log(error);
    }
  }
  //*show/hide password function
  const [visible, setVisible] = useState(false);
  const isOpen = visible ? "text" : "password";

  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed z-50 inset-0 bg-opacity-30">
      <>
        <div className="absolute abs rounded-md bg-white mt-40">
          <div className="mb-8 mt-4 mr-4 flex justify-end">
            <button
              onClick={close}
              className="bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 hover:ring-slate-500 ring-transparent transition duration-100 ring-2 text-lg rounded-full px-2"
            >
              close
            </button>
          </div>

          {success ? (
            <div className="px-20 pb-12">
              <section>
                <h1>Logged in</h1>
              </section>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p
                ref={errRef}
                className={
                  err
                    ? "err text-center py-1 mx-12 mb-3 -mt-1 bg-red-300"
                    : "offscreen"
                }
                aria-live="assertive"
              >
                {err}
              </p>
              <div className="px-20 pb-12">
                <div className="flex ml-10 mb-4">
                  <p className="mr-2">Email: </p>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    className=" ml-3 px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex mb-9">
                  <p className="ml-[13px]">Password: </p>
                  <input
                    type={isOpen}
                    name="password"
                    onChange={handleChange}
                    required
                    className=" ml-4 px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <div
                    onClick={() => setVisible(!visible)}
                    className="cursor-pointer mt-[2px] -ml-7 text-[20px] "
                  >
                    {visible ? <PiEye /> : <PiEyeClosed />}
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-[#418D3F] w-2/5 py-1 font-semibold text-lg text-white rounded-md transition duration-100 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
                  >
                    Sign in
                  </button>
                </div>
                <div className="text-center">
                  <p className="pt-4">No account?</p>
                  <button
                    className="text-blue-600"
                    onClick={handleRegistration}
                  >
                    {" "}
                    create one
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </>
    </div>
  );
};

export default Login;

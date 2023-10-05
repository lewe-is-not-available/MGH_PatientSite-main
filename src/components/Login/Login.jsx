import React, { useRef, useState } from "react";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
//import useAuth from "../Hooks/useAuth";
import LoginButton from "./LoginButton";
import supabase from "../config/Supabase";

const Login = ({ close, openReg }) => {
  //TODO: Make registration
  //!Fix login

  //*get input
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  console.log(formData);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      console.log(data);
      setSuccess(true)
      // if (data) {
      // localStorage.setItem("token", JSON.stringify(data));
     
      // }
    } catch (error) {
      setErr(error + "");
      console.log(err);
    }
  };
  //*show/hide password function
  const [visible, setVisible] = useState(false);

  const isOpen = visible ? "text" : "password";

  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed inset-0 bg-opacity-30">
      <>
        <div className="absolute bg-white mt-40">
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
                    className=" ml-5 px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <div
                    onClick={() => setVisible(!visible)}
                    className="cursor-pointer"
                  >
                    {visible ? <AiFillEye /> : <AiOutlineEyeInvisible />}
                  </div>
                </div>
                <div className="flex justify-center">
                  <LoginButton />
                </div>
                <div className="text-center">
                  <p className="pt-4">No account?</p>
                  <button className="text-blue-600" onClick={openReg}>
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

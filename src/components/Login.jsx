import React, { useRef, useEffect, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const Login = () => {
  //TODO: Make registration
  //!Fix login

  //*get input
  const [pass, setPass] = useState("");
  const [user, setUser] = useState("");

  //*Login Function
  const userRef = useRef();
  const errRef = useRef();
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErr("");
  }, [user, pass]);

  //*show/hide password function
  const [visible, setVisible] = useState(false);
  const isOpen = visible ? "text" : "password";

  return (
    <div className="">
      <div className="px-20 pb-16">
        <p ref={errRef} className={err ? "err" : "offscreen"} aria-live="assertive">{err}</p>
        <div className="flex mb-4">
          <p>Username: </p>
          <input
            type="text"
            className=" ml-3 px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="flex mb-9">
          <p className="ml-[5px]">Password: </p>
          <input
            type={isOpen}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className=" ml-3 px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div onClick={() => setVisible(!visible)} className="cursor-pointer">
            {visible ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
        </div>
        <div className="flex justify-center">
          <button className="bg-[#418D3F] w-2/5 py-1 font-semibold text-lg text-white rounded-md transition duration-100 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

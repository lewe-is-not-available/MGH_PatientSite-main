import React, { useRef, useEffect, useState, useContext } from "react";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";
import AuthContext from "./context/AuthProvider";
import axios from "./API/Axios";
const LOGIN_URL = "/auth";

const Login = ({ close }) => {
  //TODO: Make registration
  //!Fix login

  //*get input
  const [pass, setPass] = useState("");
  const [user, setUser] = useState("");

  //*Login Function
  const { setAuth } = useContext(AuthContext);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pass }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data.roles;
      setAuth({ user, pass, accessToken, roles });
      setUser("");
      setPass("");
      setSuccess(true);
    } catch (err) {
      if (!err?.response) {
        setErr("No Server Response");
      } else if (err.response?.status === 400) {
        setErr("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErr("Unauthorized");
      } else {
        setErr("Login Failed");
      }
      errRef.current.focus();
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
                  className={err ? "err text-center py-1 mx-12 mb-3 -mt-1 bg-red-300" : "offscreen"}
                  aria-live="assertive"
                >
                  {err}
                </p>
              <div className="px-20 pb-12">
             
                <div className="flex -ml-7 mb-4">
                  <p>Username/email: </p>
                  <input
                    ref={userRef}
                    type="text"
                    id="username"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    autoComplete="off"
                    required
                    className=" ml-3 px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="flex mb-9">
                  <p className="ml-[13px]">Password: </p>
                  <input
                    type={isOpen}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
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
                  <button className="bg-[#418D3F] w-2/5 py-1 font-semibold text-lg text-white rounded-md transition duration-100 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]">
                    Login
                  </button>
                </div>
                <div className="text-center">
                  <p className="pt-4">No account?</p>
                  <a
                    href="https://accounts.google.com/signup/v2/createaccount?theme=glif&flowName=GlifWebSignIn&flowEntry=SignUp"
                    className="text-blue-500"
                  >
                    create one
                  </a>
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

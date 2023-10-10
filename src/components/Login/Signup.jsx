import React, { useState } from "react";
import supabase from "../config/Supabase";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";

const Signup = ({ Closereg, open }) => {
  //TODO: make an OTP vrification for email

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            role: "patient",
          },
        },
      });
      alert("check email for veirification");

      if (error) throw error;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //*show/hide password function
  const [visible, setVisible] = useState(false);
  const isOpen = visible ? "text" : "password";

  //console.log(formData);

  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed inset-0 bg-opacity-30">
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
            <div className="px-10 pb-10">
              <div className="grid grid-cols-3 gap-x-3 gap-y-3">
                <div className="">
                  <p>First Name: </p>
                  <input
                    name="first_name"
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="">
                  <p>Last Name: </p>
                  <input
                    name="last_name"
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="">
                  <p>Suffix: </p>
                  <input
                    name="suffix"
                    onChange={handleChange}
                    autoComplete="on"
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 col-span-3 mb-3">
                  <div className="">
                    <p>Username: </p>
                    <input
                      name="username"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <p>Email: </p>
                    <input
                      name="email"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  {/* <div className="">
                    <p className="text-sm">Email Confirmation Code: </p>
                    <input
                      name="email"
                      onChange={handleChange}
                      autoComplete="on"
                      required
                      className="px-2 w-full text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div> */}
                  <div className="">
                    <p>Contact Number: </p>
                    <input
                      name="Contact"
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
                      onChange={handleChange}
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
                      name="password"
                      type={isOpen}
                      onChange={handleChange}
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
                  Sign In
                </button>
              </div>
              <div className="text-center">
                <p className="pt-4">Have account Already?</p>
                <button className="text-blue-500" onClick={open}>
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

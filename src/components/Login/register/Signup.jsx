import React, { useState } from "react";
import supabase from "../../config/Supabase";
import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";

const Signup = ({ Closereg, open }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: ""
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            role: "patient"
          },
        },
      });
      alert('check email for veirification')

      if (error) throw error;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //*show/hide password function
  const [visible, setVisible] = useState(false);
  const isOpen = visible ? "text" : "password";

  console.log(formData);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed inset-0 bg-opacity-30">
      <>
        <div className="absolute bg-white mt-40">
          REGISTER
          <div className="mb-8 mt-4 mr-4 flex justify-end">
            <button
              onClick={Closereg}
              className="bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 hover:ring-slate-500 ring-transparent transition duration-100 ring-2 text-lg rounded-full px-2"
            >
              close
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="px-10 pb-12">
              <div className="grid grid-cols-3 gap-x-3">
                <div className="mb-4">
                  <p>Username: </p>
                  <input
                    name="username"
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="mb-4">
                  <p>email: </p>
                  <input
                    name="email"
                    onChange={handleChange}
                    autoComplete="off"
                    required
                    className="px-2 text-slate-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="flex mb-9">
                <p className="ml-[13px]">Password: </p>
                <input
                  name="password"
                  type={isOpen}
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

import React, { useState, useEffect } from "react";
import supabase from "./config/Supabase";
import copy from "copy-to-clipboard";
import doc from "./images/doc.jpg"
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { FaUserDoctor } from "react-icons/fa6";
import { GoHistory } from "react-icons/go";
import {
  BsInfoCircle,
  BsInfoCircleFill,
  BsCalendarCheck,
  BsCalendarCheckFill,
  BsPhone,
} from "react-icons/bs";
import {
  RiComputerLine,
  RiComputerFill,
  RiDashboardLine,
  RiDashboardFill,
} from "react-icons/ri";
import {
  MdOutlinePermContactCalendar,
  MdPermContactCalendar,
  MdOutlineFeedback,
  MdFeedback,
  MdOutlineMailOutline,
} from "react-icons/md";



const Sidebar = ({ token, isAdmin, isDoctor, isPatient, closeSide, user, imgName, setimgName, CDNURL }) => {
  //*Authentication by roles
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

  //*Dropdown functions
  const [services, fetchServices] = useState(false);
  const [About, fetchAbout] = useState(false);

  const openService = () => fetchServices(!services);
  const openAbout = () => fetchAbout(!About);

  //*show more text
  const [isTruncate, setTruncate] = useState(true);
  const seeMore = () => setTruncate(!isTruncate);

  //*copy clipboard
  const copyToClipboard = () => {
    seeMore();
    copy(user.id);
    toast.info(`You have copied "${user.id}"`, {
      toastId: "info",
    });
  };

  //*Getting image from storage
  
  async function getImages() {
    const { data, error } = await supabase.storage
      .from("images")
      .list(user.id + "/", {
        limit: 1,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (data[0]) {
      setimgName(data[0].name);
    } else {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }
  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user, getImages]);

  //*Updating image
  async function updateImage(e) {
    const File = e.target.files[0];
    if (!File) {
      return;
    }
    console.log(File);
    const imageName = user.id + "/" + imgName;
    const { data, error } = await supabase.storage
      .from("images")
      .update(imageName, File, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      console.log(error);
    }
    if (data[0]) {
      setimgName(data[0].name);
    }
  }
  //*Image uploading
  async function uploadImage(e) {
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("images")
      .upload(user.id + "/" + uuidv4(), file);

    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }
  //* deleting image
  async function deleteImage(imageName) {
    const { error } = await supabase.storage
      .from("images")
      .remove([user.id + "/" + imageName]);

    if (error) {
      alert(error);
    } else {
      getImages();
    }
  }
  return (
    <div className=" w-[15.5%] fixed">
      <div className="bg-[#f2fff0ee] pt-1 h-screen shadow-2xl">
        {/* close button */}
        <div className="flex justify-end mx-4 mt-4 mb-0">
          <IoClose
            onClick={closeSide}
            className="text-[40px] cursor-pointer text-slate-500 transition duration-100 hover:text-white hover:bg-slate-400 rounded-md p-1"
          />
        </div>
        {/* User Profile */}
        {token ? (
          <>
            <div className="px-10 mx-5 rounded-lg flex flex-col items-center space-y-1">
              <img
                className="object-cover rounded-full w-[10rem] h-[10rem] "
                src={CDNURL + user.id + "/" + imgName}
                alt="No image"
              />
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => updateImage(e)}
              />

              {/* truncate w-full text-sm */}
              <p className="uppercase text-lg">
                {user.last_name} {user.first_name}
              </p>
              <label
                onClick={copyToClipboard}
                className={`${
                  isTruncate
                    ? "truncate w-48 text-sm cursor-pointer"
                    : "w-full text-sm cursor-pointer"
                }`}
              >
                ID: {user.id}
              </label>
              {admin ? (
                ""
              ) : (
                <>
                  <p className="flex item-center whitespace-nowrap">
                    <BsPhone className=" text-lg" /> {user.phone}
                  </p>
                  <p className="flex whitespace-nowrap">
                    <MdOutlineMailOutline className=" mr-1 text-lg mb-4" />{" "}
                    {user.email}
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          ""
        )}

        {/* Sidebar contents */}
        <div className="text-lg">
          {admin || doctor ? (
            ""
          ) : (
            <>
              <Link
                to="/"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <AiOutlineHome className="text-2xl mr-2 group-hover/os:invisible" />
                <AiFillHome className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Home</p>
              </Link>
              {patient && (
                <Link
                  to="/Patient/Dashboard"
                  className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
                >
                  <RiDashboardLine className="text-2xl mr-2 group-hover/os:invisible" />
                  <RiDashboardFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                  <p className="-translate-x-8">Dashboard</p>
                </Link>
              )}

              <li
                onClick={openService}
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <RiComputerLine className="text-2xl mr-2 group-hover/os:invisible" />
                <RiComputerFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Online Services</p>
                <FiChevronDown
                  className={`${
                    services
                      ? "ml-4 text-2xl transition duration-100 rotate-180"
                      : "ml-4 text-2xl transition duration-100 "
                  }`}
                />
              </li>

              <div className={`${services ? "show -m-1" : "hide -m-1"}`}>
                <Link
                  to="/Appointment"
                  className="px-4 py-1 flex flex-col group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <p className="translate-x-8">Appointment</p>
                </Link>
                <Link
                  to="/Feedback-Form"
                  className="px-4 py-1 flex flex-col group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <p className="translate-x-8">Feedback</p>
                </Link>
              </div>
              <Link
                onClick={openAbout}
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <BsInfoCircle className="text-2xl mr-2 group-hover/os:invisible" />
                <BsInfoCircleFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">About Us</p>
                <FiChevronDown
                  className={`${
                    About
                      ? "ml-[4.2rem] text-2xl transition duration-100 rotate-180"
                      : "ml-[4.2rem] text-2xl transition duration-100 "
                  }`}
                />
              </Link>
              <div className={`${About ? "show -m-1" : "hide -m-1"}`}>
                <Link
                  to="/Hospital-Profile"
                  className="px-4 py-1 flex flex-col group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <p className="translate-x-8">Hospital Profile</p>
                </Link>
                <Link
                  to="/Mission-and-Vision"
                  className="px-4 py-1 flex flex-col group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <p className="translate-x-8">Mission & Vision</p>
                </Link>
              </div>
              <Link
                to="/Contacts"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <MdOutlinePermContactCalendar className="text-2xl mr-2 group-hover/os:invisible" />
                <MdPermContactCalendar className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Contact Us</p>
              </Link>
            </>
          )}

          {/* Admin */}
          {admin && (
            <>
              <Link
                to="/"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <AiOutlineHome className="text-2xl mr-2 group-hover/os:invisible" />
                <AiFillHome className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Home</p>
              </Link>
              <Link
                to="/Admin/Dashboard"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <RiDashboardLine className="text-2xl mr-2 group-hover/os:invisible" />
                <RiDashboardFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Dashboard</p>
              </Link>
              <Link
                to="/Confirm_Appointments"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <BsCalendarCheck className="text-2xl mr-2 group-hover/os:invisible" />
                <BsCalendarCheckFill className="text-2xl mr-2 -translate-x-7 invisible group-hover/os:visible" />
                <p className="-translate-x-7 whitespace-nowrap">
                  Confirm Appointments
                </p>
              </Link>
              <Link
                to="/Edit_doctors"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <FaUserDoctor className="text-2xl mr-2" />
                <p>Edit Doctors</p>
              </Link>
              <Link
                to="/User_feedbacks"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <MdOutlineFeedback className="text-2xl mr-2 group-hover/os:invisible" />
                <MdFeedback className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Patient's feedback form</p>
              </Link>
            </>
          )}

          {/* Patient */}
          {patient && (
            <li className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex">
              <GoHistory className="text-2xl mr-2" />
              <p>Online Consultation history</p>
            </li>
          )}

          {/* Doctor */}
          {doctor && (
            <>
              <li className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex">
                <BsCalendarCheck className="text-2xl mr-2 group-hover/os:invisible" />
                <BsCalendarCheckFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Appointments</p>
              </li>
              <li className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex">
                <GoHistory className="text-2xl mr-2" />
                <p>Doctor's Consultation history</p>
              </li>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
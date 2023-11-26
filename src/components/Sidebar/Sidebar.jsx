import React, { useState, useEffect, useRef } from "react";
import supabase from "../config/Supabase";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiFillHome,
  AiOutlineSchedule,
  AiFillSchedule,
} from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { FaUserDoctor, FaUserGroup, FaHandshakeAngle } from "react-icons/fa6";
import { GoHistory } from "react-icons/go";
import { GrStatusGood, GrStatusGoodSmall } from "react-icons/gr";
import {
  BsInfoCircle,
  BsInfoCircleFill,
  BsCalendarCheck,
  BsCalendarCheckFill,
  BsPhone,
  BsArchive,
  BsArchiveFill,
} from "react-icons/bs";
import {
  RiComputerLine,
  RiComputerFill,
  RiDashboardLine,
  RiDashboardFill,
  RiHospitalLine,
  RiHospitalFill,
} from "react-icons/ri";
import {
  MdOutlinePermContactCalendar,
  MdPermContactCalendar,
  MdOutlineFeedback,
  MdFeedback,
  MdOutlineMailOutline,
} from "react-icons/md";

const Sidebar = ({
  token,
  isAdmin,
  isDoctor,
  isPatient,
  closeSide,
  user,
  imgName,
  CDNURL,
  isImgEmpty,
  setImgEmpty,
  openProfileUpload,
  setimgName,
  open,
}) => {
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

  //*close dropdown when clicked outside

  let serviceRef = useRef();
  let aboutRef = useRef();
  useEffect(() => {
    let abouthandler = (e) => {
      if (!aboutRef.current.contains(e.target)) {
        fetchAbout(false);
      }

      document.addEventListener("mousedown", abouthandler);
    };

    return () => {
      document.removeEventListener("mousedown", abouthandler);
    };
  }, [fetchAbout]);
  useEffect(() => {
    let handler = (e) => {
      if (services) {
        if (!serviceRef.current.contains(e.target)) {
          fetchServices(false);
        }
      }

      document.addEventListener("mousedown", handler);
    };
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [fetchServices, services]);

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
  // eslint-disable-next-line
  useEffect(() => {
    if (user) {
      async function getImages() {
        try {
          const { data, error } = await supabase.storage
            .from("images")
            .list(user.email + "/profile/", {
              limit: 10,
              offset: 0,
              sortBy: { column: "created_at", order: "asc" },
            });
          //console.log(user.id)
          if (data[0]) {
            setImgEmpty(true);
            setimgName(data[0].name);
          } else {
            setImgEmpty(false);
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
        } catch (error) {
          setImgEmpty(false);
          console.log(error);
        }
      }
      getImages();
    }
  }, [user, isImgEmpty, imgName, setimgName, setImgEmpty]);
  //console.log(imgName)
  return (
    <div className="w-[18.8rem] bg-[#f0fcec] fixed">
      <div className=" pt-1 h-screen shadow-2xl">
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
              <div
                onClick={openProfileUpload}
                className="group/pic cursor-pointer transition duration-100 hover:bg-slate-950 p-[5.1rem] mt-1 hover:bg-opacity-60 rounded-full fixed"
              >
                <p className="absolute group-hover/pic:visible transition duration-100 invisible -ml-14 -mt-1 text-white text-lg text-center">
                  Upload Image
                </p>
              </div>
              <img
                className="object-cover rounded-full w-[10rem] h-[10rem]"
                src={`${
                  isImgEmpty
                    ? CDNURL + user.email + "/profile/" + imgName
                    : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                }`}
                alt="/"
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
        <div className="text-lg max-[]  max-h-[28rem] overflow-y-auto overflow-x-hidden ">
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

              <Link
                to="/Dashboard"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <RiDashboardLine className="text-2xl mr-2 group-hover/os:invisible" />
                <RiDashboardFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Dashboard</p>
              </Link>
              <li
                ref={serviceRef}
                onClick={openService}
                className="px-4 py-1 group/os items-center justify-between hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4  rounded-md hover:text-white flex"
              >
                <div className="flex items-center">
                  <RiComputerLine className="text-2xl mr-2 group-hover/os:invisible" />
                  <RiComputerFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                  <p className="-translate-x-8 ">Online Services</p>
                </div>

                <FiChevronDown
                  className={`${
                    services
                      ? "text-2xl transition duration-100 rotate-180"
                      : "text-2xl transition duration-100 "
                  }`}
                />
              </li>

              <div className={`${services ? "show" : "hide"}`}>
                <Link
                  to="/Appointment"
                  className="px-4 py-1 flex group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <AiOutlineSchedule className="text-2xl ml-8 mr-2 group-hover/os:invisible" />
                  <AiFillSchedule className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                  <p className="-translate-x-8">Appointment</p>
                </Link>
                <Link
                  to="/Contacts"
                  className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
                >
                  <MdOutlinePermContactCalendar className="text-2xl ml-8 mr-2 group-hover/os:invisible" />
                  <MdPermContactCalendar className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                  <p className="-translate-x-8">Contact Us</p>
                </Link>
              </div>
              <Link
                ref={aboutRef}
                onClick={openAbout}
                className="px-4 py-1 group/os items-center justify-between hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <div className="flex items-center">
                  <BsInfoCircle className="text-2xl mr-2 group-hover/os:invisible" />
                  <BsInfoCircleFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                  <p className="-translate-x-8">About Us</p>
                </div>

                <FiChevronDown
                  className={`${
                    About
                      ? " text-2xl transition duration-100 rotate-180"
                      : " text-2xl transition duration-100 "
                  }`}
                />
              </Link>
              <div className={`${About ? "show -m-1" : "hide -m-1"}`}>
                <Link
                  to="/Hospital-Profile"
                  className="px-4 py-1 flex group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <RiHospitalLine className="text-2xl ml-8 mr-2 group-hover/os:invisible" />
                  <RiHospitalFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                  <p className="-translate-x-8 whitespace-nowrap">
                    Company Profile
                  </p>
                </Link>
                <Link
                  to="/Mission-and-Vision"
                  className="px-4 py-1 flex group/os hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white"
                >
                  <FaHandshakeAngle className="text-2xl ml-8 mr-2" />
                  <p className="">Mission & Vision</p>
                </Link>
              </div>
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
                to="/Dashboard"
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
                to="/Archive"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <BsArchive className="text-2xl mr-2 group-hover/os:invisible" />
                <BsArchiveFill className="text-2xl mr-2 -translate-x-7 invisible group-hover/os:visible" />
                <p className="-translate-x-7 whitespace-nowrap">Archives</p>
              </Link>
              <Link
                to="/Edit_doctors"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <FaUserDoctor className="text-2xl mr-2" />
                <p>Edit Doctors</p>
              </Link>
              <Link
                to="/Edit_Patients"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <FaUserGroup className="text-2xl mr-2" />
                <p>Edit Patients</p>
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
            <>
              <Link
                to="/Online_Consultation_History"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <BsArchive className="text-2xl mr-2 group-hover/os:invisible" />
                <BsArchiveFill className="text-2xl mr-2 -translate-x-7 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Archives</p>
              </Link>
              <Link
                to="/Appointment/Status"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <GrStatusGood className="text-2xl mr-2 group-hover/os:invisible" />
                <GrStatusGoodSmall className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Appointment Status</p>
              </Link>
            </>
          )}

          {/* Doctor */}
          {doctor && (
            <>
              <Link
                to="/Dashboard"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <RiDashboardLine className="text-2xl mr-2 group-hover/os:invisible" />
                <RiDashboardFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Dashboard</p>
              </Link>
              <Link
                to="/Doctor/Appointments"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <BsCalendarCheck className="text-2xl mr-2 group-hover/os:invisible" />
                <BsCalendarCheckFill className="text-2xl mr-2 -translate-x-8 invisible group-hover/os:visible" />
                <p className="-translate-x-8">Appointments</p>
              </Link>
              <Link
                to="/DoctorConsultHistory"
                className="px-4 py-1 group/os items-center hover:cursor-pointer transition duration-75 ease-in hover:bg-[#5f915a94] mx-4 my-3 rounded-md hover:text-white flex"
              >
                <GoHistory className="text-2xl mr-2" />
                <p className="-translate-x-8">Archives</p>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

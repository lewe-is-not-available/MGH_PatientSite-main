import React, { useState, useEffect } from "react";
import logo from "./images/MGHlogo.png";
import { Link } from "react-router-dom";
import Login from "./Login/Login";
import Reg from "./Login/Signup";
import { useNavigate } from "react-router-dom";
import supabase from "./config/Supabase";
import { ToastContainer } from "react-toastify";
import { BiMenu } from "react-icons/bi";
import "react-toastify/dist/ReactToastify.css";
import DragandDrop from "./Sidebar/Drag_and_Drop";
import Consent from "./patient/Appointment Process/Consent";
import moment from "moment";
import CurrentModal from "./CurrentModal";
import _ from "lodash";
import F2fConfig from "./F2fConfig";

const Navbar = ({
  token,
  setToken,
  isAdmin,
  isDoctor,
  isPatient,
  open,
  openSide,
  imgName,
  CDNURL,
  user,
  isImgEmpty,
  closeProfileUpload,
  isProfileOpen,
  setUploaded,
  FetchShow,
  Show,
  openTerms,
  isRead,
  setRead,
}) => {
  //*Function to show/hide registration and login
  const [doctor, setDoctor] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [patient, setPatient] = useState(false);

  //*to show login modal
  const [regOpen, setRegOpen] = useState(false);
  const Open = () => {
    FetchShow(true);
    setRegOpen(false);
  };
  const Close = () => {
    FetchShow(false);
  };
  const Openreg = () => {
    setRegOpen(true);
    FetchShow(false);
  };
  const Closereg = () => {
    setRegOpen(false);
  };

  //*Modal that opens automatically when appointment day arrives
  const [currentQueue, setcurrentQueue] = useState();
  const [currModal, setCurrModal] = useState(false);
  const [doc, setDoc] = useState();
  async function fetchCurrent() {
    try {
      const { data: queNum, error: queErr } = await supabase
        .from("patient_Appointments")
        .select()
        .match({
          email: user?.email,
          date: moment(new Date()).format("yyyy-M-D"),
          status: "Consultation Ongoing",
        });
      if (queErr) {
        throw queErr;
      }
      if (queNum) {
        setcurrentQueue(queNum[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  async function fetchDoc() {
    try {
      if (currentQueue?.doc_id !== undefined) {
        const { data: docData, error: docErr } = await supabase
          .from("dr_information")
          .select()
          .eq("id", currentQueue.doc_id);

        if (docErr) throw docErr;
        if (docData) {
          setDoc(docData[0]);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //*Get day if Doctor's schedule is today
  const today = moment(new Date()).format("dddd");
  const docSchedToday = _.filter(doc?.schedule, ["day", today]);
  //*get check in and check out of doctor
  const checkIn = moment(
    new Date(`2000-01-01T${docSchedToday && docSchedToday[0]?.startTime}`)
  ).format("HHmm");
  const checkOut = moment(
    new Date(`2000-01-01T${docSchedToday && docSchedToday[0]?.endTime}`)
  ).format("HHmm");

  const appDay = moment(new Date(currentQueue?.date)).format("YYYYMD");

  //*Get time today per minute
  const [timeNow, setCount] = useState();
  useEffect(() => {
    //*change per minute

    const interval = setInterval(() => {
      setCount(moment(new Date()).format("HHmm"));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeNow]);

  //*check if currentQueue reached the checkOut time
  const isElapsed = _.lte(
    appDay + checkOut,
    moment(new Date()).format(`YYYYMD${timeNow}`)
  );
  const isSchedToday = _.inRange(timeNow, checkIn, checkOut);

  //*Disable scroll when modal is open
  if (Show || regOpen || isRead || currModal) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }
  //*function that opens modal
  useEffect(() => {
    if (
      (isSchedToday || isElapsed) &&
      currentQueue?.status !== "undefined" &&
      currentQueue?.status !== "pending" &&
      currentQueue?.status !== "rejected" &&
      currentQueue?.status !== "rescheduled" &&
      currentQueue?.status !== "Confirmed"
    ) {
      setCurrModal(true);
    } else {
      setCurrModal(false);
    }
  }, [currentQueue, isSchedToday]);

  //*update status of f2f to complete
  const [f2fData, setF2fData] = useState([]);
  async function updateF2f() {
    try {
      const { data, error } = await supabase
        .from("patient_Appointments")
        .select()
        .eq("type", "f2f");

      if (error) throw error;
      if (data) {
        setF2fData(data);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  //*Realtime function
  useEffect(() => {
    fetchCurrent();
    fetchDoc();
    updateF2f();
    const fetchAndSubscribe = async () => {
      await fetchCurrent();
      await fetchDoc();
      await updateF2f();
      const realtime = supabase
        .channel("room14")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `email=eq.${user?.email}`,
          },
          (payload) => {
            setcurrentQueue(payload.new);
            console.log(payload.new);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "dr_information",
            filter: `id=eq.${currentQueue?.doc_id}`,
          },
          (payload) => {
            setDoc(payload.new);
            // console.log(payload.new.data)
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [user, currentQueue?.doc_id]);

  useEffect(() => {
    if (token) {
      if (isDoctor) {
        setDoctor(true);
      }
      if (isAdmin) {
        setAdmin(true);
      }
      if (isPatient) {
        setPatient(true);
      }
    }
  }, [token, isDoctor, isAdmin, isPatient]);

  //*Logout Function
  const navigate = useNavigate();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error);
    } else {
      setToken(false);
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    }
  }

  //*responsive dropdown account
  const [OpenAccount, setOpenAccount] = useState(false);

  return (
    <>
      {f2fData?.map((item, i) => (
        <F2fConfig data={item} i={i} />
      ))}
      {currModal && (
        <div className="absolute w-full h-screen z-[60]">
          <CurrentModal
            data={currentQueue}
            setCurrModal={setCurrModal}
            doc={doc}
            isElapsed={isElapsed}
          />
        </div>
      )}
      <div>
        <ToastContainer />
        <div className="z-50 flex justify-between items-center top-0 w-full bg-[#315E30] px-3 pl-5">
          <div className="flex items-center">
            {/* Open button for side */}
            <div
              className={`${
                open
                  ? "flex items-center transition-transform duration-200 ease-in -translate-x-20"
                  : "flex items-center transition-transform duration-200 ease-out translate-x-0 "
              }`}
            >
              <BiMenu
                onClick={openSide}
                className="text-[40px] ml-4 cursor-pointer text-white transition duration-100 hover:text-white hover:bg-slate-400 rounded-md p-1"
              />

              <Link
                to="/Dashboard"
                className="hover:cursor-pointer flex items-center p-3 ml-5"
              >
                <div className="w-[65px] select-none max-[1366px]:w-[53px] max-[769px]:w-[40px]">
                  <img src={logo} alt="/" />
                </div>
                <h1 className="font-bold select-none text-6xl max-[1366px]:text-5xl max-[769px]:text-4xl whitespace-nowrap text-white pl-2 flex">
                  MGH
                  {patient && (
                    <p className="ml-3 font-thin max-[930px]:hidden text-4xl self-center max-md:text-xl">
                      Patient's page
                    </p>
                  )}
                  {doctor && (
                    <p className="ml-3 font-thin max-[930px]:hidden text-4xl self-center max-md:text-xl">
                      Doctor's page
                    </p>
                  )}
                  {admin && (
                    <p className="ml-3 font-thin max-[930px]:hidden text-4xl self-center max-md:text-xl">
                      Admin's page
                    </p>
                  )}
                </h1>
              </Link>
            </div>
          </div>
          <div className=" mr-12 text-lg max-md:text-sm ">
            {token ? (
              <div className="flex space-x-4 -mt-2 max-[320px]:-translate-x-8 max-[320px]:w-[10rem] items-center">
                <p className="text-white text-right max-sm:hidden font-medium uppercase">
                  {token.user.user_metadata.first_name}
                  <br />
                  <span className="text-sm font-light lowercase">
                    {user.email}
                  </span>
                </p>
                <div
                  onClick={() => setOpenAccount(!OpenAccount)}
                  className="min-[426px]:hidden p-6 z-50 translate-x-7 opacity-50 absolute rounded-full"
                ></div>
                <img
                  className="object-cover rounded-full max-[425px]:translate-x-7 w-[3rem] h-[3rem]"
                  src={`${
                    isImgEmpty
                      ? CDNURL + user.email + "/profile/" + imgName
                      : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                  }`}
                  alt="https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                />
                <button
                  onClick={handleLogout}
                  className="ring-2 text-white max-[425px]:hidden whitespace-nowrap ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="submit"
                onClick={Open}
                className="ring-2 text-white ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
        {token && (
          <div
            className={`${
              OpenAccount
                ? "visible absolute w-full flex justify-end"
                : "hidden absolute w-full justify-end"
            }`}
          >
            <div className="bg-white abs p-4 w-fit flex flex-col space-y-2">
              <h1>{token.user.user_metadata.first_name}</h1>
              <p>{user.email}</p>
              <button
                onClick={handleLogout}
                className="px-3 bg-slate-200 active:bg-slate-400 rounded-md"
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        <div className={`${regOpen ? "visible" : "hidden"}`}>
          <Reg Closereg={Closereg} open={Open} />
        </div>
        <div className={`${Show ? "visible" : "hidden"}`}>
          <Login
            doctor={doctor}
            admin={admin}
            patient={patient}
            close={Close}
            openReg={Openreg}
            setshow={FetchShow}
            token={token}
            setToken={setToken}
          />
        </div>
        <div className={`${isProfileOpen ? "visible" : "hidden"}`}>
          <DragandDrop
            isImgEmpty={isImgEmpty}
            setUploaded={setUploaded}
            user={user}
            imgName={imgName}
            isProfileOpen={isProfileOpen}
            closeProfileUpload={closeProfileUpload}
          />
        </div>
        {isRead && (
          <Consent
            setRead={setRead}
            openTerms={openTerms}
            isRead={isRead}
            token={token}
          />
        )}
      </div>
    </>
  );
};

export default Navbar;

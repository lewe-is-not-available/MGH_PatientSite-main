import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Appointment from "./components/Appointment Process/Appointment";
import MissonVision from "./components/MissonVision";
import Profile from "./components/HospitalProfile";
import Feedback from "./components/Feedback";
import DocInfo from "./components/Doctor read/DoctorInfo";
import OnlineOrF2f from "./components/Appointment Process/ChooseType";
import F2f from "./components/Appointment Process/Face2face";
import Online from "./components/Appointment Process/OnlineConsult";
import Admin from "./components/Higher user level/Admin/AdminDashboard";
import AppointConfirmation from "./components/Higher user level/Admin/AppointmentConfirmation";
import EditDoctors from "./components/Higher user level/Admin/EditDoctors";
import Doctor from "./components/Higher user level/DoctorPage";
import AdminFeedback from "./components/Higher user level/Admin/feedback_Admin";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./components/config/Supabase";
import OnlineConsultationHistory from "./components/Appointment Process/OnlineConsultationHistory";
import DoctorConsultHistory from "./components/Higher user level/DoctorConsulHistory";
import PatientDashboard from "./components/patient/Dashboard";
import Sidebar from "./components/Sidebar";
import { toast } from "react-toastify";

function App() {
  //*For getting token of user
  const [token, setToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [user, setUser] = useState([]);
  //*initiates after login
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
      const fetchAdmin = async () => {
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .single();
        //*compare roles if matched
        if (error) {
          console.log(error);
        }
        if (data && data.role) {
          if (data.role === "admin") {
            setIsAdmin(true);
          }
          if (data.role === "doctor") {
            setIsDoctor(true);
          }
          if (data.role === "patient") {
            setIsPatient(true);
          }
        }
        if (data) {
          return setUser(data);
        }
      };
      fetchAdmin();
    }
  }, [token]);

  //*For passing image data
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(null);
  const [isUploaded, setUploaded] = useState(false);
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const ALTIMG =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png";

  //*to show login modal
  const [Show, FetchShow] = useState(null);
  const [regOpen, setRegOpen] = useState(false);
  const Close = () => FetchShow(false);
  const Open = () => {
    FetchShow(true);
    setRegOpen(false);
  };

  const Openreg = () => {
    setRegOpen(true);
    FetchShow(false);
  };
  const Closereg = () => setRegOpen(false);

  //*To show modal for updating profile picture
  const [isProfileOpen, setIsProfile] = useState(false);
  const openProfileUpload = () => setIsProfile(true);
  const closeProfileUpload = () => setIsProfile(false);

  //*Open and closing sidebar
  const [open, setOpen] = useState(true);
  const openSide = () => setOpen(true);
  const closeSide = () => setOpen(false);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col ">
      <header className="sticky w-screen top-0 z-50">
        <Navbar
          setUploaded={setUploaded}
          closeProfileUpload={closeProfileUpload}
          isProfileOpen={isProfileOpen}
          isImgEmpty={isImgEmpty}
          setimgName={setimgName}
          user={user}
          CDNURL={CDNURL}
          imgName={imgName}
          Open={Open}
          Show={Show}
          regOpen={regOpen}
          Close={Close}
          Openreg={Openreg}
          Closereg={Closereg}
          open={open}
          openSide={openSide}
          closeSide={closeSide}
          token={token}
          setToken={setToken}
          isAdmin={isAdmin}
          isDoctor={isDoctor}
          isPatient={isPatient}
        />
        <div
          className={`${
            open
              ? "transition-transform duration-200 ease-in translate-x-0"
              : "transition-transform duration-200 ease-out -translate-x-80"
          }`}
        >
          <Sidebar
            isUploaded={isUploaded}
            openProfileUpload={openProfileUpload}
            isImgEmpty={isImgEmpty}
            setImgEmpty={setImgEmpty}
            ALTIMG={ALTIMG}
            CDNURL={CDNURL}
            setimgName={setimgName}
            imgName={imgName}
            Open={Open}
            user={user}
            closeSide={closeSide}
            className="h-screen left-0 "
            token={token}
            isAdmin={isAdmin}
            isDoctor={isDoctor}
            isPatient={isPatient}
          />
        </div>
      </header>
      <main
        className={`${
          open
            ? "flex-grow h-full transition ease-in duration-200 translate-x-[18.7rem] w-[86%]"
            : "flex-grow h-full transition ease-out duration-200  translate-x-0 w-screen"
        }`}
      >
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={<Home token={token} isDoctor={isDoctor} />}
          />

          {/* Doctor's side */}
          <Route path="/Doctor" element={<Doctor />} />
          <Route
            path="/DoctorConsultHistory"
            element={<DoctorConsultHistory />}
          />

          {/* Admin's side */}
          <Route path="/User_feedbacks" element={<AdminFeedback />} />
          <Route path="/Edit_doctors" element={<EditDoctors />} />
          <Route
            path="/Confirm_Appointments"
            element={<AppointConfirmation token={token} />}
          />
          <Route path="/Admin/Dashboard" element={<Admin />} />

          {/*patient's side */}
          <Route path="/Mission-and-Vision" element={<MissonVision />} />
          <Route path="/Patient/Dashboard" element={<PatientDashboard />} />
          <Route path="/Feedback-Form" element={<Feedback token={token} />} />
          <Route path="/Contacts" element={<Contacts token={token} />} />
          <Route path="/Hospital-Profile" element={<Profile />} />
          <Route path="/:id" element={<DocInfo />} />

          {/* Appointment procedures */}
          <Route
            path={"/Appointment"}
            element={<Appointment token={token} isPatient={isPatient} />}
          />
          <Route path="/Face-to-face/:id" element={<F2f token={token} />} />
          <Route path="/Online/:id" element={<Online token={token} />} />
          <Route path="/ChooseType/:id" element={<OnlineOrF2f />} />
          <Route
            path="/Online_Consultation_History"
            element={<OnlineConsultationHistory />}
          />
          {/* </Route> */}
        </Routes>
      </main>

      <footer className="sticky w-screen bottom-0 z-50">
        <Footer />
      </footer>
    </div>
  );
}

export default App;

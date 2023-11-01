import supabase from "./components/config/Supabase";
import { Routes, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import MissonVision from "./components/MissonVision";
import Profile from "./components/HospitalProfile";
import Feedback from "./components/Feedback";
import Sidebar from "./components/Sidebar";
import Status from "./components/patient/Appointment Process/Status";

//patient
import Online from "./components/patient/Appointment Process/OnlineConsult";
import Appointment from "./components/patient/Appointment Process/Appointment";
import DocInfo from "./components/Doctor read/DoctorInfo";
import OnlineOrF2f from "./components/patient/Appointment Process/ChooseType";
import F2f from "./components/patient/Appointment Process/Face2face";
import OnlineConsultationHistory from "./components/patient/Appointment Process/OnlineConsultationHistory";
import PatientDashboard from "./components/patient/Dashboard";
import OnlineDash from "./components/patient/OnlineDash";
import F2fDash from "./components/patient/F2fDash";

//Doctor
import DoctorConsultHistory from "./components/Higher user level/Doctor/DoctorConsulHistory";
import DocAppointments from "./components/Higher user level/Doctor/Doc_Appointments";

//admin
import EditDoctors from "./components/Higher user level/Admin/EditDoctors";
import AdminFeedback from "./components/Higher user level/Admin/feedback_Admin";
import AppointmentDetails from "./components/Higher user level/Admin/Confirmation of Appointments/AppointmentDetails";
import AppointConfirmation from "./components/Higher user level/Admin/Confirmation of Appointments/AppointmentConfirmation";

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
      localStorage.setItem("token", JSON.stringify(token));
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

  //*To show modal for updating profile picture
  const [isProfileOpen, setIsProfile] = useState(false);
  const openProfileUpload = () => setIsProfile(true);
  const closeProfileUpload = () => setIsProfile(false);

  //*Open and closing sidebar
  const [open, setOpen] = useState(false);
  const openSide = () => setOpen(true);
  const closeSide = () => setOpen(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      let data = JSON.parse(localStorage.getItem("token"));
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

          {/*patient's side */}
          <Route path="/Mission-and-Vision" element={<MissonVision />} />
          <Route path="/Feedback-Form" element={<Feedback token={token} />} />
          <Route path="/Contacts" element={<Contacts token={token} />} />
          <Route path="/Hospital-Profile" element={<Profile />} />

          {/* Appointment procedures */}
          <Route
            path={"/Appointment"}
            element={<Appointment token={token} isPatient={isPatient} />}
          />
          {token && (
            <>
              <Route
                path="/Dashboard"
                element={<PatientDashboard token={token} isAdmin={isAdmin} isDoctor={isDoctor} isPatient={isPatient} />}
              />
              {/* Doctor's side */}
              <Route
                path="/DoctorConsultHistory"
                element={<DoctorConsultHistory />}
              />
              <Route
                path="/Doctor/Appointments"
                element={<DocAppointments />}
              />
              {/*patient's side */}
              <Route path="/Face-to-face/:id" element={<F2f token={token} />} />
              <Route path="/Online/:id" element={<Online token={token} />} />
              <Route path="/ChooseType/:id" element={<OnlineOrF2f />} />
              <Route
                path="/Online_Consultation_History"
                element={<OnlineConsultationHistory />}
              />

              <Route
                path="/Appointment/Online"
                element={<OnlineDash token={token} isPatient={isPatient} />}
              />
              <Route
                path="/Appointment/F2f"
                element={<F2fDash token={token} isPatient={isPatient} />}
              />
              <Route
                path="/Appointment/Status"
                element={<Status token={token} />}
              />
              <Route path="/:id" element={<DocInfo />} />

              {/* Admin's side */}
              <Route
                path="/Appointment_Details/:id"
                element={<AppointmentDetails />}
              />
              <Route path="/User_feedbacks" element={<AdminFeedback />} />
              <Route path="/Edit_doctors" element={<EditDoctors />} />
              <Route
                path="/Confirm_Appointments"
                element={<AppointConfirmation token={token} />}
              />
            </>
          )}

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

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
//import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./components/config/Supabase";
import OnlineConsultationHistory from "./components/Appointment Process/OnlineConsultationHistory";

//import { AuthContext } from "./components/context/AuthContext";

function App() {
  //*For getting token of user
  const [token, setToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  // const [isPatient, setIsPatient] = useState(false);
  //*initiates after login
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));

      const fetchAdmin = async () => {
        const { data } = await supabase.from("profile").select("*").single();
        //*compare roles if matched
        if (data.role === "admin") {
          setIsAdmin(true);
        }
        if (data.role === "doctor") {
          setIsDoctor(true);
        }
        if (data.role === "patient") {
          setIsPatient(true);
        }
      };
      fetchAdmin();
    }
  }, [token]);

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
          token={token}
          setToken={setToken}
          isAdmin={isAdmin}
          isDoctor={isDoctor}
          isPatient={{isPatient}}
        />
      </header>
      <main className="flex-grow">
        <Routes>
          {/* Homepage */}
          <Route
            path="/"
            element={<Home token={token} isDoctor={isDoctor} />}
          />

          {/* Doctor's side */}
          <Route path="/Doctor" element={<Doctor />} />

          {/* Admin's side */}
          <Route path="/User_feedbacks" element={<AdminFeedback />} />
          <Route path="/Edit_doctors" element={<EditDoctors />} />
          <Route
            path="/Confirm_Appointments"
            element={<AppointConfirmation token={token} />}
          />
          <Route path="/Admin" element={<Admin />} />

          {/*patient's side */}
          <Route path="/Mission-and-Vision" element={<MissonVision />} />
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
          <Route path="/OnlineConsultationHistory" element={<OnlineConsultationHistory />} />
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

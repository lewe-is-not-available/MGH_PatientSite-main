import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Rooms from "./components/Rooms";
import Contacts from "./components/Contacts";
import Appointment from "./components/Appointment";
import MissonVision from "./components/MissonVision";
import Profile from "./components/HospitalProfile";
import Feedback from "./components/Feedback";
import DocInfo from "./components/DoctorInfo";
import OnlineOrF2f from "./components/Appointment Process/OnlineOrF2f";
import F2f from "./components/Appointment Process/Face2face"
import Online from "./components/Appointment Process/OnlineConsult"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <header className="sticky w-screen top-0 z-50">
          <Navbar />
        </header>
        <main className="flex-grow roll-in-left">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Rooms" element={<Rooms />} />
            <Route path="/Feedback-Form" element={<Feedback />} />
            <Route path="/Contacts" element={<Contacts />} />
            <Route path="/Appointment" element={<Appointment />} />
            <Route path="/Mission-and-Vision" element={<MissonVision />} />
            <Route path="/Hospital-Profile" element={<Profile />} />
            <Route path="/DoctorInfo" element={<DocInfo />} />
            <Route path="/:id" element={<DocInfo />} />
            <Route path="/ChooseType" element={<OnlineOrF2f />} />
            <Route path="/Face-to-face" element={<F2f />} />
            <Route path="/Online" element={<Online />} />
          </Routes>
        </main>

        <footer className="sticky w-screen bottom-0 z-50">
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default App;

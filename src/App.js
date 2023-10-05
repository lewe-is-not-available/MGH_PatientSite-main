import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Contacts from "./components/Contacts";
import Appointment from "./components/Appointment";
import MissonVision from "./components/MissonVision";
import Profile from "./components/HospitalProfile";
import Feedback from "./components/Feedback";
import DocInfo from "./components/DoctorInfo";
import OnlineOrF2f from "./components/Appointment Process/OnlineOrF2f";
import F2f from "./components/Appointment Process/Face2face";
import Online from "./components/Appointment Process/OnlineConsult";
import Admin from "./components/Higher user level/Admin";
import Doctor from "./components/Doctor";
//import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Login/register/Signup";
import { useEffect, useState } from "react";
import { AuthContext } from "./components/context/AuthContext";

function App() {
  //*For getting token of user
  const [token, setToken] = useState(false);

//   useEffect(() => {
//   const token = JSON.parse(localStorage.getItem("token"));
//   if (token) {
//     setToken(token);
//   }
// }, []);

  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));
  }
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky w-screen top-0 z-50">
        <Navbar token={token} setToken={setToken} />
      </header>
      <main className="flex-grow">
          <Routes>
            {/* public Routes */}
            <Route
              path="/"
              element={<Home token={token} setToken={setToken} />}
            />
            <Route path="/Feedback-Form" element={<Feedback />} />
            <Route path="/Contacts" element={<Contacts />} />
            <Route path="/Mission-and-Vision" element={<MissonVision />} />
            <Route path="/Hospital-Profile" element={<Profile />} />
            <Route path="/:id" element={<DocInfo />} />

            <Route path="/Signup" element={<Signup />} />

            <Route path="Admin" element={<Admin />} />
            <Route path="Doctor" element={<Doctor />} />
            {token ? (
              <Route path="/Appointment" element={<Appointment />} />
            ) : (
              ""
            )}
            <Route path="/Face-to-face" element={<F2f />} />
            <Route path="/Online" element={<Online />} />
            <Route path="/DoctorInfo" element={<DocInfo />} />
            <Route path="/ChooseType" element={<OnlineOrF2f />} />
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

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
import { useEffect, useState } from "react";
import supabase from "./components/config/Supabase";

//import { AuthContext } from "./components/context/AuthContext";

function App() {
  //*For getting token of user
  const [token, setToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
 // const [isPatient, setIsPatient] = useState(false);
  if (token) {
    sessionStorage.setItem("token", JSON.stringify(token));

 
    const fetchAdmin = async () => {
    const { data } = await supabase
      .from("profile")
      .select("*")
      .single();

    if(data.role === "admin"){
      setIsAdmin(true);
    }
  };
  fetchAdmin();

 
  }
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      let data = JSON.parse(sessionStorage.getItem("token"));
      setToken(data);
    }
  }, []);
  console.log(token);


  

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky w-screen top-0 z-50">
        <Navbar token={token} setToken={setToken} />
      </header>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home token={token}/>} />
          <Route path="/Mission-and-Vision" element={<MissonVision />} />
          <Route path="/Feedback-Form" element={<Feedback />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/Hospital-Profile" element={<Profile />} />
          <Route path="/:id" element={<DocInfo />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="Doctor" element={<Doctor />} />
          <Route path={"/Appointment"} element={<Appointment token={token} Admin={isAdmin}/>} />
          <Route path="/Face-to-face" element={<F2f />} />
          <Route path="/Online" element={<Online />} />
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

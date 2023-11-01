import React, { useEffect } from "react";
import supabase from "../../config/Supabase";
import { useNavigate, Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";


const Doc_Appointments = () => {
     // Aos useEffect
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  const navigate = useNavigate();

  const fetchDoctor = async () => {
    const { data } = await supabase.from("profile").select("*").single();

    //*prevent access from non-admin users
    if (data.role !== "doctor") {
      navigate("/");
    }
  };
  fetchDoctor();
  return (
    <div className="back h-screen text-center place-content-center">
        Appointments
  </div>
  )
}

export default Doc_Appointments
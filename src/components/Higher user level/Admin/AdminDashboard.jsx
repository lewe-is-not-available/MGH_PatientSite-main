import React, { useEffect } from "react";
import supabase from "../../config/Supabase";
import { useNavigate, Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";

const Admin = () => {
  // Aos useEffect
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  const navigate = useNavigate();

  const fetchAdmin = async () => {
    const { data } = await supabase.from("profile").select("*").single();

    //*prevent access from non-admin users
    if (data.role !== "admin") {
      navigate("/");
    }
  };
  fetchAdmin();
  return (
    <div className="text-center">
      {/* feautures */}
      <div className="flex justify-center mb-20">
        <div className="grid place-items-center grid-cols-3 gap-x-20 gap-y-16 w-full">
          {/* Online consult */}
          <div className="boxes" data-aos="fade-up">
            <Link to="/Appointment/Online" className="titleText">
              Online Consult
            </Link>
            <p className="text-sm">Book an appointment for online consult</p>
          </div>
          {/* Face to face consult */}
          <div className="boxes" data-aos="fade-up">
            <Link to="/Confirm_appointments" className="titleText">
                Confirm Appointments
            </Link>
            <p className="text-sm">
              Book an appointment for Face to face consult
            </p>
          </div>
          {/* Contact us */}
          <div className="boxes" data-aos="fade-up">
            <Link to="/Contacts" className="titleText">
              Contact Us!
            </Link>
            <p className="text-sm">Book an for online appointment</p>
          </div>
          {/* Feedback form */}
          <div className="boxes" data-aos="fade-up">
            <Link to="/Feedback-Form" className="titleText">
              Feedback form
            </Link>
            <p className="text-sm">Let us know what you think of our website</p>
          </div>
          {/* Consult history */}
          <div className="boxes" data-aos="fade-up">
            <Link to="/Online_Consultation_History" className="titleText">
              Consultation History
            </Link>
            <p className="text-sm">
              Have a look at your recent online consultations
            </p>
          </div>
          {/* Appointment status */}
          <div className="boxes" data-aos="fade-up">
            <Link to="/Appointment/Status" className="titleText">
              Appointment status
            </Link>
            <p className="text-sm">Keep track of your appointment status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

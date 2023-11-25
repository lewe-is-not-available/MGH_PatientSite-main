import React, { useState, useEffect } from "react";
import supabase from "../../config/Supabase";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";

const Admin = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  //books
  //*get patient appointments
  const [books, setBook] = useState([]);
  const [archive, setarchive] = useState([]);
  const [filt, setfilt] = useState([]);
  const [Loaded, setLoaded] = useState(true);
  const fetchBooks = async () => {
    setLoaded(false);
    const { data, error } = await supabase
      .from("Patient_Appointments")
      .select();
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    }

    if (data) {
      setLoaded(true);
      setfilt(data);
    }
  };

  //*Realtime data for bookings
  useEffect(() => {
    fetchBooks();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Patient_Appointments" },
        () => {
          fetchBooks();
        }
      )
      .subscribe();
  }, []);

  //*Get count of books
  useEffect(() => {
    if (filt) {
      const filtered = filt.filter((item) => {
        const conf = !item.status.includes("Confirmed");
        const comp = !item.status.includes("Completed");
        return conf && comp;
      });
      const filterArch = filt.filter((item) => {
        const conf = item.status.includes("Confirmed");
        const comp = item.status.includes("Completed");
        return conf || comp;
      });
      setBook(filtered);
      setarchive(filterArch);
      console.log(filterArch);
    }
  }, [filt]);
  console.log(archive);
  //Doctors
  //*Get Doctors
  const [doc, setDoc] = useState([]);
  const [DocLoaded, setDocLoaded] = useState(true);
  const fetchDoc = async () => {
    setDocLoaded(false);
    const { data, error } = await supabase.from("Dr_information").select();
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    }

    if (data) {
      setDocLoaded(true);
      setDoc(data);
    }
  };

  //*Realtime data for bookings
  useEffect(() => {
    fetchDoc();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Dr_information" },
        () => {
          fetchDoc();
        }
      )
      .subscribe();
  }, []);

  //Patients
  //*Get Patients
  const [patient, setpatient] = useState([]);
  const [Pfilt, setPfilt] = useState([]);
  const [patientLoaded, setpatientLoaded] = useState(true);
  const fetchPatients = async () => {
    setpatientLoaded(false);
    const { data, error } = await supabase.from("profile").select();
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    }

    if (data) {
      setpatientLoaded(true);
      setPfilt(data);
    }
  };

  //*Realtime data for bookings
  useEffect(() => {
    fetchPatients();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        () => {
          fetchPatients();
        }
      )
      .subscribe();
  }, []);

  //*Get count of patient account
  useEffect(() => {
    if (Pfilt) {
      const Pfiltered = Pfilt.filter((item) => {
        const pROlE = item.role.includes("patient");
        return pROlE;
      });
      setpatient(Pfiltered);
    }
  }, [Pfilt]);
  // const fetchAdmin = async () => {
  //   const { data } = await supabase.from("profile").select("*").single();

  //   //*prevent access from non-admin users
  //   if (data.role !== "admin") {
  //     navigate("/");
  //   }
  // };
  // fetchAdmin();
  return (
    <div className="text-center h-auto">
      {/* feautures */}
      <div className="flex justify-center mb-20">
        <div className="grid grid-cols-4 features gap-6 w-full">
          {/* Online consult */}
          <Link
            to="/Confirm_Appointments"
            className="Adminboxes"
            data-aos="fade-up"
          >
            <div className="AdmintitleText">Books: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">{books.length}</h1>
            </div>
            <p>Booked Appointments to confirm</p>
          </Link>
          {/* Face to face consult */}
          <Link to="/Edit_doctors" className="Adminboxes" data-aos="fade-up">
            <div className="AdmintitleText">Total doctors: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">{doc.length}</h1>
            </div>
            <p>Book an appointment for Face to face consult</p>
          </Link>
          {/* Contact us */}
          <Link to="/Edit_Patients" className="Adminboxes" data-aos="fade-up">
            <div className="AdmintitleText">Total Patients: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">{patient.length}</h1>
            </div>
            <p>Need to give us a message? Feel free to contact us.</p>
          </Link>
          {/* Feedback form */}
          <Link to="/Archive" className="Adminboxes " data-aos="fade-up">
            <div className="AdmintitleText">Total Archives: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">{archive.length}</h1>
            </div>
            <p>Let us know what you think of our website</p>
          </Link>

          {/* Appointment status */}

          <Link
            to="/Appointment/Status"
            className="abs bg-white rounded-md col-span-3"
            data-aos="fade-up"
          >
            <p>Keep track of your appointment status</p>
          </Link>
          <Link to="/" className="Adminboxes" data-aos="fade-up">
            <div className="AdmintitleText">Messages: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">{archive.length}</h1>
            </div>
            <p>Have a look at your recent online consultations</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;

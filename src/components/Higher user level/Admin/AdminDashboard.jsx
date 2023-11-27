import React, { useState, useEffect } from "react";
import supabase from "../../config/Supabase";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";
import { tailspin } from "ldrs";

tailspin.register();

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
      .from("patient_Appointments")
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

  //*Get count of books
  useEffect(() => {
    if (filt) {
      const filtered = filt.filter((item) => {
        const conf = !item.status.includes("Confirmed");
        const comp = !item.status.includes("Completed");
        return conf && comp;
      });
      setBook(filtered);
    }
    if (books) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [filt, setBook]);

  useEffect(() => {
    const filterArch = filt.filter((item) => {
      const conf = item.status.includes("Confirmed");
      const comp = item.status.includes("Completed");
      return conf || comp;
    });
    setarchive(filterArch);
    if (books) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [filt, setarchive]);
  console.log(archive);

  //*Realtime data for bookings
  useEffect(() => {
    fetchBooks();
    fetchDoc();
    fetchPatients();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patient_Appointments" },
        () => {
          fetchBooks();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dr_information" },
        (payload) => {
          fetchDoc();
          console.log(payload);
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        () => {
          fetchPatients();
        }
      )
      .subscribe();
  }, []);

  //Doctors
  //*Get Doctors
  const [doc, setDoc] = useState([]);
  const [DocLoaded, setDocLoaded] = useState(true);
  const fetchDoc = async () => {
    setDocLoaded(false);
    const { data, error } = await supabase.from("dr_information").select();
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

  // //*Realtime data for doctors
  // useEffect(() => {
  //   fetchDoc();
  //   supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "dr_information" },
  //       (payload) => {
  //         fetchDoc();
  //         console.log(payload);
  //       }
  //     )
  //     .subscribe();
  // }, []);

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
              <h1 className="text-5xl font-semibold">
                {Loaded ? (
                  books.length
                ) : (
                  <l-tailspin
                    size="55"
                    stroke="4"
                    speed="0.9"
                    color="black"
                  ></l-tailspin>
                )}
              </h1>
            </div>
            <p>Booked Appointments to confirm</p>
          </Link>
          {/* Face to face consult */}
          <Link to="/Edit_doctors" className="Adminboxes" data-aos="fade-up">
            <div className="AdmintitleText">Total doctors: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">
                {DocLoaded ? (
                  doc.length
                ) : (
                  <l-tailspin
                    size="55"
                    stroke="4"
                    speed="0.9"
                    color="black"
                  ></l-tailspin>
                )}
              </h1>
            </div>
            <p>Book an appointment for Face to face consult</p>
          </Link>
          {/* Contact us */}
          <Link to="/Edit_Patients" className="Adminboxes" data-aos="fade-up">
            <div className="AdmintitleText">Total Patients: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">
                {patientLoaded ? (
                  patient.length
                ) : (
                  <l-tailspin
                    size="55"
                    stroke="4"
                    speed="0.9"
                    color="black"
                  ></l-tailspin>
                )}
              </h1>
            </div>
            <p>Need to give us a message? Feel free to contact us.</p>
          </Link>
          {/* Feedback form */}
          <Link to="/Archive" className="Adminboxes " data-aos="fade-up">
            <div className="AdmintitleText">Total Archives: </div>
            <div className="w-full rounded-xl mb-4">
              <h1 className="text-5xl font-semibold">
                {Loaded ? (
                  archive.length
                ) : (
                  <l-tailspin
                    size="55"
                    stroke="4"
                    speed="0.9"
                    color="black"
                  ></l-tailspin>
                )}
              </h1>
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

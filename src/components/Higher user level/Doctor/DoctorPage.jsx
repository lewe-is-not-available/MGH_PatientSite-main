import React, { useState, useEffect } from "react";
import supabase from "../../config/Supabase";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { toast } from "react-toastify";
import { tailspin } from "ldrs";
import moment from "moment";

const Doc_Dash = ({ user, token }) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const fullName =
    user.first_name +
    " " +
    (user.middle_name ? user.middle_name + " " : "") +
    user.last_name;
  // console.log(user);
  const [DOC, setDOC] = useState();
  const [doctor, setdoctor] = useState([]);
  async function fetchDoctor() {
    const { data: doc, error: docErr } = await supabase
      .from("profile")
      .select()
      .eq("id", user.id)
      .single();
    try {
      if (docErr) throw docErr;
      else {
        const { data: docData } = await supabase
          .from("dr_information")
          .select()
          .eq("email", doc.email)
          .single();
        setDOC(docData.id);
        setdoctor(docData);
      }
    } catch (error) {
      console.log(docErr);
    }
  }
  //*get patient appointments
  const [books, setBook] = useState([]);
  const [archive, setarchive] = useState([]);
  const [filt, setfilt] = useState([]);
  const [Loaded, setLoaded] = useState(true);
  const fetchBooks = async () => {
    setLoaded(false);
    const { data, error } = await supabase
      .from("patient_Appointments")
      .select()
      .eq("doc_id", DOC);
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      setLoaded(true);
      setfilt(data);
    }
  };
  useEffect(() => {
    //*Realtime data.
    fetchBooks();
    fetchDoctor();
    const realtime = supabase
      .channel("room2")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patient_Appointments" },
        (payload) => {
          fetchBooks(payload.new.data);
        }
      )
      .subscribe();

    return () => {
      supabase.getChannels(realtime);
    };
  }, [DOC]);

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

  const dateObjects = books.map((dateString) => new Date(dateString.date));
  const docSched =
    doctor.schedule && doctor.schedule.map((item) => item.startTime);
  const mostRecentDate = new Date(Math.min(...dateObjects));
  const [AppoinNow, setAppoinNow] = useState(false);
  useEffect(() => {
    if (
      moment(mostRecentDate).format("ll") === moment(new Date()).format("ll")
    ) {
      if (
        moment(new Date(`2000-01-01T${docSched && docSched[0]}`)).format(
          "LT"
        ) >= moment(new Date()).format("LT")
      )
        setAppoinNow(true);
    }
  }, []);
  return (
    <div className="text-center h-auto">
      {/* feautures */}
      <div className="flex justify-center mb-20">
        <div className="grid grid-cols-2 features gap-6 w-full">
          <Link
            to="/Confirm_Appointments"
            className="Docboxes"
            data-aos="fade-up"
          >
            <div className="AdmintitleText">Incoming Appointments: </div>
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
          <Link to="/Archive" className="Docboxes " data-aos="fade-up">
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
            <p>Completed Consultations</p>
          </Link>
          <div className="col-span-2 gap-x-5">
            <Link
              to="/Archive"
              className="abs py-4 px-6 w-full cursor-pointer border-[1px] text-sm 
  text-left flex flex-col items-start bg-white rounded-xl transition duration-200 
  hover:shadow-none "
              data-aos="fade-up"
            >
              {AppoinNow ? (
                <>
                  <div className="AdmintitleText">
                    Your have an ongoing consultation{" "}
                  </div>
                  <div className="w-full rounded-xl mb-4">
                    <h1 className="text-3xl font-semibold">
                      {Loaded ? (
                        <>
                          {moment(mostRecentDate).format("LL")} at{" "}
                          {moment(
                            new Date(`2000-01-01T${docSched && docSched[0]}`)
                          ).format("LT")}
                        </>
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
                </>
              ) : (
                <>
                  <div className="AdmintitleText">Next Appointment: </div>
                  <div className="w-full rounded-xl mb-4">
                    <h1 className="text-3xl font-semibold">
                      {Loaded ? (
                        <>
                          {moment(mostRecentDate).format("LL")} at{" "}
                          {moment(
                            new Date(`2000-01-01T${docSched && docSched[0]}`)
                          ).format("LT")}
                        </>
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
                </>
              )}

              <p>Completed Consultations</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doc_Dash;

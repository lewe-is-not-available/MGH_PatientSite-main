import React, { useState, useEffect } from "react";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import Online from "./Online";
import F2f from "./F2f";
import { useNavigate } from "react-router-dom";

const AppointmentConfirmation = () => {
  //TODO: REDESIGN TABLE INTO BULK WITH PROFILE PIC
  //TODO: add draggable function for table head
  const navigate = useNavigate();

  //*prevent access from non-admin users
  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.from("profile").select("*").single();

      if (data.role !== "admin") {
        navigate("/Dashboard");
      }
    };
    fetchAdmin();
  }, []);

  //*For Online Consult lists
  const [books, setBook] = useState([]);
  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("Patient_Appointments")
      .select("*");
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      setBook(data);
    }
  };
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

  return (
    <div className="back h-screen">
      <div className="overflow-x-auto flex flex-col content-center">
        <p className="text-4xl font-semibold text-[#315E30] pl-10 py-6 w-full">
          Online Consults
        </p>
        <table className="w-full text-sm text-left bg-opacity-60 text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 bg-slate-100 uppercase">
            {/* <tr className="text-base text-center text-[#315E30]">
              <th scope="col" className="px-6 py-6">
                Patient's Name
              </th>
              <th scope="col" className="px-6 py-3 ">
                Doctor's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Booked at
              </th>
              <th scope="col" className="px-6 py-3 ">
                Appointment date
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Time
              </th>
              <th scope="col" className="px-6 py-3">
                Reason
              </th>
              <th scope="col" className="px-6 py-3">
                Booked by someone
              </th>
              <th scope="col" className="px-6 py-3">
                Medical History
              </th>
              <th scope="col" className="px-6 py-3">
                view and confirm
              </th>
            </tr> */}
            <tr>
              
            </tr>
          </thead>
          <tbody>
            {books &&
              books
                .filter((data) => data.type && data.type.includes("ol"))
                .map((ol) => <Online key={ol.online_id} ol={ol} />)}
          </tbody>
        </table>
      </div>
      <div className="overflow-x-auto flex flex-col content-center">
        <p className="text-4xl font-semibold text-[#315E30] pl-10 py-6 bg- w-full">
          Face to face Consults
        </p>
        <table className="w-full text-sm text-left bg-opacity-60 table-auto text-gray-500">
          <thead className="text-xs text-center text-gray-700 uppercase bg-slate-100">
            <tr className="text-base text-[#315E30]">
              <th scope="col" className="px-6 py-6">
                Patient's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Doctor's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Booked at
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment date
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Time
              </th>
              <th scope="col" className="px-6 py-3">
                Reason
              </th>
              <th scope="col" className="px-6 py-3">
                Booked by someone
              </th>
              <th scope="col" className="px-6 py-3">
                Medical History
              </th>
              <th scope="col" className="px-6 py-3">
                View and Confirm
              </th>
            </tr>
          </thead>
          <tbody>
            {books &&
              books
                .filter(
                  (data) =>
                    data.type &&
                    data.type.includes("f2f") &&
                    data.status.includes("pending")
                )
                .map((ol) => <F2f key={ol.online_id} f2={ol} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;

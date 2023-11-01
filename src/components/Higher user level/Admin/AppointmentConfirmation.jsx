import React, { useState, useEffect } from "react";
import supabase from "../../config/Supabase";
import { toast } from "react-toastify";
import Online from "./Online";
import F2f from "./F2f";
import { useNavigate } from "react-router-dom";

const AppointmentConfirmation = ({ setMedModal, MedModal }) => {
  //TODO: add draggable function for table head
  const navigate = useNavigate();

  //*prevent access from non-admin users
  const fetchAdmin = async () => {
    const { data } = await supabase.from("profile").select("*").single();

    if (data.role !== "admin") {
      navigate("/Patient/Dashboard");
    }
  };
  fetchAdmin();

  //*For Online Consult lists
  const [online, setOnline] = useState("");
  const fetchOnline = async () => {
    const { data, error } = await supabase
      .from("Patient_Appointments")
      .select("*");
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      if (JSON.stringify(data) !== JSON.stringify(online)) {
        setOnline(data);
      }
    }
  };
  useEffect(() => {
    fetchOnline();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Patient_Appointments" },
        () => {
          fetchOnline();
        }
      )
      .subscribe();
  }, []);

  //*For Face to face lists
  const [F2F, setF2f] = useState("");
  const fetchF2f = async () => {
    const { data, error } = await supabase
      .from("F2f_Appointments")
      .select("*")
      .eq("type");
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      setF2f(data);
    }
  };
  useEffect(() => {
    fetchF2f();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "F2f_Appointments" },
        () => {
          fetchF2f();
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
          <thead className="text-xs text-gray-700 bg-slate-100 uppercase bg-gray-50">
            <tr className="text-base text-center text-[#315E30]">
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
            </tr>
          </thead>
          <tbody>
            {online &&
              online.map((ol) =>
                ol.online_id ? <Online key={ol.online_id} ol={ol} /> : null
              )}
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
              <th scope="col" className="px-6 py-3 ">
                Appointment date
              </th>
              <th scope="col" className="px-6 py-3">
                Appointment Time
              </th>
              <th scope="col" className="px-6 py-3 ">
                Reason
              </th>
              <th scope="col" className="px-6 py-3">
                Booked by someone
              </th>
              <th scope="col" className="px-6 py-3 ]">
                Medical History
              </th>
              <th scope="col" className="px-6 py-3">
                View and Confirm
              </th>
            </tr>
          </thead>
          <tbody>
            {F2F &&
              F2F.map((f2) =>
                f2.f2f_id ? (
                  <F2f
                    key={f2.f2f_id}
                    f2={f2}
                    setMedModal={setMedModal}
                    MedModal={MedModal}
                  />
                ) : null
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;

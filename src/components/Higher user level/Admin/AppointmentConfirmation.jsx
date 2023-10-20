import React, { useState, useEffect } from "react";
import supabase from "../../config/Supabase";
import { toast } from "react-toastify";
import Online from "./Online";
import F2f from "./F2f";

const AppointmentConfirmation = () => {
  //*For Online Consult lists
  const [online, setOnline] = useState("");
  useEffect(() => {
    const fetchOnline = async () => {
      const { data, error } = await supabase
        .from("Online Appointments")
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

    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Online Appointments" },
        (payload) => {
          console.log("Change received!", payload);
          fetchOnline();
        }
      )
      .subscribe();
    fetchOnline();
  }, [online]);

  //*For Face to face lists
  const [F2F, setF2f] = useState("");
  useEffect(() => {
    const fetchF2f = async () => {
      const { data, error } = await supabase
        .from("F2f Appointments")
        .select("*");
      if (error) {
        toast.error(error, {
          toastId: "dataError",
        });
        console.error("Failed to fetch", error.message);
      } else {
        setF2f(data);
      }
    };
    fetchF2f();
  }, []);
  return (
    <div className="back">
      <div className="overflow-x-auto flex flex-col content-center">
        <p className="text-4xl font-semibold text-[#315E30] pl-10 py-6 bg-slate-200 w-full">
          Online Consults
        </p>
        <table className="w-full text-sm text-left bg-opacity-60 text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="text-base text-[#315E30]">
              <th scope="col" className="px-6 py-3">
                Patient's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Doctor's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Patient's email
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
                Existing
              </th>
              <th scope="col" className="px-6 py-3">
                Confirm
              </th>
            </tr>
          </thead>
          <tbody>{online && online.map((ol) => ol.online_id ? <Online key={ol.online_id} ol={ol} /> : null )}</tbody>
        </table>
      </div>
      <div className="overflow-x-auto flex flex-col content-center">
        <p className="text-4xl font-semibold text-[#315E30] pl-10 py-6 bg-slate-200 w-full">
          Face to face Consults
        </p>
        <table className="w-full text-sm text-left bg-opacity-60 text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr className="text-base text-[#315E30]">
              <th scope="col" className="px-6 py-3">
                Patient's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Doctor's Name
              </th>
              <th scope="col" className="px-6 py-3">
                Patient's email
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
                Existing
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>{F2F && F2F.map((f2) => (f2.f2f_id ? <F2f key={f2.id} f2={f2} /> : null))}</tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;

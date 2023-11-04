import React, { useState, useEffect } from "react";
import Medical from "./Medical";
import { Link } from "react-router-dom";
import SomeonDetails from "./SomeoneDetails";
import F2f from "./F2f";

const Online = ({ ol }) => {
  const date = new Date(ol.created_at);
  function formateDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
  }
  const CreatedAt = formateDateTime(date);
  //*if booked by someone set viewable
  const [isSomeone, setSomeone] = useState(false);
  const [SomeoneModal, setSomeoneModal] = useState(null);
  const handleSomeoneData = (e) => {
    e.preventDefault();
    setSomeoneModal(true);
  };
  useEffect(() => {
    if (ol.someone === "No") {
      setSomeone(false);
    } else {
      setSomeone(true);
    }
  }, [ol, setSomeone, isSomeone]);
  //*To open and pass medical history modal
  const [MedModal, setMedModal] = useState(false);

  const [isMedical, setMedical] = useState(null);

  const handleMedData = (e) => {
    e.preventDefault();
    setMedModal(true);
  };
  let med = ol.medicalhistory;

  useEffect(() => {
    if (med.length === 0) {
      setMedical(false);
    } else {
      setMedical(true);
    }
  }, [ol, setMedical, isMedical, med.length]);
  return (
    <tr
      key={ol.online_id}
      className="text-base group/tr text-gray-900 bg-white transition duration-75 ease-in text-center hover:bg-slate-200"
    >
      <th scope="row" className="px-6 py-4 font-medium  whitespace-nowrap">
        
        {ol.fname} {ol.lname}
      </th>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {ol.docname}
      </td>
      <td className="px-6 py-4">{CreatedAt}</td>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {ol.date}
      </td>
      <td className="px-6 py-4">{ol.time}</td>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {ol.reason}
      </td>
      <td className="px-6 py-4">
        {" "}
        {isSomeone ? (
          <>
            {SomeoneModal && (
              <SomeonDetails
                isSomeone={isSomeone}
                setSomeone={setSomeoneModal}
                id={ol.book_id}
              />
            )}
            <button
              onClick={(e) => {
                handleSomeoneData(e);
              }}
              className="bg-[#66b966] hover:bg-[#0b580b] transition duration-100
               text-white px-3 rounded-full"
            >
              check details
            </button>
          </>
        ) : (
          <p className="text-[#198119]">No</p>
        )}
      </td>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {isMedical ? (
          <>
            {MedModal && (
              <Medical
                MedModal={MedModal}
                id={ol.book_id}
                setMedModal={setMedModal}
              />
            )}
            <button
              onClick={(e) => {
                handleMedData(e);
              }}
              className="bg-[#50924c] hover:bg-[#0b580b] transition duration-100
               text-white px-3 rounded-full"
            >
              check details
            </button>
          </>
        ) : (
          <p className="text-[#198119]">None</p>
        )}
      </td>
      <td className="px-6 py-4 w-[15%] text-white">
        <Link
          to={"/Appointment_Details/" + ol.book_id}
          className="bg-[#66b966] hover:bg-[#476545] py-1 transition duration-100
          text-white px-3 rounded-full"
        >
          view appointment details
        </Link>
      </td>
    </tr>
  );
};

export default Online;

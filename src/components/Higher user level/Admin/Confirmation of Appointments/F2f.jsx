import React, { useState, useEffect } from "react";
import Medical from "./Medical";
import { Link } from "react-router-dom";
import SomeonDetails from "./SomeoneDetails";

const F2f = ({ f2 }) => {
  const date = new Date(f2.created_at);

  function formateDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
  }
  //*if booked by someone set viewable
  const [isSomeone, setSomeone] = useState(null);
  const [SomeoneModal, setSomeoneModal] = useState(false);
  const handleSomeoneData = (e) => {
    e.preventDefault();
    setSomeoneModal(true);
  };

  useEffect(() => {
    if (f2.someone === "No") {
      setSomeone(false);
    } else {
      setSomeone(true);
    }
  }, [f2, setSomeone, isSomeone]);
  //*To open and pass medical history modal
  const [MedModal, setMedModal] = useState(false);

  const [isMedical, setMedical] = useState(null);
  //const [medData, setMedData] = useState(null);

  const handleMedData = (e) => {
    e.preventDefault();
    setMedModal(true);
  };
  let med = f2.medicalhistory;
  useEffect(() => {
    if (med.length === 0) {
      setMedical(false);
    } else {
      setMedical(true);
    }
  }, [f2, setMedical, isMedical, med.length]);
  return (
    //TODO: OVERFLOW
    <tr
      key={f2.f2f_id}
      className="text-base group/tr text-gray-900 bg-white transition duration-75 ease-in text-center hover:bg-slate-200 "
    >
      <th className="px-6 py-4 font-medium hover:  whitespace-nowrap">
        {f2.fname} {f2.lname}
      </th>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {f2.docname}
      </td>
      <td className="px-6 py-4">{formateDateTime(date)}</td>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {f2.date}
      </td>
      <td className="px-6 py-4">{f2.time}</td>
      <td className="px-6 py-4 bg-slate-100 group-hover/tr:bg-slate-300 transition duration-75 ease-in">
        {f2.reason}
      </td>
      <td className="px-6 py-4">
        {" "}
        {isSomeone ? (
          <>
            {SomeoneModal && (
              <SomeonDetails
                isSomeone={isSomeone}
                setSomeone={setSomeoneModal}
                id={f2.f2f_id}
              />
            )}
            <button
              onClick={(e) => {
                handleSomeoneData(e);
              }}
              className="bg-[#54a350] hover:bg-[#0b580b] transition duration-100
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
                id={f2.book_id}
                setMedModal={setMedModal}
              />
            )}
            <button
              onClick={(e) => handleMedData(e)}
              className="bg-[#66b966] hover:bg-[#0b580b] transition duration-100
               text-white px-3 rounded-full"
            >
              check details
            </button>
          </>
        ) : (
          <p className="text-[#198119]">None</p>
        )}
      </td>
      <td className="px-6 py-4 w-[15%] text-white ">
        <Link
          to={"/Appointment_Details/" + f2.book_id}
          className="bg-[#54a350] hover:bg-[#476545] py-1 transition duration-100
          text-white px-3 rounded-full"
        >
          view appointment details
        </Link>
      </td>
    </tr>
  );
};

export default F2f;

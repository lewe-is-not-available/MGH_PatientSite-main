import React, { useState, useEffect } from "react";
import Medical from "./Medical";

const F2f = ({ f2 }) => {
  const [MedModal, setMedModal] = useState(false);
  const [isMedical, setMedical] = useState(null);
  const [medData, setMedData] = useState(null);

  const handleMedData = (ItemData) => {
    setMedData(ItemData);
    setMedModal(true);
  };
  let med = f2.medicalhistory;

  useEffect(() => {
    if (med.length === 0) {
      setMedical(false);
    } else {
      setMedical(true);
    }
  }, [f2, setMedical, isMedical]);
  return (
    //TODO: OVERFLOW
    <tr
      key={f2.f2f_id}
      className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-center "
    >
      <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {f2.fname} {f2.lname}
      </th>
      <td className="px-6 py-4">{f2.docname}</td>
      <td className="px-6 py-4">{f2.email}</td>
      <td className="px-6 py-4">{f2.number}</td>
      <td className="px-6 py-4">{f2.date}</td>
      <td className="px-6 py-4">{f2.time}</td>
      <td className="px-6 py-4">{f2.reason}</td>
      <td className="px-6 py-4">
        {isMedical ? (
          <>
            {MedModal && (
              <Medical
                MedModal={MedModal}
                id={medData}
                setMedModal={setMedModal}
              />
            )}
            <button
              onClick={() => handleMedData(f2.f2f_id)}
              className="bg-[#66b966] hover:bg-[#0b580b] transition duration-100
               text-white px-3 rounded-full"
            >
              view
            </button>
          </>
        ) : (
          <p className="text-[#198119]">None</p>
        )}
      </td>
      <td className="px-6 py-4 text-white">
        <button className="px-3 rounded-md bg-green-500 mr-2">accept</button>
        <button className="px-3 rounded-md bg-red-500">reject</button>
      </td>
    </tr>
  );
};

export default F2f;

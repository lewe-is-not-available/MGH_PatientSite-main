import React from "react";
import supabaseAdmin from "../../config/supabaseAdmin";

const patientMap = ({ data, setPatientId, PatientId }) => {
  setPatientId(data.id);
  const deletUser = async () => {
    await supabaseAdmin.auth.admin.deleteUser(PatientId);
  };
  return (
    <div>
      <div>
        {data.email}
        <br /> {data.id}
        <br />
        <span className="px-2 bg-red-300 rounded-full">{data.role}</span>
        <button onClick={deletUser}>delete</button>
      </div>
    </div>
  );
};

export default patientMap;

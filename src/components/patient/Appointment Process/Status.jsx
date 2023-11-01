import React, { useEffect, useState } from "react";
import supabase from "../../config/Supabase";

const Status = ({ token }) => {
  console.log(token.user.id);
  //*fetch appointment data
  const [data, setData] = useState();
  const id = token.user.id;
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("Patient_Appointments")
      .select("*")
      .eq("user_id", id);
    if (error) {
      console.error("Failed to fetch", error.message);
    }
    setData(data);
  };
  useEffect(() => {
    fetchData();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Patient_Appointments" },
        () => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  //*convert date
  function formateDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
  }
  return (
    <div className="back h-screen w-full flex place-content-center">
      <div className="abs absolute mt-10 rounded-lg bg-white p-10">
        {data &&
          data.map((stat) => (
            <p key={stat.id} className="flex flex-col mb-3 bg-slate-200 p-3">
              {stat.fname +" "+ stat.lname}
              <br />
              {formateDateTime(new Date(stat.created_at))}
              <br />
              {stat.status}
              <br />
              {stat.type}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Status;

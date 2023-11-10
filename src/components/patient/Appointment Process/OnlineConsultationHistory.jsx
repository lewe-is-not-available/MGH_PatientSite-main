import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "../../config/Supabase";

const OnlineConsultationHistory = ({user}) => {
  console.log(user.id)
  const [books, setBook] = useState([]);
  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("Patient_Appointments")
      .select("*")
      .eq("user_id", user.id);
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
    <div className="back h-screen w-full flex place-content-center">
      <div className="abs absolute mt-10 rounded-lg bg-white p-10">
        {books &&
          books
            .filter((item) => item.status && item.status.includes("Completed"))
            .map((data) => (
              <div>
                {data.fname}
                {data.lname} <br />{" "}
                {data.docname}<br />{" "}
                Someone? {data.someone}<br />{" "}
                <span className="px-2 bg-red-300 rounded-full">
                  {data.status}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default OnlineConsultationHistory
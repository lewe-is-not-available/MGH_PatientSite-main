import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "../../config/Supabase";

const Archive = () => {
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
    <div className="back h-screen w-full flex place-content-center">
      <div className="abs absolute mt-10 rounded-lg bg-white p-10">
        {books &&
          books
            .filter((item) => item.status && item.status.includes("Confirmed"))
            .map((data) => (
              <div>
                {data.fname}
                {data.lname} <br />{" "}
                <span className="px-2 bg-red-300 rounded-full">
                  {data.status}
                </span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Archive;

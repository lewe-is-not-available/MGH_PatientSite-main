import React, { useEffect, useState } from "react";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import StatusPaginated from "./StatusPaginated";

const Status = ({ user }) => {
  //!FIX reloading problem of data
  const [books, setBook] = useState([]);
  const fetchBooks = async () => {
    if (user) {
      const { data, error } = await supabase
        .from("Patient_Appointments")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        toast.error(error, {
          toastId: "dataError",
        });
        console.error("Failed to fetch", error.message);
      }
      if (data) {
        setBook(data);
      }
    }
  };
  //*images function
  async function getImages(id, setimgName, setImgEmpty) {
    const { data, error } = await supabase.storage
      .from("images")
      .list(id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (data[0]) {
      setImgEmpty(true);
      setimgName(data[0].name);
    }

    if (error) {
      setImgEmpty(false);
      console.log(error);
    }
  }
  const [Loaded, setLoaded] = useState(true);

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
      <div className="mt-10 rounded-lg w-[60%] p-10">
        <div>
          <StatusPaginated
            books={books}
            setLoaded={setLoaded}
            Loaded={Loaded}
            user={user}
            getImages={getImages}
          />
        </div>
      </div>
    </div>
  );
};

export default Status;

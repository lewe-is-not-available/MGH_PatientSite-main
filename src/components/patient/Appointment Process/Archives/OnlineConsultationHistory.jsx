import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "../../../config/Supabase";
import ArchivePaginated from "./ArchivePaginated";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import { BsSearch } from "react-icons/bs";
import { MagnifyingGlass } from "react-loader-spinner";

const OnlineConsultationHistory = ({ user }) => {
  //*images function
  const id = user.id;
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  useEffect(() => {
    if (user.email) {
      async function getImages() {
        const { data, error } = await supabase.storage
          .from("images")
          .list(user.email + "/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (data[1]) {
          setImgEmpty(true);
          setimgName(data[1].name);
        }

        if (error) {
          setImgEmpty(false);
          console.log(error);
        }
      }
      getImages();
    }
  }, [user, setimgName, setImgEmpty]);

  const [filt, setfilt] = useState([]);
  const [Loaded, setLoaded] = useState(true);

  const fetchBooks = async () => {
    setLoaded(false);
    if (user.email) {
      const { data, error } = await supabase
        .from("Patient_Appointments")
        .select("*")
        .eq("email", user.email);

      if (error) {
        toast.error(error, {
          toastId: "dataError",
        });
        console.error("Failed to fetch", error);
      }
      if (data) {
        setLoaded(true);
        setfilt(data);
      }
    }
  };
  //*REALTIME FUNCTION
  useEffect(() => {
    fetchBooks(user.email);
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
  }, [user.id]);
  return (
    <div className="back h-full flex justify-center">
      <div className="w-[70%]">
        <div className="flex justify-center mt-16">
          <div
            className="w-full h-auto min-h-screen text-sm flex mt-3 mb-10 flex-wrap justify-between
           rounded-lg text-gray-500 dark:text-gray-400"
          >
            <ArchivePaginated
              imgName={imgName}
              books={filt}
              setLoaded={setLoaded}
              Loaded={Loaded}
              user={user}
              isImgEmpty={isImgEmpty}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnlineConsultationHistory;

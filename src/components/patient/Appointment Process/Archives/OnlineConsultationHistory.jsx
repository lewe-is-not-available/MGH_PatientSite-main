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
          .list(user.email + "/profile/", {
            limit: 10,
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
      getImages();
    }
  }, [user, setimgName, setImgEmpty]);

  const [filt, setfilt] = useState([]);
  const [Book, setBook] = useState([]);
  const [Loaded, setLoaded] = useState(true);
  console.log(filt)
  const fetchBooks = async () => {
    setLoaded(false);
    if (user.email) {
      const { data, error } = await supabase
        .from("patient_Appointments")
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

  useEffect(() => {
    if(filt){
      const filtered = filt.filter((item) => {
        const stat = item.status.includes("Completed");
        return stat;
      });
      setBook(filtered)
    }
  }, [filt]);

  //*REALTIME FUNCTION
  useEffect(() => {
    fetchBooks();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "patient_Appointments" },
        () => {
          fetchBooks();
        }
      )
      .subscribe();
  }, []);
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
              books={Book}
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

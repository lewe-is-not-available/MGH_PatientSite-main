import supabase from "./config/Supabase";
import "aos/dist/aos.css";
import Aos from "aos";
import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const DoctorScheds = () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const [Mon, setMon] = useState("");
  const [Tue, setTue] = useState("");
  const [Wed, setWed] = useState("");
  const [Thu, setThu] = useState("");
  const [Fri, setFri] = useState("");

  useEffect(() => {
    const fetchSched = async () => {
      const { data, error } = await supabase
        .from("Schedule")
        .select()
        .eq("Dr_id", id)
        .single();

      if (error) {
        console.log(error);
      }
      if (data) {
        setMon(data.Monday);
        setTue(data.Tuesday);
        setWed(data.Wednesday);
        setThu(data.Thursday);
        setFri(data.Friday);
      }
    };
    fetchSched();
  }, [id, navigate]);
  return (
    <div className="text-4xl font-serif text-[#315E30] space-y-14">
      {Mon && (
        <p className="flex justify-between ml-0 border-b-4 border-y-black mx-2">
          <span className=" ml-24"> Monday:</span>{" "}
          <div className="mr-48 mt-1">{Mon}</div>
        </p>
      )} {Tue && (
        <p className="flex justify-between ml-0 border-b-4 border-y-black mx-2">
          <span className=" ml-24"> Tuesday:</span>{" "}
          <div className="mr-48 mt-1">{Tue}</div>
        </p>
      )}
       {Wed && (
        <p className="flex justify-between ml-0 border-b-4 border-y-black mx-2">
          <span className=" ml-24"> Wednesday:</span>{" "}
          <div className="mr-48 mt-1">{Wed}</div>
        </p>
      )}
       {Thu && (
        <p className="flex justify-between ml-0 border-b-4 border-y-black mx-2">
          <span className=" ml-24"> Thursday:</span>{" "}
          <div className="mr-48 mt-1">{Thu}</div>
        </p>
      )}
         {Fri && (
        <p className="flex justify-between ml-0 border-b-4 border-y-black mx-2">
          <span className=" ml-24"> Friday:</span>{" "}
          <div className="mr-48 mt-1">{Fri}</div>
        </p>
      )}
      

    </div>
  );
};

export default DoctorScheds;

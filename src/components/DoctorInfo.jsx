import React, { useEffect, useState } from "react";
import doc from "./images/doc.jpg";
import supabase from "./config/Supabase";
import Aos from "aos";
import 'aos/dist/aos.css';
import { Link, useParams, useNavigate } from "react-router-dom";
import { MdSchedule } from "react-icons/md";
import DoctorScheds from "./DoctorScheds";

const DoctorInfo = () => {
  useEffect(() => {
    Aos.init({duration: 1000});
  }, [])
  
  const { id } = useParams();
  const navigate = useNavigate();

  const [Name, setName] = useState("");
  const [Special, setSpecial] = useState("");
  const [Sub, setSub] = useState("");
  const [Hmo, setHmo] = useState("");
  const [Honor, setHonor] = useState("");

  useEffect(() => {
    
    const fetchDoctor = async () => {
      const { data, error } = await supabase
        .from("Dr information")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/", { replace: true });
      }
      if (data) {
        setName(data.Name);
        setSpecial(data.specialization);
        setSub(data.SubSpecial);
        setHmo(data.Hmo);
        setHonor(data.Honorific);
      }
    };
    fetchDoctor();
  }, [id, navigate]);

  return (
    <div className="back p-24 flex justify-evenly space-x-14">
      <img src={doc} alt="" className="w-72 h-full rounded-3xl" />

      <div className="det bg-white p-20 pb-14 w-[70%] h-full text-4xl">
        <h1 className="tracking-widest text-[#315E30] text-5xl font-bold">
          {" "}
          {Honor} {Name}
        </h1>
        <div class=" mb-10 border-b-4  border-y-[#315E30] mx-2"></div>
        {/* main details */}
        <div className="grid grid-cols-2">
          <div className="space-y-5">
            <p className="font-semibold text-3xl text-[#315E30]">
              Specialization:{" "}
            </p>
            <p className="font-semibold text-3xl text-[#315E30]">
              Sub-Specialization:{" "}
            </p>
            <p className="font-semibold text-3xl text-[#315E30]">
              HMO Accredation:{" "}
            </p>
          </div>
          <div className="text-end space-y-5">
            <p className=" text-3xl text-[#439541]"> {Special} </p>
            <p className=" text-3xl text-[#439541]">{Sub}</p>
            <p className=" text-3xl text-[#439541]">{Hmo}</p>
          </div>
        </div>
        {/* schedules */}
        <p className="font-bold text-3xl mt-12 mb-4 text-[#315E30]">
          Schedules:{" "}
        </p>
        <div class=" mb-6 px-8 py-4 bg-[#52A84F] grid-cols-3 text-white text-3xl font-semibold flex">
          <p className="px-28">DAY</p>
          <p className="px-32 pl-48">AM </p>
          <p className="px-4">PM</p>
        </div>
        <div className="grid-cols-3 mb-14">
        <DoctorScheds/></div>
        <div className="flex justify-end">
          <Link
            to="/ChooseType"
            className="justify-center align-middle flex w-[40%] text-3xl bg-[#418D3F] rounded-md px-3 py-1 text-white
           font-semibold ring-[#418D3F] ring-[3px] transition duration-75 ease-in hover:bg-[#A5DD9D]
            hover:text-[#267124]"
          >
            <MdSchedule className="mx-1 mt-1" />
            Book an Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;

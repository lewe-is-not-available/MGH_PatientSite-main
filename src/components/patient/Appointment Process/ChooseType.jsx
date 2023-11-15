import React, { useState, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import supabase from "../../config/Supabase";
import { useParams } from "react-router-dom";

const OnlineOrF2f = () => {
  const { id } = useParams();
  const [getId, setId] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      const { data, error } = await supabase
        .from("Dr_information")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        toast.error("error", {
          toastId: "error",
        });
      }
      if (data) {
        toast.info("Choose Type", {
          toastId: "choose",
        });
        setId(data.id);
      }
    };
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className="h-screen">
      <div
        className="hero2 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p className="text-5xl font-semibold" data-aos="fade-up">
          RESERVE AN APPOINTMENT NOW!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Let us assist your appointment either online or onsite.
        </p>
      </div>
      <div className="back text-center py-5 h-[62%]">
        <p className="text-5xl font-semibold text-[#315E30] mt-10 mb-24">
          Choose an appintment type
        </p>
        <div className="flex justify-center text-[44px] text-white font-semibold mb-28">
          <Link to={"/Online/" + getId}>
            <div
              className="flex bg-[#7AB672] px-3 py-1 rounded-l-full ring-[4px] ring-[#7AB672]
           hover:ring-[#509E4E] hover:bg-[#E1F2DF] transition duration-150 ease-in-out cursor-pointer hover:text-[#468F44]"
            >
              <HiOutlineStatusOnline className="text-7xl" />
              Online Consultation
            </div>
          </Link>
          <Link to={"/Face-to-face/"+getId}>
            <div
              className="flex bg-[#509E4E] px-3 py-1 rounded-r-full ring-[4px] ring-[#509E4E]
           hover:ring-[#509E4E] hover:bg-[#E1F2DF] transition duration-150 ease-in-out cursor-pointer hover:text-[#468F44]"
            >
              <MdOutlineMeetingRoom className="text-7xl" />
              Face-to-face Consultation
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnlineOrF2f;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const AppointmentDetails = () => {
  //*get patient's appointment details
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [medical, setMedical] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("Patient_Appointments")
        .select()
        .eq("book_id", id)
        .single();

      if (error) {
        toast.error(error + " error", {
          toastId: "error",
        });
      }
      toast.info("data loaded", {
        toastId: "choose",
      });
      setMedical(data.medicalhistory);
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  //*accepting the appointment
  const navigate = useNavigate();

  async function handleAccept(e) {
    e.preventDefault()
    const { error } = await supabase
      .from("Patient_Appointments")
      .update({ status: "Confirmed" })
      .eq("book_id", id);
    if (error) {
      console.log(error);
    }
    navigate("/Confirm_Appointments")
  }

  return (
    <div className="back flex place-content-center h-screen w-full">
      {loading ? (
        <Oval
          height={80}
          width={80}
          color="#4fa94d"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#4fa94d"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      ) : (
        <form className="flex flex-col p-5 mt-10 bg-white abs absolute">
          <div className="flex flex-col">
            <p>{data.fname}</p>
            <div>
              {medical.map((item) => (
                <div key={item} className="flex flex-col">
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <div className="flex text-white space-x-3">
              <button 
              onClick={(e)=>handleAccept(e)}
              className="transition duration-100 bg-green-600 hover:bg-green-400 px-2 rounded-full ">
                accept
              </button>
              <button className="transition duration-100 bg-red-600 hover:bg-red-400 px-2 rounded-full ">reject</button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default AppointmentDetails;

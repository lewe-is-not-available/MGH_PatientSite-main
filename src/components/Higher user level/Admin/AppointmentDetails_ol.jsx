import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const AppointmentDetails_ol = () => {
  //*get patient's appointment details
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("F2f_Appointments")
        .select()
        .eq("f2f_id", id)
        .single();

      if (error) {
        toast.error(error + " error", {
          toastId: "error",
        });
      }
      if (data) {
        toast.info("data loaded", {
          toastId: "choose",
        });
        setData(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  //*accepting the appointment
  const navigate = useNavigate();
  async function handleAccept() {
    const { error } = await supabase
      .from("countries")
      .update({ status: "Australia" })
      .eq("id", 1);
    if (error) {
      console.log(error);
    }
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
        <form
          key={data.f2f_id}
          className="flex flex-col p-5 mt-10 bg-white abs absolute"
        >
          {data.email}
          <button className="bg-green-300">accept</button>
          <button className="bg-red-300">reject</button>
        </form>
      )}
    </div>
  );
};
export default AppointmentDetails_ol;

import React, { useEffect, useState } from "react";
import supabase from "./config/Supabase";
import NotifictionConfig from "./NotificationConfig";


const Notification = () => {
  const [icon, setIcon] = useState(false);
  const [isolated_data, setIsolate] = useState([]);
  useEffect(() => {
    getAppointments();
  }, [1]);

  const getAppointments = async () => {
    const { data: appoint } = await supabase
      .from("patient_Appointments")
      .select();

    // Isolated data in table patient_Appoint only retrieve cancel,reminder,rescheduled, and booked in status
    var holder = [];
    for (let i = 0; i < appoint.length; i++) {
      if (
        appoint[i].status === "cancel" ||
        appoint[i].status === "reminder" ||
        appoint[i].status === "rescheduled" ||
        appoint[i].status === "booked"
      ) {
        holder = holder.concat(...isolated_data, appoint[i]);
      }
    }
    setIsolate(holder);
    console.log(isolated_data);
  };

  return (
    <div className="back min-h-screen h-auto w-full flex flex-col items-center ">
      <h1 className="text-5xl font-semibold mt-16 text-green-900">
        Notifications
      </h1>
      <div className="mt-2">
        {isolated_data && (
          <div>
            {isolated_data.map((data, index) => (
              <NotifictionConfig key={index} data={data} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;

import React, { useEffect, useState } from "react";
import supabase from "./config/Supabase";
import NotifictionConfig from "./NotificationConfig";

const Notification = ({ user }) => {
  // user uuid
  const [icon, setIcon] = useState(false);
  const [isolated_data, setIsolate] = useState([]);
  useEffect(() => {
    getAppointments();
  }, [user]);

  // on site
  // if doctor accept = confirmed
  // if doctor recject = patiend reject
  // if doctor resched = patiend resched
  // if docotor accept = consultation is true = ongoing consultation

  // online
  // if gmeet reject = await doctors's confirmation?

  const getAppointments = async () => {
    if (user?.role === "doctor") {
      var fullname = user.first_name + " " + user.last_name;

      const { data: notif } = await supabase
        .from("notification")
        .select()
        .match({ docname: fullname });

      setIsolate(notif);
    } else if (user?.role === "patient") {
      const { data: notif } = await supabase
        .from("notification")
        .select()
        .match({ email: user.email });
      setIsolate(notif);
    } else if (user?.role === "admin") {
      const { data: notif } = await supabase.from("notification").select();

      setIsolate(notif);
    }
  };

  return (
    <div className="back min-h-screen h-auto w-full flex flex-col items-center ">
      <h1 className="text-5xl font-semibold mt-16 text-green-900">
        Notifications
      </h1>
      <div className="mt-2">
        {isolated_data ? (
          <div>
            {isolated_data.map((data, index) => (
              <NotifictionConfig key={index} data={data} user={user} />
            ))}
          </div>
        ) : (
          "NO DATA"
        )}
      </div>
    </div>
  );
};

export default Notification;

import React, { useEffect } from "react";
import supabase from "./config/Supabase";
import _ from "lodash";
import moment from "moment";

const F2fConfig = ({ data, i }) => {
  const appDay = moment(new Date(data?.date)).format("YYYYMD");

  //*see if app day elapsed date today
  const isElapsed = _.lte(appDay, moment(new Date()).format(`YYYYMD`));


  async function f2fFunction() {
    if (data.status !== "Completed" && isElapsed) {
      const { error: docErr } = await supabase
        .from("patient_Appointments")
        .update({ status: "Completed" })
        .eq("book_id", data?.book_id);
      try {
        if (docErr) throw docErr;
      } catch (error) {
        console.log(error.message);
      }
    }
  }
  useEffect(() => {
    f2fFunction();
  }, [data, isElapsed]);

  return <div key={i}></div>;
};

export default F2fConfig;

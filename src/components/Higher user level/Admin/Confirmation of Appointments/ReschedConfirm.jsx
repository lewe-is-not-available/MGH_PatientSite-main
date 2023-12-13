import React, { useEffect, useState } from "react";
import { cardio } from "ldrs";
import { useNavigate } from "react-router-dom";
import { TbCalendarTime } from "react-icons/tb";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";

cardio.register();

const AcceptConfirm = ({ setResched, id, user }) => {
  const nav = useNavigate();
  const [date, setDate] = useState();
  const [remark, setRemark] = useState();
  const [lastReschedQue, setLastReschedQue] = useState();
  const [data, setData] = useState();
  console.log(lastReschedQue)
  async function fetchBook() {
    const { data: book, error: failDoc } = await supabase
      .from("patient_Appointments")
      .select()
      .eq("book_id", id)
      .single();
    if (failDoc) throw failDoc;
    setData(book);
  }
  async function fetchQue() {
    try {
      const { data: ResQueNum, error: ResQueErr } = await supabase
        .from("patient_Appointments")
        .select("queue")
        .match({
          doc_id: data?.doc_id,
          date: date,
          status: "rescheduled",
        })
        .order("queue", { ascending: false })
        .limit(1);
      if (ResQueNum) {
        setLastReschedQue(ResQueNum[0]);
      }
      if (ResQueErr) {
        throw Error(ResQueErr.message + "206");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  //*realtime for fetching last queue number
  useEffect(() => {
    fetchBook()
    const fetchAndSubscribe = async () => {
      await fetchQue();
      await fetchBook();
      const realtime = supabase
        .channel("room13")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `doc_id=eq.${data?.doc_id}`,
          },
          (payload) => {
            fetchQue(payload.new.data);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `date=eq.${date}`,
          },
          (payload) => {
            fetchQue(payload.new.data);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `status=eq.rescheduled`,
          },
          (payload) => {
            fetchQue(payload.new.data);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, [date]);

  async function handleSubmit(e) {
    e.preventDefault();
    setResched(false);
    try {
      const { error } = await supabase
        .from("patient_Appointments")
        .update({
          status: "rescheduled",
          date,
          remark,
          queue: lastReschedQue?.queue ? lastReschedQue.queue + 1 : 100 + 1,
        })
        .eq("book_id", id);
      if (error) throw error;
      else {
        toast.success("Appointment Succesfully Rescheduled");
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  }
  //*To prevent user inputting past dates
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div className="bg-white sticky -mt-[8rem] flex w-[29rem] flex-col items-center abs rounded-lg p-6">
        <>
          <div className="flex">
            <div className="h-full">
              <TbCalendarTime className="text-4xl mr-3 mt-2 text-primary-500" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-start">
              <h1 className="mb-2 font-semibold text-xl flex items-end">
                <span>Reschedule Appointment</span>
              </h1>
              <p className="mb-4">
                Are you sure you want to reschedule this appointment?
              </p>
              <p>Select a date to reshedule:</p>
              <input
                required
                onChange={(e) => setDate(e.target.value)}
                type="date"
                min={disablePastDate()}
                className="mb-4 bg-slate-200 px-3 py-1 w-[60%] focus:border-2 border-b-2 border-slate-400"
              />
              <p>Reason for rescheduling:</p>
              <input
                required
                onChange={(e) => setRemark(e.target.value)}
                type="text"
                className="mb-4 bg-slate-200 px-3 py-1 w-[60%] focus:border-2 border-b-2 border-slate-400"
              />
              <div className="flex items-center justify-end w-full space-x-2 mt-3">
                <button
                  onClick={(e) => setResched(false) || e.preventDefault()}
                  className="px-9 py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-9 py-1 bg-primary-600 transition duration-100 hover:bg-primary-800 text-white rounded-md">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </>
      </div>
    </div>
  );
};

export default AcceptConfirm;

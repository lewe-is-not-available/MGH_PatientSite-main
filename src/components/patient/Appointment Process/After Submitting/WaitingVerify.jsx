import React, { useState } from "react";
import { dotWave } from "ldrs";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import supabase from "../../../config/Supabase";
import { useEffect } from "react";
import supabaseAdmin from "../../../config/SupabaseAdmin";
import SuccessAppointment from "./SuccessAppointment";

dotWave.register();

const WaitingVerify = () => {
  const id = useParams();

  const [email, setEmail] = useState();
  async function getUser() {
    const { data, error: userErr } = await supabase
      .from("patient_Appointments")
      .select("email")
      .eq("book_id", id.bookID)
      .single();
    try {
      if (userErr) throw userErr;
      else {
        setEmail(data.email);
      }
    } catch (userErr) {
      toast.error(userErr.message);
      console.log(userErr);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  async function handReset(e) {
    e.preventDefault();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo:
          "https://leweprojects.github.io/MGHsite/#/Appointment/Success/" +
          id.bookID,
      },
    });
    try {
      if (error) throw error;
      else {
        toast.success("Success");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const [isVerified, setIsVerified] = useState();
  const fetchVerify = async () => {
    try {
      if (email) {
        const { data: userID, error: idErr } = await supabase
          .from("profile")
          .select()
          .eq("email", email)
          .single();
        if (idErr) throw idErr;

        if (userID) {
          const { data: user, error: userErr } =
            await supabaseAdmin.auth.admin.getUserById(userID.id);
          if (userErr) throw userErr;
          if (user) {
            setIsVerified(user.user.email_confirmed_at);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    //*Realtime data.
    const fetchAndSubscribe = async () => {
      await fetchVerify();
      if (email) {
        const realtime = supabaseAdmin
          .channel("room4")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "auth",
              table: "users",
            },
            (payload) => {
              fetchVerify(payload.new.data);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(realtime);
          realtime.unsubscribe();
        };
      }
    };
    fetchAndSubscribe();
  }, [email, isVerified]);

  const nav = useNavigate();
  if (isVerified) {
    nav("/Appointment/Success/" + id.bookID);
  }

  return (
    <div className="back flex items-center h-screen justify-center">
      <div className="flex h-[60%] justify-center space-y-3 px-14 flex-col items-center abs rounded-md bg-white">
        <div className=" flex items-center ">
          <h1 className="text-5xl text-green-700 font-semibold">
            Waiting for verification{" "}
          </h1>
          <l-dot-wave size="50" speed="0.4" color="#149044"></l-dot-wave>
        </div>
        <p className="text-xl">
          Please check you email for the verification link...
        </p>
        <p>
          If the verification is not sent click{" "}
          <button
            onClick={handReset}
            className="transition duration-100 text-primary hover:text-primary-800"
          >
            Resend Confirmation
          </button>
        </p>
      </div>
    </div>
  );
};

export default WaitingVerify;

import React, { useState } from "react";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { cardio } from "ldrs";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import supabaseAdmin from "../../../config/SupabaseAdmin";

cardio.register();

const ConfirmDelete = ({ data, setConfirmDelete }) => {
  const [loadConfirm, setLoadConfirm] = useState(false);
  const nav = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setLoadConfirm(true);
    //*Delete image
    const { error: storageErr } = await supabase.storage
      .from("images")
      .remove([data.email]);
    if (storageErr) {
      toast.error(storageErr + "22");
    }
    const { data: PatientID, error: fail } = await supabase
      .from("profile")
      .select("id")
      .eq("email", data.email)
      .single();

    try {
      //*Delete user account
      if (fail) throw fail;
      else {
        const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(
          PatientID.id
        );

        if (delErr) {
          setTimeout(() => {
            console.log(delErr);
            toast.error(delErr.message + "41");
            setLoadConfirm(false);
          }, 1000);
          return;
        } else {
          setTimeout(() => {
            // nav("/Edit_Patients");
            toast.success("Account deleted succesfully", {
              toastId: "success",
            });
          }, 1000);
        }
      }
    } catch (fail) {
      setTimeout(() => {
        console.log(fail);
        toast.error(fail.message + "55", {
          toastId: "error",
        });
        setLoadConfirm(false);
      }, 1000);
    }
  }

  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div className="bg-white sticky mt-[5rem] flex w-[29rem] flex-col items-center abs rounded-lg p-6">
        {loadConfirm ? (
          <>
            <l-cardio size="120" stroke="2" speed="1" color="rgb(0,100,0)" />
            <h1 className="text-4xl">Deleting account please wait</h1>
          </>
        ) : (
          <>
            <div className="flex">
              <div className="h-full">
                <IoWarningOutline className="text-4xl mr-3 mt-2 text-red-500" />
              </div>

              <div className="flex flex-col items-start">
                <h1 className="mb-2 font-semibold text-xl flex items-end">
                  <span>Account Deletion</span>
                </h1>
                <p className="mb-4">
                  Are you sure you wish to delete this account? This will delete
                  the account PERMANENTLY.
                </p>
                <div className="flex items-center justify-end w-full space-x-2 mt-3">
                  <button
                    onClick={(e) =>
                      setConfirmDelete(false) || e.preventDefault()
                    }
                    className="px-9 py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-9 py-1 bg-red-600 transition duration-100 hover:bg-red-800 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmDelete;

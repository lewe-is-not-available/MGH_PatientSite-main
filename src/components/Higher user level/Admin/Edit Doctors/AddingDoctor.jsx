import React, { useState, useRef, useEffect } from "react";
import supabaseAdmin from "../../../config/SupabaseAdmin";
import { toast } from "react-toastify";
import supabase from "../../../config/Supabase";

const AddingDoctor = ({ setShowAdd }) => {
  let addDocRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!addDocRef.current.contains(e.target)) {
        setShowAdd(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setShowAdd]);

  //*Getting inputs
  const [FullName, setName] = useState();
  const [formData, setformData] = useState({
    name: "",
    fname: "",
    mname: "",
    lname: "",
    bday: "",
    special: "",
    subspec: "",
    type: "",
    hmo: {},
    honorific: "",
    phone: "",
  });

  //*Onchange function
  const handleChange = (e) => {
    setformData((prevForm) => {
      return {
        ...prevForm,
        [e.target.name]: e.target.value,
      };
    });
  };

  //*Combining first last and middle name
  useEffect(() => {
    setName(
      formData.fname +
        (formData.mname ? " " + formData.mname : "") +
        " " +
        formData.lname
    );
  }, [formData]);

  //*bday format
  const bday = new Date(formData.bday);
  const month = (bday.getMonth() + 1).toString().padStart(2, "0");
  const day = bday.getDate().toString().padStart(2, "0");
  const year = bday.getFullYear();

  const bdayEmail = `${year}${month}${day}`;

  //*Creating account function for doctor
  const email =
    (formData.fname[0] && formData.fname[0].toLowerCase()) +
    (formData.mname ? formData.mname[0].toLowerCase() : "") +
    formData.lname.toLowerCase() +
    "@mgh.com";
  const password = formData.lname.toLowerCase() + bdayEmail;

  async function handleSubmit(e) {
    e.preventDefault();

    const { data: created, error: fail } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "doctor",
        },
      });
    try {
      if (fail) throw fail;
      else if (created) {
        const { data: inserted, error: insertErr } = await supabase
          .from("dr_information")
          .insert({
            name: FullName,
            phone: formData.phone,
            specialization: formData.special,
            subspecial: formData.subspec,
            drschedule: "Denmark",
            hmo: "Denmark",
          });
      }
    } catch (fail) {
      toast.error(fail.message);
      console.log(fail);
    }
  }

  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-full z-50 flex justify-center items-center">
      <div
        ref={addDocRef}
        className="bg-white flex flex-col items-center abs rounded-lg p-6 h-[60%] w-[80%]"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={(e) => setShowAdd(false) || e.preventDefault()}
            className="bg-slate-200 rounded-md px-3 text-lg"
          >
            close
          </button>
        </div>
        <h1 className="text-3xl font-semibold uppercase">Add a Doctor</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <section className="grid grid-cols-3 justify-center">
            <div className="w-full flex flex-col space-y-3 mx-8 text-left">
              <div className="flex flex-col">
                <label className="">First Name:</label>
                <input
                  type="text"
                  name="fname"
                  onChange={handleChange}
                  className="w-fit"
                />
              </div>
              <div className="flex flex-col">
                <label className="">Middle Name:</label>
                <input
                  type="text"
                  name="mname"
                  onChange={handleChange}
                  className="w-fit"
                />
              </div>
              <div className="flex flex-col">
                <label className="">Last Name:</label>
                <input
                  type="text"
                  name="lname"
                  onChange={handleChange}
                  className="w-fit"
                />
              </div>
              <div className="flex flex-col">
                <label className="">Date of birth:</label>
                <input
                  type="date"
                  name="bday"
                  onChange={handleChange}
                  className="w-fit"
                />
              </div>
              <div className="flex flex-col">
                <label className="">Date of birth:</label>
                <input
                  type="number"
                  name="bday"
                  onChange={handleChange}
                  style={{
                    WebkitAppearance: "meter",
                  }}
                  className="w-fit"
                />
              </div>
            </div>
            <div className=""></div>
            <div className=""></div>
          </section>
          <button>submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddingDoctor;

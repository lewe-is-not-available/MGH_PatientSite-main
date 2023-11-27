import React, { useState, useRef, useEffect } from "react";
import supabaseAdmin from "../../../config/SupabaseAdmin";
import { toast } from "react-toastify";
import supabase from "../../../config/Supabase";
import { BiInfoCircle } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import UploadPic from "./UploadPic";
import Specials from "../../../Specials.json";
import SubSpecial from "../../../SubSpecial.json";
import { cardio } from "ldrs";
import Aos from "aos";
import "aos/dist/aos.css";
import SuccessAdding from "./SuccessAdding";

cardio.register();

const AddingDoctor = ({ setShowAdd }) => {
  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 300 });
    Aos.refresh();
  }, []);
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

  const [File, setFile] = useState([]);
  const [isSelected, setSelected] = useState(false);
  const [image, setImage] = useState(null);

  //*Drag and Drop function
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setSelected(true);
    //preview image
    setImage(URL.createObjectURL(e.dataTransfer.files[0]));
    setFile(e.dataTransfer.files);
  };
  //*Handle File Input
  const handleFile = (e) => {
    e.preventDefault();
    setSelected(true);
    //preview image
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files);
  };
  //*Handle choosing of another file
  const handleCancel = (e) => {
    e.stopPropagation();
    setSelected(false);
    //preview image
    setImage(null);
    setFile(null);
  };
  //*Image uploading
  async function uploadImage() {
    const { data, error } = await supabase.storage
      .from("images")
      .upload(email + "/profile/" + uuidv4(), File[0]);
    if (error) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      toast.error(error.message, { autoClose: false });
    }
    if (data) {
      setSelected(false);
      setImage(null);
      setFile(null);
    }
  }

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
    //hmo: [],
    honorific: "",
    phone: "",
    id: "",
    gmeet: "",
  });
  //*Schedule
  const weeks = [
    {
      id: 0,
      day: "Monday",
      value: "Monday",
    },
    { id: 1, day: "Tuesday", value: "Tuesday" },
    { id: 2, day: "Wednesday", value: "Wednesday" },
    { id: 3, day: "Thursday", value: "Thursday" },
    { id: 4, day: "Friday", value: "Friday" },
    { id: 5, day: "Saturday", value: "Saturday" },
    { id: 6, day: "Sunday", value: "Sunday" },
  ];
  const [schedule, setSchedule] = useState([]);
  const handleCheckboxChange = (day) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      const existingDay = updatedSchedule.find((item) => item.day === day);

      if (existingDay) {
        // Remove day if it exists
        updatedSchedule.splice(updatedSchedule.indexOf(existingDay), 1);
      } else {
        // Add day if it doesn't exist
        updatedSchedule.push({ day, startTime: "", endTime: "" });
      }

      return updatedSchedule;
    });
  };

  const handleTimeChange = (day, timeType, value) => {
    setSchedule((prevSchedule) => {
      const updatedSchedule = [...prevSchedule];
      const existingDay = updatedSchedule.find((item) => item.day === day);

      if (existingDay) {
        if (timeType === "startTime") {
          existingDay.startTime = value;
        } else if (timeType === "endTime") {
          existingDay.endTime = value;
        }
      }

      return updatedSchedule;
    });
  };

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

  //*automated email and password format
  const email =
    (formData.fname[0] && formData.fname[0].toLowerCase()) +
    (formData.mname ? formData.mname[0].toLowerCase() : "") +
    formData.lname.toLowerCase() +
    (formData.id ? formData.id : "") +
    "@mgh.com";
  const password = formData.lname.toLowerCase() + bdayEmail;

  //*after submitting
  const [Loading, setLoading] = useState(false);
  const [Success, setSuccess] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const { error: insertErr } = await supabase.from("dr_information").insert({
      name: FullName,
      phone: formData.phone,
      specialization: formData.special,
      subspecial: formData.subspec,
      schedule: schedule,
      hmo: formData.hmo,
      honorific: formData.honorific,
      email: email,
      type: formData.type === "Face to face" ? "f2f" : "ol",
      gmeet: formData.gmeet,
    });
    if (insertErr) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      toast.error(insertErr.message, { autoClose: false });
      console.log(insertErr);
    } else {
      //*Creating acc function
      const { data: created, error: fail } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            role: "doctor",
            birth_date: formData.bday,
            first_name: formData.fname,
            middle_name: formData.mname,
            last_name: formData.lname,
            phone: formData.phone,
            username: formData.lname + (formData.id ? formData.id : ""),
          },
        });
      try {
        if (fail) throw fail;
        else if (created) {
          setTimeout(() => {
            setLoading(false);
            uploadImage();
          }, 2000);
        }
      } catch (fail) {
        toast.error(fail.message, { autoClose: false });
        console.log(fail);
      }
      setTimeout(() => {
        setSuccess(true);
      }, 1500);
    }
  }
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-full z-50 flex justify-center">
      <div
        data-aos="fade-left"
        ref={addDocRef}
        className="bg-white mt-[5rem] flex flex-col items-center abs rounded-lg p-6 h-[60%] w-[80%]"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={(e) => setShowAdd(false) || e.preventDefault()}
            className="bg-slate-200 rounded-md px-3 text-lg"
          >
            close
          </button>
        </div>
        {Success ? (
          <SuccessAdding setSuccess={setSuccess} />
        ) : (
          <>
            <h1 className="text-3xl font-semibold uppercase">Add a Doctor</h1>
            {Loading ? (
              <div className="flex flex-col h-full text-green-600 justify-center items-center">
                <l-cardio
                  size="120"
                  stroke="2"
                  speed="1"
                  color="rgb(0,100,0)"
                />
                <h1 className="text-4xl">Adding doctor please wait</h1>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full flex flex-col">
                <section className="grid grid-cols-3 overflow-y-auto max-h-[29rem] justify-center">
                  <UploadPic
                    isSelected={isSelected}
                    image={image}
                    handleCancel={handleCancel}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleFile={handleFile}
                    File={File}
                  />
                  <div className="w-full flex flex-col  space-y-3 ml-8 text-left">
                    <div className="flex flex-col">
                      <label className="">Honorific:</label>
                      <select
                        type="text"
                        name="honorific"
                        onChange={handleChange}
                        className="w-fit px-3 bg-slate-100 border-b-2 border-slate-400"
                      >
                        <option id="00"></option>
                        <option id="1">Dr.</option>
                        <option id="2">Dra.</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="">First Name:</label>
                      <input
                        required
                        type="text"
                        name="fname"
                        onChange={handleChange}
                        className="w-[73%] px-3 bg-slate-100 border-b-2 border-slate-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="">Middle Name:</label>
                      <input
                        type="text"
                        name="mname"
                        onChange={handleChange}
                        className="w-[73%] px-3 bg-slate-100 border-b-2 border-slate-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="">Last Name:</label>
                      <input
                        required
                        type="text"
                        name="lname"
                        onChange={handleChange}
                        className="w-[73%] px-3 bg-slate-100 border-b-2 border-slate-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="">id:</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          name="id"
                          onChange={handleChange}
                          className="w-10 px-3 bg-slate-100 border-b-2 border-slate-400"
                        />
                        <BiInfoCircle className="text-xl peer/id" />
                        <div
                          className="abs bg-white flex flex-col w-[10rem] text-sm text-primary p-3 absolute 
                translate-x-[70px] invisible translate-y-6 peer-hover/id:visible"
                        >
                          <p>
                            Default input here is empty. Type an id if the
                            doctor's email already exist or is similar to other
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="">Date of birth:</label>
                      <input
                        required
                        type="date"
                        name="bday"
                        onChange={handleChange}
                        className="w-[73%] px-3 bg-slate-100 border-b-2 border-slate-400"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="">Contact number:</label>
                      <input
                        required
                        type="text"
                        name="phone"
                        onChange={handleChange}
                        className="w-[73%] px-3 bg-slate-100 border-b-2 border-slate-400"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-col">
                      <p>Specialization</p>
                      <select
                        required
                        name="special"
                        onChange={handleChange}
                        className="w-fit px-3 bg-slate-100 border-b-2 border-slate-400"
                      >
                        <option id="00"></option>
                        {Specials.map((spec, i) => (
                          <option key={i} id={i}>
                            {spec.Specialization}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col ">
                      <p>Sub-Specialization</p>
                      <select
                        required
                        name="subspec"
                        onChange={handleChange}
                        className="w-fit px-3 bg-slate-100 border-b-2 border-slate-400"
                      >
                        <option id="00"></option>
                        {SubSpecial.map((spec, i) => (
                          <option key={i} id={i}>
                            {spec.SubSpecialization}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col ">
                      <p>Consultation type:</p>
                      <select
                        required
                        name="type"
                        onChange={handleChange}
                        className="w-fit px-3 bg-slate-100 border-b-2 border-slate-400"
                      >
                        <option id="00"></option>
                        <option id="0">Face to face</option>
                        <option id="1">Online Consultation</option>
                      </select>
                    </div>
                    <div className="flex flex-col ">
                      <p>Gmeet room link:</p>
                      <input
                        required
                        type="text"
                        name="gmeet"
                        onChange={handleChange}
                        className="w-fit px-3 bg-slate-100 border-b-2 border-slate-400"
                      ></input>
                    </div>
                  </div>

                  <div className=""></div>
                  <div className="border-b-2 mt-6 col-span-3 w-full flex justify-center"></div>
                  <div className="col-span-3 mx-28 flex flex-col items-center">
                    <h1 className="text-3xl font-semibold">Set Schedule</h1>
                    <div className="flex justify-between bg-green-700 p-2 text-white items-center w-full">
                      <p className="ml-3">Days</p>
                      <div className="flex items-center space-x-16 mr-10">
                        <p>Check in</p>
                        <p>Check out</p>
                      </div>
                    </div>

                    {weeks.map((day, i) => (
                      <div
                        key={i}
                        className="flex items-center w-full space-y-4 bg-slate-200 mb-3 px-3 justify-between"
                      >
                        <div className="flex items-center ">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                   focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                   focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() => handleCheckboxChange(day.value)}
                          />
                          <p className="mx-1">{day.day}</p>
                        </div>
                        {schedule.map((item) => {
                          if (item.day === day.value) {
                            return (
                              <div
                                key={item.day}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  required
                                  type="time"
                                  className="px-2 -mt-2 mb-2"
                                  value={item.startTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      day.value,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  required
                                  type="time"
                                  className="px-2 -mt-2 mb-2"
                                  value={item.endTime}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      day.value,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <button
                      type="submit"
                      className="mt-5 transition duration-100 font-semibold bg-green-600 text-white px-[20rem] border-2 border-green-600 rounded-md hover:bg-green-300 hover:text-green-600 text-xl uppercase"
                    >
                      submit
                    </button>
                  </div>
                </section>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddingDoctor;

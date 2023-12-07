import React, { useState, useRef, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import UploadPic from "./UploadPic";
import { FiUpload } from "react-icons/fi";
import supabase from "../../../config/Supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { cardio } from "ldrs";

cardio.register();
const EditDoctorModal = ({
  setOpenEdit,
  data,
  isImgEmpty,
  CDNURL,
  imgName,
}) => {
  //*AOS function
  useEffect(() => {
    Aos.init({ duration: 300 });
    Aos.refresh();
  }, []);

  //*close when clicked outside
  let editDocRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!editDocRef.current.contains(e.target)) {
        setOpenEdit(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [editDocRef]);
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  //*getting inputs
  const [formData, setformData] = useState({
    name: "",
    special: "",
    subspec: "",
    type: "",
    //hmo: [],
    honorific: "",
    phone: "",
    gmeet: "",
    sched: daysOfWeek.map((day) => ({
      day,
      startTime: "",
      endTime: "",
      checked: false,
    })),
    schedtable: [],
  });

  //*Onchange function
  const handleChange = (e) => {
    setformData((prevForm) => {
      return {
        ...prevForm,
        [e.target.name]: e.target.value,
        phone: e.target.value.slice(0, 11)
      };
    });
  };
  //*Autofill
  useEffect(() => {
    if (data) {
      setformData((prevForm) => {
        const filteredSchedule = data.schedule.filter(
          (item) => item.startTime !== "" && item.endTime !== ""
        );
        const newSchedule = daysOfWeek.map((day) => {
          const existingDay = filteredSchedule.find((item) => item.day === day);
          return {
            day,
            startTime: existingDay ? existingDay.startTime : "",
            endTime: existingDay ? existingDay.endTime : "",
            checked: existingDay ? true : false,
          };
        });
        return {
          ...prevForm,
          name: data.name,
          special: data.specialization,
          subspec: data.subspecial,
          phone: data.phone,
          type: data.type,
          honorific: data.honorific,
          gmeet: data.gmeet,
          sched: newSchedule,
          schedtable: filteredSchedule,
        };
      });
    }
  }, [data]);
  //*Edit profile pic
  const [isEdit, setIsEdit] = useState(false);
  function openEditProf(e) {
    e.preventDefault();
    setIsEdit(true);
  }
  function closeEditProf(e) {
    e.preventDefault();
    setIsEdit(false);
    setSelected(false);
    setImage(null);
    setFile(null);
  }

  //*Drag and Drop function
  const [load, setload] = useState(false);
  const [File, setFile] = useState([]);
  const [isSelected, setSelected] = useState(false);
  const [image, setImage] = useState(null);
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
    setImage(null);
    setFile(null);
  };
  console.log(data.email);
  //*Image uploading
  async function uploadImage() {
    if (data) {
      if (isImgEmpty) {
        supabase.storage
          .from("images")
          .remove([data.email + "/profile/" + imgName]);
      }
      const { error } = await supabase.storage
        .from("images")
        .upload(data.email + "/profile/" + uuidv4(), File[0]);
      try {
        if (error) throw error;
        else {
          setSelected(false);
          setImage(null);
          setFile(null);
          setload(false);
          window.location.reload();
          toast.success("Succesfully uploaded", {
            toastId: "success",
          });
        }
      } catch (error) {
        toast.error(error.message);
        setload(false);
      }
    }
  }

  const handleSchedChange = (e, index) => {
    const { name, value } = e.target;
    const newSchedule = [...formData.sched];

    // Update the schedule
    newSchedule[index] = { ...newSchedule[index], [name]: value };

    // Update schedtable when both start time and end time are provided
    const day = newSchedule[index].day;
    const existingDayIndex = formData.schedtable.findIndex(
      (item) => item.day === day
    );

    if (name === "startTime" || name === "endTime") {
      const updatedSchedtable = [...formData.schedtable];
      if (value !== "") {
        // Update or add the day in schedtable
        if (existingDayIndex !== -1) {
          updatedSchedtable[existingDayIndex][name] = value;
        } else {
          updatedSchedtable.push({ day, startTime: "", endTime: "" });
        }
      } else {
        // Remove the day from schedtable if both start time and end time are empty
        if (existingDayIndex !== -1) {
          updatedSchedtable.splice(existingDayIndex, 1);
        }
      }

      setformData((prevForm) => ({
        ...prevForm,
        sched: newSchedule,
        schedtable: updatedSchedtable,
      }));
    }
  };

  const handleCheckboxChange = (index) => {
    const newSchedule = [...formData.sched];
    const day = daysOfWeek[index];
    const isChecked = !newSchedule[index].checked;
    // Update the schedule
    const updatedSchedule = isChecked
      ? [...formData.schedtable, { day, startTime: "", endTime: "" }]
      : formData.schedtable.filter((item) => item.day !== day);

    // Update the checkbox state
    newSchedule[index].checked = isChecked;

    setformData((prevForm) => ({
      ...prevForm,
      sched: newSchedule,
      schedtable: updatedSchedule,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setload(true);
    const { error } = await supabase
      .from("dr_information")
      .update({
        name: formData.name,
        specialization: formData.special,
        subspecial: formData.subspec,
        honorific: formData.honorific,
        type: formData.type,
        gmeet: formData.gmeet,
        phone: formData.phone,
        schedule: formData.schedtable,
      })
      .eq("email", data.email);
    try {
      if (error) throw error;
      else {
        if (isEdit) {
          uploadImage();
          toast.success("Succesful pic");
        }
        setload(false);
        toast.success("Succesful");
      }
    } catch (error) {
      toast.error(error.message);
      setload(false);
    }
  }

  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex justify-center">
      <div
        data-aos="fade-left"
        ref={editDocRef}
        className="bg-white sticky mt-[5rem] flex flex-col items-center abs rounded-lg p-6 h-[60%] w-[50%]"
      >
        <div className="w-full flex mb-5 justify-end">
          <button
            onClick={(e) => setOpenEdit(false) || e.preventDefault()}
            className="bg-slate-200 hover:bg-slate-300 transition duration-75 rounded-md px-3 select-none text-lg"
          >
            close
          </button>
        </div>
        {load ? (
          <div className="flex flex-col h-full text-green-600 justify-center items-center">
            <l-cardio size="120" stroke="2" speed="1" color="rgb(0,100,0)" />
            <h1 className="text-4xl">Adding doctor please wait</h1>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 overflow-y-auto w-full h-full px-5"
          >
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col">
                <label>Name: </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Specialization: </label>
                <input
                  type="text"
                  name="special"
                  value={formData.special}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Sub-specialization: </label>
                <input
                  type="text"
                  name="subspec"
                  value={formData.subspec}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Consultation type: </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Honorific: </label>
                <input
                  type="text"
                  name="honorific"
                  value={formData.honorific}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Contact number: </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Gmeet: </label>
                <input
                  type="text"
                  name="gmeet"
                  value={formData.gmeet}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-3 items-center">
              <div className="flex flex-col mt-8 text-center items-center w-full">
                <h1 className="mb-2">Doctor's Profile pic</h1>
                {isEdit ? (
                  <>
                    <UploadPic
                      isSelected={isSelected}
                      image={image}
                      handleCancel={handleCancel}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      handleFile={handleFile}
                      File={File}
                    ></UploadPic>
                    <button
                      onClick={closeEditProf}
                      className={`${
                        isSelected
                          ? "mt-14 bg-primary-300 hover:bg-primary-600 hover:text-primary-100 flex items-center px-3 rounded-md text-primary-900"
                          : "bg-primary-300 hover:bg-primary-600 hover:text-primary-100 flex items-center px-3 rounded-md text-primary-900"
                      }`}
                    >
                      <span>Cancel profile editting</span>
                    </button>
                  </>
                ) : (
                  <>
                    <img
                      className="object-cover shadow-xl w-[15rem] mb-5 h-[15rem]"
                      src={`${
                        isImgEmpty
                          ? CDNURL + data.email + "/profile/" + imgName
                          : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                      }`}
                      alt="/"
                    />
                    <button
                      onClick={openEditProf}
                      className="bg-primary-300 hover:bg-primary-600 hover:text-primary-100 flex items-center px-3 rounded-full text-primary-900"
                    >
                      <FiUpload className="mr-1 text-xl" />
                      <span>Update profile picture</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <h1 className="text-2xl w-full text-center mt-4 font-semibold">
                Edit Schedule
              </h1>
              <div className="flex justify-between bg-green-700 p-2 text-white items-center w-full">
                <p className="ml-16">Days</p>
                <div className="flex items-center space-x-16 mr-16">
                  <p>Check in</p>
                  <p>Check out</p>
                </div>
              </div>
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-200 py-2 w-full my-3 px-10"
                >
                  <div className="flex items-center">
                    <label className="ml-2">
                      <input
                        type="checkbox"
                        checked={formData.sched[index].checked}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      <span className="ml-2">{day}</span>
                    </label>
                  </div>
                  {formData.sched[index].checked && (
                    <div key={index} className="flex items-center space-x-4">
                      <input
                        required
                        type="time"
                        name="startTime"
                        className="px-2 -mt-2 mb-2"
                        value={formData.sched[index].startTime}
                        onChange={(e) => handleSchedChange(e, index)}
                      />
                      <input
                        required
                        type="time"
                        name="endTime"
                        className="px-2 -mt-2 mb-2"
                        value={formData.sched[index].endTime}
                        onChange={(e) => handleSchedChange(e, index)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="col-span-2 w-full mt-3 mb-5 flex justify-center">
              <button
                type="submit"
                className="bg-green-700 transition duration-100 hover:bg-green-300 hover:text-green-900 px-10 py-1 text-lg text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditDoctorModal;

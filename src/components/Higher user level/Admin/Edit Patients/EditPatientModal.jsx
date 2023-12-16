import React, { useState, useRef, useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import UploadPic from "../Edit Doctors/UploadPic";
import { FiUpload } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { cardio } from "ldrs";
import supabase from "../../../config/Supabase";

cardio.register();

const EditPatientModal = ({
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
  //*getting inputs
  const [formData, setformData] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    address: "",
    bday: "",
  });
  const [phone, setPhone] = useState(data?.phone);
  //*Onchange function
  const handleChange = (e) => {
    setformData((prevForm) => {
      return {
        ...prevForm,
        [e.target.name]: e.target.value,
      };
    });
  };
  //*Autofill
  useEffect(() => {
    if (data) {
      setformData((prevForm) => {
        return {
          ...prevForm,
          fname: data.first_name,
          mname: data.middle_name,
          lname: data.last_name,
          email: data.email,
          address: data.address,
          bday: data.birthday,
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

  async function handleSubmit(e) {
    e.preventDefault();
    setload(true);
    const { error } = await supabase
      .from("profile")
      .update({
        first_name: formData.fname,
        middle_name: formData.mname,
        last_name: formData.lname,
        phone: phone,
        email: formData.email,
        address: formData.address,
        birthday: formData.bday,
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
        setOpenEdit(false)
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
                <label>First Name: </label>
                <input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Middle Name: </label>
                <input
                  type="text"
                  name="mname"
                  value={formData.mname}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Last Name: </label>
                <input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Email: </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Address: </label>
                <textarea
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Birth Date: </label>
                <input
                  type="date"
                  name="bday"
                  value={formData.bday}
                  onChange={handleChange}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
              <div className="flex flex-col">
                <label>Contact number: </label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.slice(0, 11))}
                  className="w-[75%] px-3 bg-slate-100 border-b-2 border-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-3 items-center">
              <div className="flex flex-col mt-8 text-center items-center w-full">
                <h1 className="mb-4 font-semibold text-xl">
                  Patient's Profile pic
                </h1>
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
            <div className="sticky bottom-0 bg-white col-span-2 w-full mt-3 mb-5 flex justify-center">
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

export default EditPatientModal;

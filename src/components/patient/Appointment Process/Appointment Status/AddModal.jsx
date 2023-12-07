import React from "react";
import UploadPic from "../../../Higher user level/Admin/Edit Doctors/UploadPic";
import { BsInfoCircle } from "react-icons/bs";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const AddModal = ({ setAddImg, payImg, data }) => {
  //*Close modal when clicked outside
  let addModal = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!addModal.current.contains(e.target)) {
        setAddImg(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setAddImg]);

  //*Upload function
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

  //*Onclick function
  //uploading funcion
  async function uploadImage(e) {
    setAddImg(false);
    e.preventDefault();
    const { error } = await supabase.storage
      .from("images")
      .upload(
        data.email + "/payment/" + data.book_id + "/" + uuidv4(),
        File[0]
      );

    try {
      if (error) throw error;
      else {
        window.location.reload()
      }
    } catch (error) {
      toast.error(error.message, { autoClose: false });
    }
  }
  return (
    <div className="absolute bg-black bg-opacity-40 backdrop-blur-sm w-full h-screen z-50 flex items-center justify-center">
      <div
        ref={addModal}
        className="bg-white sticky -mt-[8rem] flex w-fit  flex-col items-center abs rounded-lg p-6"
      >
        <>
          <div className="flex">
            <div className="flex flex-col items-center">
              <div className=" font-semibold text-left w-full text-xl mb-3">
                Add Another Screenshot
                <p className="text-base font-light text-primary mt-2">
                  Adding screenshot only gives you 2 attempts
                </p>
                <p className="text-base font-light mt-1">
                  You have{" "}
                  <span className="font-semibold">{3 - payImg.length}</span>{" "}
                  attempt/s left
                </p>
              </div>
              <UploadPic
                isSelected={isSelected}
                image={image}
                handleCancel={handleCancel}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                handleFile={handleFile}
                File={File}
              />
              <div className={`${isSelected ? ("flex items-center justify-between w-full space-x-2 mt-16"):("flex items-center justify-between w-full space-x-2 mt-3")}`}>
                <button
                  onClick={(e) => setAddImg(false) || e.preventDefault()}
                  className="w-full py-1 bg-slate-100 border-2 transition duration-100 hover:bg-slate-300 border-slate-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={uploadImage}
                  className="w-full py-1 bg-green-600 transition duration-100 hover:bg-green-800 text-white rounded-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default AddModal;

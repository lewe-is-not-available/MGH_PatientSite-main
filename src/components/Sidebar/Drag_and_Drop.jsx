import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import supabase from "../config/Supabase";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const Drag_and_Drop = ({
  closeProfileUpload,
  user,
  imgName,
  setUploaded,
  isImgEmpty,
}) => {
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
  //*Handle cancel
  const handleCancel = (e) => {
    e.preventDefault();
    setSelected(false);
    //preview image
    setImage(null);
    setFile(null);
  };
  //*Image uploading
  async function uploadImage() {
    closeProfileUpload();
    if (imgName) {
      if (isImgEmpty) {
        supabase.storage.from("images").remove([user.id + "/" + imgName]);
      }
      const { data, error } = await supabase.storage
        .from("images")
        .upload(user.id + "/" + uuidv4(), File[0]);
      if (error) {
        console.log(error);
      }
      if (data) {
        setUploaded(true);
        setSelected(false);
        setImage(null);
        setFile(null);
        toast.success("Succesfully uploaded", {
          toastId: "success",
        });
      }
    }
  }
  // <div className="uploads">
  //     <ul>
  //         {Array.from(File).map((file, idx) => <li key={idx}>{file.name}</li> )}
  //     </ul>
  //     <div className="actions">
  //         <button onClick={() => setFile(null)}>Cancel</button>
  //         <button>Upload</button>
  //     </div>
  // </div>
  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed z-50 inset-0 bg-opacity-30">
      <div className="abs fixed mt-44 bg-white w-[33rem] px-7 pb-4">
        <div className="flex w-full justify-center  items-center mt-4 -mr-3">
          <div className="w-full ml-10 flex justify-center">
            <p className="mt-2 font-semibold uppercase text-xl text-[#315E30]">
              Update Profile Picture
            </p>
          </div>
          <div className="flex justify-end">
            <IoClose
              onClick={closeProfileUpload}
              className="text-[40px] cursor-pointer text-slate-500 transition duration-100 hover:text-white hover:bg-slate-400 rounded-md p-1"
            />
          </div>
        </div>
        <div className="border-b-2 border-slate-300 w-full mt-3 mb-6" />
        {isSelected ? (
          <form
            onSubmit={(e) => uploadImage(e)}
            className="flex flex-col items-center"
          >
            <img
              className="object-cover mb-4 rounded-full items-center justify-center w-[23rem] h-[23rem]"
              src={image}
              alt="/"
            />
              <ul className="flex w-[90%]">
                <p className="font-semibold whitespace-nowrap mr-2">
                  File Name:{" "}
                </p>
                {Array.from(File).map((file, idx) => (
                  <li className="truncate" key={idx}>
                    {file.name}
                  </li>
                ))}
              </ul>
         
            <div className="border-b-2 border-slate-300 w-full mt-3 mb-6" />

            <div className="flex space-x-4 mb-4 mt-4">
              <button
                type="submit"
                className="focus:outline-none text-white bg-green-700
               hover:bg-green-800 transition duration-75 ease-in
                focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-5 py-2
                 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 
                aos-init aos-animate"
              >
                Upload
              </button>
              <button
                className="text-gray-900 bg-white border border-gray-300 focus:outline-none
               transition duration-75 ease-in hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 
               font-medium rounded-lg px-5 dark:bg-gray-800 dark:text-white dark:border-gray-600
                dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form className="flex items-center justify-center w-full">
            {/* Drop-Zone */}
            <label
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              accept="image/png, image/jpeg"
              className="flex flex-col mb-5 rounded-full items-center justify-center w-[23rem] h-[23rem] border-2
                     border-gray-300 border-dashed cursor-pointer bg-gray-50 transition duration-100 ease-in dark:hover:bg-bray-800
                    dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500
                    dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>

                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG or JPG
                </p>
              </div>

              {/* Image input */}
              <input
                id="dropzone-file"
                onChange={handleFile}
                accept="image/png, image/jpeg"
                type="file"
                className="hidden"
              />
            </label>
          </form>
        )}
      </div>
    </div>
  );
};

export default Drag_and_Drop;

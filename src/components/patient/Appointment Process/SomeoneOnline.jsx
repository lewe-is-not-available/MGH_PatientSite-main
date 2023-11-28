import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import ReCAPTCHA from "react-google-recaptcha";

const SomeoneF2f = ({
  formData,
  handleChange,
  disablePastDate,
  setFormData,
  openTerms,
  visible,
  visible1,
  setVisible1,
  setVisible,
  isOpen,
  isConfirmOpen,
  token,
  isSelected,
  image,
  handleCancel,
  handleDragOver,
  handleDrop,
  handleFile,
  File,
  onChange,
}) => {
  //*If Relation is Other
  const [isOtherRelation, setOtherRelation] = useState(false);
  const [otherSelect, setOtherSelect] = useState("");

  const handleOtherInput = (e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        Relation: e.target.value,
      };
    });
  };
  const handleOtherSelect = (e) => {
    setOtherSelect(e.target.value);
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        Relation: e.target.value,
      };
    });
  };
  useEffect(() => {
    if (otherSelect === "Other:") {
      setOtherRelation(true);
    } else {
      setOtherRelation(false);
    }
  }, [formData, otherSelect]);

  //*Aos animation
  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);
  return (
    <div
      data-aos="zoom-in-left"
      className="grid font-semibold text-left grid-cols-3 gap-5 px-8 mt-5"
    >
      <p>
        Patient's First Name: <br />
        <input
          type="text"
          name="Fname"
          autoComplete="on"
          onChange={handleChange}
          required
          className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p>
        Patient's Last Name: <br />
        <input
          name="Lname"
          autoComplete="on"
          onChange={handleChange}
          required
          className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p>
        Patient's Middle Name: <br />
        <input
          name="Mname"
          autoComplete="on"
          onChange={handleChange}
          className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p>
        Contact Number:
        <span className="lowercase font-thin text-sm text-green-800">
          (Input a number only)
        </span>
        <br />
        <input
          name="Number"
          autoComplete="on"
          defaultValue={formData.Number}
          type="number"
          onChange={handleChange}
          required
          className="outline-none rounded-md font-thin border-2 px-2 grid- border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p>
        Email:
        <span className="lowercase font-thin text-sm text-green-800"></span>
        <br />
        <input
          name="Gmail"
          autoComplete="on"
          defaultValue={formData.Gmail}
          type="text"
          onChange={handleChange}
          required
          className="outline-none rounded-md font-thin border-2 px-2 grid- border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p>
        Relation with patient: <br />
        <select
          name="Relation"
          autoComplete="on"
          onChange={handleOtherSelect}
          placeholder="Type your relation if other"
          required
          className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
        >
          <option></option>
          <option>Parent</option>
          <option>Guardian</option>
          <option>Sibling</option>
          <option>Caretaker</option>
          <option>Friend</option>
          <option>Partner</option>
          <option>Hudband/Wife</option>
          <option>Other:</option>
        </select>
        {isOtherRelation && (
          <input
            autoComplete="on"
            type="text"
            onChange={handleOtherInput}
            placeholder="type your relation"
            required
            className="outline-none rounded-md font-thin border-2 px-2 grid- border-slate-300 focus:border-[#71b967d3] w-full"
          />
        )}
      </p>
      <div className="flex w-1/2">
        <p>
          Patient's Date of Birth: <br />
          <input
            name="PatientBday"
            autoComplete="on"
            onChange={handleChange}
            className="outline-none border-2 w-44 font-thin px-2 h-9 rounded-lg border-slate-300 focus:border-[#71b967d3]"
            type="date"
            required
          />
        </p>
      </div>
      <div className="col-span-2">
        <p className="whitespace-normal ">Select Date of the appointment:</p>
        <input
          name="Date"
          autoComplete="on"
          onChange={handleChange}
          className="outline-none border-2 w-44 font-thin px-2 h-9 rounded-lg border-slate-300 focus:border-[#71b967d3]"
          type="date"
          required
          min={disablePastDate()}
        />
      </div>
      {!token && (
        <>
          <div className="col-span-3 flex -mb-7">
            <p className="font-thin text-base text-green-600 mb-3">
              We require you to register in our website in order for you to
              monitor your appointment status
            </p>
          </div>

          <div className="select-none">
            <label className="text-lg">Password</label>
            <div className="flex items-center">
              <input
                name="Pass"
                type={isOpen}
                autoComplete="on"
                onChange={handleChange}
                required
                className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
              />
              <div
                onClick={() => setVisible(!visible)}
                className="cursor-pointer -ml-7 text-[20px] "
              >
                {visible ? <PiEye /> : <PiEyeClosed />}
              </div>
            </div>
          </div>
          <p className="col-span-2 w-1/2">
            Confrim Password: <br />
            <div className="flex items-center select-none">
              <input
                name="Confirm_pass"
                type={isConfirmOpen}
                autoComplete="on"
                onChange={handleChange}
                required
                className="outline-none mt-1 rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
              />
              <div
                onClick={() => setVisible1(!visible1)}
                className="cursor-pointer -ml-7 text-[20px] "
              >
                {visible1 ? <PiEye /> : <PiEyeClosed />}
              </div>
            </div>
          </p>
        </>
      )}

      <p className="col-span-2 row-span-2 self-center">
        Your Brgy. or Municipality: <br />
        <textarea
          name="Address"
          autoComplete="on"
          value={formData.Address}
          onChange={handleChange}
          required
          className="outline-none border-2 font-thin px-2 h-28 rounded-md border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p className="col-span-3">
        Reason/s for booking an appointment: <br />
        <textarea
          name="Reason"
          autoComplete="off"
          onChange={handleChange}
          placeholder="Your message here"
          required
          className="outline-none border-2 font-thin px-3 py-2 h-56 rounded-md border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <p className="col-span-3 text-xl text-center">PAYMENT </p>
      <div className="col-span-3 items-center grid grid-cols-2 font-thin">
        <div className="flex flex-col items-center">
          <div className="flex">
            <span className="font-semibold">Step 1:</span> Scan the QR code to
            pay using Gcash
          </div>

          <div className="py-40 w-full place-content-center bg-slate-400 flex whitespace-nowrap text-white font-bold">
            QR code here
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex">
            <span className="font-semibold">Step 2:</span> Screenshot your
            payment receipt and upload here
          </div>
          {isSelected ? (
            <div className="flex flex-col items-center -mb-16">
              <img
                className="object-contain mb-4 rounded-md items-center justify-center w-full h-[20rem]"
                src={image}
                alt="/"
              />

              <ul className="flex">
                <p className="font-semibold whitespace-nowrap mr-2">
                  File name:{" "}
                </p>
                {Array.from(File).map((file, idx) => (
                  <li className="truncate" key={idx}>
                    {file.name}
                  </li>
                ))}
              </ul>

              <div className="flex space-x-4 mb-4">
                <button
                  className="text-gray-900 bg-white border border-gray-300 focus:outline-none
                                           transition duration-75 ease-in hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 
                                          font-medium rounded-lg px-5 dark:bg-gray-800 dark:text-white dark:border-gray-600
                                          dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={handleCancel}
                >
                  Choose another file
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              {/* Drop-Zone */}
              <label
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                accept="image/png, image/jpeg"
                className="flex flex-col mb-5 rounded-md items-center justify-center w-[80%] h-[21rem] border-2
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
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
            </div>
          )}
        </div>
      </div>
      <div className="col-span-3">
        <ReCAPTCHA
          sitekey="6Ld1th8pAAAAAPXTH0voBtx2Zser_ws8kWuSyVPJ"
          onChange={onChange}
        />
      </div>
      <div className="flex items-center mb-6 font-extralight whitespace-nowrap">
        <input
          id="default-checkbox"
          type="checkbox"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <label className="ml-2 text-sm">
          Terms and Condition{" "}
          <button onClick={openTerms} className="text-primary">
            Read More
          </button>
        </label>
      </div>
    </div>
  );
};

export default SomeoneF2f;

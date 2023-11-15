import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Consent from "./Consent";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { RotatingLines } from "react-loader-spinner";
import { AiOutlineCheckCircle } from "react-icons/ai";

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
  isRequested,
  ReqLoaded,
  isVerified,
  VerifyLoad,
  handleRequest,
  handleVerify,
  token
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
      {!token && (
        <div className="">
          <p>Verify Email: </p>
          <div className="flex item-center">
            <input
              name="confirmEmail"
              placeholder="OTP here"
              onChange={handleChange}
              autoComplete="on"
              required
              className="px-2 w-[6.4rem] rounded-md mr-2 h-8 text-slate-900 ring-1 ring-inset ring-gray-300
                        placeholder:text-gray-400 focus:ring-2 focus:outline-none focus:ring-inset focus:ring-indigo-600
                        sm:text-sm sm:leading-6"
            />

            {isRequested ? (
              ReqLoaded ? (
                <div className="flex items-center">
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="3"
                    animationDuration="0.75"
                    width="25"
                    visible={true}
                  />
                  <p className="text-xs ml-2">requesting</p>
                </div>
              ) : isVerified ? (
                VerifyLoad ? (
                  <div className="flex items-center">
                    <RotatingLines
                      strokeColor="grey"
                      strokeWidth="3"
                      animationDuration="0.75"
                      width="23"
                      visible={true}
                    />
                    <p className="text-xs ml-1">verifying</p>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-600">
                    <p>verified</p>
                    <AiOutlineCheckCircle />
                  </div>
                )
              ) : (
                <button
                  className="text-sm px-2 h-6 mt-1 transition duration-75 rounded-md text-[#102915]
                          hover:text-white hover:bg-[#78b673f8] bg-[#98dd93c4]"
                  onClick={handleVerify}
                >
                  Verify
                </button>
              )
            ) : (
              <button
                onClick={handleRequest}
                className="text-xs px-2 h-6 mt-1 transition duration-75 rounded-md text-[#102915]
                           hover:text-white hover:bg-[#78b673f8] bg-[#98dd93c4]"
              >
                Send OTP
              </button>
            )}
          </div>
        </div>
      )}

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
        <div className="ml-3 whitespace-nowrap">
          <p className="-ml-1">
            Patient's Age:
            <br />
          </p>
          <input
            name="PatientAge"
            type="number"
            autoComplete="on"
            required
            className="outline-none rounded-md font-thin w-20 border-2 px-2 border-slate-300 focus:border-[#71b967d3]"
          />
        </div>
      </div>
      <div>
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
        <div className=" w-full -mt-2">
          <label className="text-lg">
            Password
            <br />
            <p className="font-thin text-sm mb-3">
              We require you to register in our website in order for you to
              monitor your appointment
            </p>
          </label>
          <div className="flex items-center select-none">
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

          <br />
          <p className="">
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
        </div>
      )}

      <p className="col-span-2 row-span-2 self-center">
        Your Brgy. or Municipality: <br />
        <textarea
          name="Address"
          autoComplete="on"
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

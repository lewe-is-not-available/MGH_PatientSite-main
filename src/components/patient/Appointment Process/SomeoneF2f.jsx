import React, { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Consent from "./Consent";

const SomeoneF2f = ({
  formData,
  handleChange,
  disablePastDate,
  MedHistory,
  handleChecked,
  Condition,
  setCondition,
  handleOther,
  newItems,
  handleRemoveOther,
  openTerms,
  setFormData,
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
      <p className="col-span-2 w-1/2">
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
      <div className="flex w-1/2 col-span-2">
        <p>
          Patient's Date of Birth: <br />
          <input
            name="PatientBday"
            autoComplete="on"
            onChange={handleChange}
            className="outline-none border-2 w-44 font-thin px-2 h-9 rounded-l-lg border-slate-300 focus:border-[#71b967d3]"
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
      <label className="text-lg col-span-2">
        Medical History{" "}
        <span className="font-thin text-[15px] text-green-800">
          *If Applicable
        </span>
        <br />
        <p className="font-thin text-sm">
          Please select the conditions that the patient been diagnosed with
        </p>
      </label>
      <div className="grid col-span-3 grid-cols-3 w-[90%]">
        {MedHistory.map(({ value, label, id }) => {
          return (
            <div className="" key={id}>
              <div>
                <input
                  name="History"
                  id={id}
                  value={value}
                  onChange={handleChecked}
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded
                   focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800
                   focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label className="font-thin ml-2 text-green-950 text-sm">
                  {label}
                </label>
              </div>
            </div>
          );
        })}
        <div></div>
        <p className="col-span-3 bg-green-300 mt-3 mb-2 bg-opacity-30 px-3 py-2 rounded-lg">
          <span className="text-sm font-thin">
            {" "}
            If the condition is not included please type the medical condition
            here individually and click add
          </span>
          <input
            name="OtherCondition"
            autoComplete="on"
            value={Condition}
            onChange={(e) => setCondition(e.target.value)}
            className="outline-none rounded-md font-thin border-2 px-2 mt-2 border-slate-300 focus:border-[#71b967d3] w-1/3"
          />
          <button
            onClick={handleOther}
            className="font-thin px-2 ml-2 mr-2 bg-green-600 text-white rounded-lg border-2 border-green-700"
          >
            {" "}
            + Add
          </button>
          {newItems.map((Item) => (
            <button
              key={Item}
              onClick={(e) => handleRemoveOther(e, Item)}
              className="font-thin text-sm mx-2 mt-2 px-3 border- rounded-full text-white bg-green-700 bg-opacity-80"
            >
              {Item}
              <span className="text-green-200 ml-1">x</span>
            </button>
          ))}
        </p>
      </div>
      <p className="col-span-2 row-span-2">
        Your Address: <br />
        <textarea
          name="Address"
          autoComplete="on"
          onChange={handleChange}
          required
          className="outline-none border-2 font-thin px-2 h-28 rounded-md border-slate-300 focus:border-[#71b967d3] w-full"
        />
      </p>
      <div className="row-span-2">
        <div className="mb-6">
          <p>Select time of the appointment</p>
          <div className="flex space-x-5">
            <div className="font-thin mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
              <input
                className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid
                     border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full 
                     before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1]
                      after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] 
                      checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] 
                      checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] 
                      checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
                      focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)]
                      focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 
                      checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                   "
                type="radio"
                name="Time"
                autoComplete="off"
                onChange={handleChange}
                value="Morning"
                required
              />
              <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
                Morning
              </label>
            </div>
            <div className="font-thin mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
              <input
                className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none
                    rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none
                    before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent
                     before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] 
                     after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary
                     checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 
                     checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary
                     checked:after:bg-primary  checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] 
                     hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
                     focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] 
                     focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                     checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]
                     checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                type="radio"
                name="Time"
                autoComplete="off"
                onChange={handleChange}
                value="Afternoon"
                required
              />
              <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
                Afternoon
              </label>
            </div>
          </div>
        </div>
        <div>
          <p className="whitespace-normal">Select Date of the appointment:</p>
          <input
            name="Date"
            autoComplete="on"
            onChange={handleChange}
            className="outline-none border-2 w-44 font-thin px-2 h-9 rounded-l-lg border-slate-300 focus:border-[#71b967d3]"
            type="date"
            required
            min={disablePastDate()}
          />
        </div>
      </div>

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

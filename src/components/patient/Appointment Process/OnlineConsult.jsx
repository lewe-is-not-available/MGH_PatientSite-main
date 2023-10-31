import React, { useEffect, useState } from "react";
import doc from "../../images/doc.jpg";
import Aos from "aos";
import "aos/dist/aos.css";
import SomeoneF2f from "./SomeoneF2f";
import supabase from "../../config/Supabase";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OnlineConsult = ({ token }) => {
  //*Medical history checkboxes
  const MedHistory = [
    {
      id: "choice1",
      value: "Asthma",
      label: "Asthma",
    },
    {
      id: "choice2",
      value: "Diabetes",
      label: "Diabetes",
    },
    {
      id: "choice3",
      value: "Stroke",
      label: "Stroke",
    },
    {
      id: "choice4",
      value: "High Cholesterol",
      label: "High Cholesterol",
    },
    {
      id: "choice5",
      value: "Cancer",
      label: "Cancer",
    },
    {
      id: "choice6",
      value: "Heart Attack",
      label: "Heart Attack",
    },
    {
      id: "choice7",
      value: "Hypertension (High Blood)",
      label: "Hypertension (High Blood)",
    },
    {
      id: "choice8",
      value: "Thyroid Problems",
      label: "Thyroid Problems",
    },
  ];

  //*Reading checkbox values from medical history
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  function handleChecked(e) {
    const { value, checked } = e.target;

    if (checked) {
      if(!checkedBoxes.includes(newItems))
      setCheckedBoxes((pre) => [...pre, value]);
    } else {
      setCheckedBoxes((pre) => {
        return [...pre.filter((history) => history !== value)];
      });
    }
  }
  //*Other Medical Condition Function
  const [Condition, setCondition] = useState("");
  const [newItems, setNewItem] = useState([]);
  function handleOther(e) {
    e.preventDefault();
    //*if condition is empty
    if (Condition.trim()) {
      if (!newItems.includes(Condition)) {
        setCheckedBoxes((prev) => [...prev, Condition]);
        setNewItem((prev) => [...prev, Condition]);
        setCondition("");

      } else {
        toast.warning("Condition already exists.", {
          toastId: "duplicateCondition",
        });
      }
    }
  }
  
  //Removing the added item
  function handleRemoveOther(e, item) {
    e.preventDefault();
    setCheckedBoxes((pre) => {
      return [...pre.filter((i) => i !== item)];
    });
    setNewItem((pre) => {
      return [...pre.filter((i) => i !== item)];
    });
  }
  //*If booking for someone
  const [isSomeone, setSomeone] = useState(null);
  const [checkedSomeone, setChecked] = useState("No");
  const isChecked = (value) => value === checkedSomeone;

  const onSelect = ({ target: { value } }) => {
    setChecked(value);
  };
  useEffect(() => {
    if (checkedSomeone === "Yes") {
      setSomeone(true);
    }
    if (checkedSomeone === "No") {
      setSomeone(false);
    }
  }, [isSomeone, checkedSomeone]);
  //*For reading patient's form data
  const [formData, setFormData] = useState({
    Gmail: "",
    Fname: "",
    Lname: "",
    Mname: "",
    Address: "",
    Date: "",
    Time: "",
    Reason: "",
    Number: "",
    Relation: "",
    PatientBday: "",
    PatientAge: "",
  });
  //*Getting user's data

  useEffect(() => {
      if (isSomeone === false) {
        if (token) {
          setID(token.user.id);
          //to wait loading of token and avoid error
          setFormData((prevFormData) => ({
            //*automatically set the input values with user data
            ...prevFormData,
            Gmail: token.user.email,
            Fname: token.user.user_metadata.first_name,
            Lname: token.user.user_metadata.last_name,
            Mname: token.user.user_metadata.middle_name,
            Number: token.user.user_metadata.phone,
          }));
        }
      }
  }, [token, isSomeone]);
  const [userID, setID] = useState("");

  //*function to read user inputs
  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }
  //*After Submitting form data will be stored in supabase/database
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("Online_Appointments").insert([
      {
        user_id: userID,
        docname: Name,
        fname: formData.Fname,
        lname: formData.Lname,
        mname: formData.Mname,
        email: formData.Gmail,
        number: formData.Number,
        date: formData.Date,
        time: formData.Time,
        reason: formData.Reason,
        relation: formData.Relation,
        age: formData.PatientAge,
        bday: formData.PatientBday,
        someone: checkedSomeone,
        medicalhistory: checkedBoxes
      },
    ]);
    if (error) {
      console.log(error);
      toast.error(error, {
        toastId: "dataError",
      });
    }

    navigate("/");
    toast.success("Succesfully appointed", {
      toastId: "success",
    });
    toast.info("Please wait for booking confirmation.");
  };

  //*Doctor's Data
  const [Honor, setHonor] = useState("");
  const [Name, setName] = useState("");
  const [Special, setSpecial] = useState("");
  const [Sub, setSub] = useState("");
  const { id } = useParams();

  //*function for Doctor's Data to get from supabase
  useEffect(() => {
    const fetchDoctor = async () => {
      const { data, error } = await supabase
        .from("Dr information")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
      }
      if (data) {
        setHonor(data.Honorific);
        setName(data.Name);
        setSpecial(data.specialization);
        setSub(data.SubSpecial);
      }
    };
    fetchDoctor();
  }, [id]);

  //*To prevent user inputting past dates
  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };
  //*Aos animation
  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);
  return (
    <div className="back p-8 flex justify-between">
      <>
        <div
          data-aos="fade-up"
          className="text-center justify-center w-[16%] ml-52"
        >
          <img data-aos="fade-up" src={doc} className="px-5 py-3" alt="" />
          <p data-aos="fade-up" className="font-semibold">
            {Honor} {Name}
          </p>
          <p data-aos="fade-up">{Special}</p>
          <p data-aos="fade-up">{Sub} </p>
        </div>
      </>
      <div
        data-aos="fade-up"
        className="text-center mt-3 w-[58%] mr-52 text-[#315E30]"
      >
        <h1 className="text-5xl font-semibold">
          Fill up the form to proceed reservation{" "}
        </h1>

        <span className="text-4xl">(Online Consultation)</span>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-3 rounded-lg shadow-2xl mt-9"
        >
          <div className="flex flex-col items-start ml-9 mt-3">
            <p className="mb-2 font-semibold">
              Are you booking an appointment for someone?
            </p>
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
                  name="Someone"
                  autoComplete="off"
                  onChange={onSelect}
                  value="Yes"
                  required
                  checked={isChecked("Yes")}
                />
                <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
                  Yes
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
                  name="Someone"
                  autoComplete="off"
                  onChange={onSelect}
                  value="No"
                  required
                  checked={isChecked("No")}
                />
                <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
                  No
                </label>
              </div>
            </div>
          </div>
          <div>
            {isSomeone ? (
              <SomeoneF2f
                setFormData={setFormData}
                token={token}
                MedHistory={MedHistory}
                handleChecked={handleChecked}
                Condition={Condition}
                setCondition={setCondition}
                handleOther={handleOther}
                newItems={newItems}
                handleRemoveOther={handleRemoveOther}
                formData={formData}
                handleChange={handleChange}
                disablePastDate={disablePastDate}
              />
            ) : (
              <div
                data-aos="zoom-in-right"
                className="grid font-semibold text-left grid-cols-3 gap-5 px-8 mt-5"
              >
                <p>
                  First Name: <br />
                  <input
                    type="text"
                    name="Fname"
                    autoComplete="on"
                    value={formData.Fname}
                    required
                    disabled
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Last Name: <br />
                  <input
                    name="Lname"
                    autoComplete="on"
                    value={formData.Lname}
                    required
                    disabled
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Middle Name: <br />
                  <input
                    name="Mname"
                    autoComplete="on"
                    value={formData.Mname}
                    disabled
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Mobile Number:{" "}
                  <span className="lowercase font-thin text-sm text-green-800">
                    (Input a number only)
                  </span>{" "}
                  <br />
                  <input
                    name="Number"
                    autoComplete="on"
                    value={formData.Number}
                    type="number"
                    onChange={handleChange}
                    required
                    className="outline-none rounded-md font-thin border-2 px-2 grid- border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Gmail: <br />
                  <input
                    name="Gmail"
                    autoComplete="on"
                    value={formData.Gmail}
                    onChange={handleChange}
                    required
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>

                <label className="text-lg col-span-2">
                  Medical History{" "}
                  <span className="font-thin text-[15px] text-green-800">
                    *If Applicable
                  </span>
                  <br />
                  <p className="font-thin text-sm">
                    Please select the conditions that the patient been diagnosed
                    with
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
                      If the condition is not included please type the medical
                      condition here individually and click add
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
                    <p className="whitespace-normal ">
                      Select Date of the appointment:
                    </p>
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
                <div className="flex items-center mb-6 whitespace-nowrap">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                  />

                  <label className="ml-2 text-sm">
                    Do you accept giving us your detail?
                  </label>
                </div>
              </div>
            )}

            <div className="col-span-3 mb-6">
              <button
                type="submit"
                className="bg-[#418D3F] w-full py-1  font-semibold text-xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnlineConsult;

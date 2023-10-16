import React, { useEffect, useState } from "react";
import doc from "../images/doc.jpg";
import Aos from "aos";
import "aos/dist/aos.css";
import supabase from "../config/Supabase";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Face2face = ({ token }) => {
  //*For reading patient's form data
  const [formData, setFormData] = useState({
    Gmail: "",
    Fname: "",
    Lname: "",
    Mname: "",
    Address: "",
    Existing: "",
    Date: "",
    Time: "",
    Reason: "",
    Number: "",
  });
  //*Getting user's data
  const [userID, setID] = useState("");
  useEffect(() => {
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
  }, [token]);
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

    const { error } = await supabase.from("F2f Appointments").insert([
      {
        user_id: userID,
        fname: formData.Fname,
        lname: formData.Lname,
        mname: formData.Mname,
        email: formData.Gmail,
        number: formData.Number,
        date: formData.Date,
        time: formData.Time,
        reason: formData.Reason,
        existing: formData.Existing,
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
    toast.info("Please wait for booking confirmation in your email.");
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
    Aos.init({ duration: 1000 });
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

        <span className="text-4xl">(Face-to-face Consultation)</span>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-3 rounded-lg shadow-2xl mt-9"
        >
          <div
            data-aos="fade-up"
            className="grid font-semibold text-left grid-cols-3 gap-5 px-8 mt-5"
          >
            <p>
              First Name: <br />
              <input
                type="text"
                name="Fname"
                autoComplete="on"
                value={formData.Fname}
                onChange={handleChange}
                required
                className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
            <p>
              Last Name: <br />
              <input
                name="Lname"
                autoComplete="on"
                value={formData.Lname}
                onChange={handleChange}
                required
                className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
            <p>
              Middle Name: <br />
              <input
                name="Mname"
                autoComplete="on"
                value={formData.Mname}
                onChange={handleChange}
                className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
            <p>
              Mobile Number: <br />
              <input
                name="Number"
                autoComplete="on"
                value={formData.Number}
                onChange={handleChange}
                type="number"
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
            <div>
              <p>Are you an existing patient?</p>
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
                    name="Existing"
                autoComplete="off"
                    onChange={handleChange}
                    value="Yes"
                    required
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
                    name="Existing"
                autoComplete="off"
                    onChange={handleChange}
                    value="No"
                    required
                  />
                  <label className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer">
                    No
                  </label>
                </div>
              </div>
            </div>
            <p className="col-span-2">
              Your Address: <br />
              <textarea
                name="Address"
                autoComplete="on"
                onChange={handleChange}
                required
                className="outline-none border-2 font-thin px-2 h-10 rounded-md border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
            <div>
              <p className="whitespace-normal ">
                Select Date and time of appointment:
              </p>
              <input
                name="Date"
                autoComplete="on"
                onChange={handleChange}
                className="outline-none border-2 font-thin px-2 h-9 rounded-l-lg border-slate-300 focus:border-[#71b967d3]"
                type="date"
                required
                min={disablePastDate()}
              />
              <input
                name="Time"
                autoComplete="on"
                onChange={handleChange}
                type="time"
                required
                className="outline-none border-2 font-thin px-2 h-9 rounded-r-lg border-l-0 border-slate-300 focus:border-[#71b967d3]"
              />
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
            <div className="flex items-center">
              <input
                id="default-checkbox"
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                required
              />

              <label className="ml-2 text-sm font-">
                Do you accept giving us your detail?
              </label>
            </div>
            <div className="col-span-3 mb-6">
              <button
                type="submit"
                className="bg-[#418D3F] w-full py-1 font-semibold text-xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
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

export default Face2face;

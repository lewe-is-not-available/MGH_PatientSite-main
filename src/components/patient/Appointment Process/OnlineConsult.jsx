import React, { useEffect, useState } from "react";
import doc from "../../images/doc.jpg";
import Aos from "aos";
import "aos/dist/aos.css";
import SomeoneF2f from "./SomeoneOnline";
import supabase from "../../config/Supabase";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { RotatingLines } from "react-loader-spinner";
import { AiOutlineCheckCircle } from "react-icons/ai";

const OnlineConsult = ({ openTerms, token }) => {
  //*make pass visible or not
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const isOpen = visible ? "text" : "password";
  const isConfirmOpen = visible1 ? "text" : "password";

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
    Pass: "",
    Confirm_pass: "",
  });

  //*Request OTP
  const email = formData.Gmail;
  const [ReqLoaded, setReqLoaded] = useState(true);
  const [isRequested, setisRequested] = useState(false);
  const handleRequest = async (e) => {
    e.preventDefault();
    setisRequested(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      console.log(error);
      setisRequested(false);
    } else {
      setReqLoaded(false);
    }
  };

  //*Verify Email from 6 digit code
  const [VerifyLoad, setVerifyLoad] = useState(true);
  const [isVerified, setisVerified] = useState(false);
  //console.log(isVerified);
  const otpToken = formData.confirmEmail;
  const handleVerify = async (e) => {
    e.preventDefault();
    setisVerified(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      otpToken,
      type: "email",
    });
    if (error) {
      setisVerified(false);
    } else {
      setVerifyLoad(false);
      //setOTP(session.provider_token);
    }
  };
  //*Getting user's data
  useEffect(() => {
    if (token) {
      if (isSomeone === false) {
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

    //*Compare pass and confirm pass if similar
    if (!token) {
      if (formData.Pass !== formData.Confirm_pass) {
        toast.error("Your password doesn't match", {
          toastId: "dataError",
        });
        return;
      }
    }
    if (token) {
      const { error } = await supabase.from("Patient_Appointments").insert([
        {
          user_id: userID,
        },
      ]);
    }
    const { error } = await supabase.from("Patient_Appointments").insert([
      {
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
        honorific: Honor,
        type: "ol",
        status: "pending",
      },
    ]);
    if (error) {
      console.log(error);
      toast.error(error, {
        toastId: "dataError",
      });
    }
    if (!token) {
      if (isVerified) {
        const { error } = await supabase.auth.signUp({
          email: formData.Gmail,
          password: formData.Pass,
          sendOtp: true,
          options: {
            data: {
              first_name: formData.Fname,
              last_name: formData.Lname,
              middle_name: formData.Mname,
              phone: formData.Phone,
              birth_date: formData.PatientBday,
              role: "patient",
            },
          },
        });

        if (error) {
          toast.error(error);
        } else {
          toast.info("veirification sent in your email.");
        }
      } else {
        e.preventDefault();
        toast.error("Please finish the verification first");
      }
    }

    navigate("/");
    toast.success("Succesfully appointed", {
      toastId: "success",
    });
    toast.info("Please wait for booking and scheduling confirmation.");
  };
  //*Doctor's Data
  const [Honor, setHonor] = useState("");
  const [Name, setName] = useState("");
  const [Special, setSpecial] = useState("");
  const [Sub, setSub] = useState("");
  const { id } = useParams();

  //*function for Doctor's Data to get from supabase

  const fetchDoctor = async () => {
    const { data, error } = await supabase
      .from("Dr_information")
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
  //*REAL TIME DOCTOR DATA
  useEffect(() => {
    fetchDoctor();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Dr_information" },
        () => {
          fetchDoctor();
        }
      )
      .subscribe();
  }, []);
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
                openTerms={openTerms}
                setFormData={setFormData}
                visible={visible}
                visible1={visible1}
                setVisible1={setVisible1}
                setVisible={setVisible}
                isOpen={isOpen}
                isConfirmOpen={isConfirmOpen}
                formData={formData}
                handleChange={handleChange}
                isRequested={isRequested}
                ReqLoaded={ReqLoaded}
                isVerified={isVerified}
                VerifyLoad={VerifyLoad}
                handleVerify={handleVerify}
                handleRequest={handleRequest}
                disablePastDate={disablePastDate}
                token={token}
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
                    value={formData.Fname}
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    disabled={token}
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Last Name: <br />
                  <input
                    name="Lname"
                    value={formData.Lname}
                    onChange={handleChange}
                    autoComplete="on"
                    required
                    disabled={token}
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Middle Name: <br />
                  <input
                    name="Mname"
                    value={formData.Mname}
                    onChange={handleChange}
                    autoComplete="on"
                    disabled={token}
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
                    type="number"
                    value={formData.Number}
                    onChange={handleChange}
                    required
                    disabled={token}
                    className="outline-none rounded-md font-thin border-2 px-2 grid- border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                <p>
                  Gmail: <br />
                  <input
                    name="Gmail"
                    autoComplete="on"
                    onChange={handleChange}
                    value={formData.Gmail}
                    disabled={token}
                    required
                    className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full"
                  />
                </p>
                {!token && (
                  <div className="row-span-2">
                    <div className="mb-3">
                      <p>Verify Email: </p>
                      <div className="flex item-center">
                        <input
                          autoComplete="off"
                          type="number"
                          name="confirmEmail"
                          placeholder="OTP here"
                          onChange={handleChange}
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
                  </div>
                )}
                {!token && (
                  <div className="flex w-1/2">
                    <p>
                      Your Date of Birth: <br />
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
                        Your Age:
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
                )}

                <div className="">
                  <p className="whitespace-normal ">
                    Select Date of the appointment:
                  </p>
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
                    <div className="flex flex-col select-none">
                      <label className="text-lg">
                        Password
                        <br />
                      </label>
                      <div className="flex items-center w-full">
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
                    <div className="flex justify-end flex-col">
                      <div className="">
                        Confrim Password:
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
                      </div>
                    </div>
                    <p className="font-thin text-sm col-span-3 -mt-3">
                      *We require you to register in our website in order for
                      you to monitor your appointment
                    </p>
                  </>
                )}

                <p className="col-span-2 row-span-2">
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

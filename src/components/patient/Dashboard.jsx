import React, { useEffect, useState } from "react";
import SearchRes from "../SearchResult";
import Specials from "../Specials.json";
import SubSpecial from "../SubSpecial.json";
import supabase from "../config/Supabase";
import Aos from "aos";
import "aos/dist/aos.css";
import online from "../images/dashboard_icons/online.png";
import f2f from "../images/dashboard_icons/f2f.png";
import contact from "../images/dashboard_icons/contact.png";
import feedback from "../images/dashboard_icons/feedback.png";
import history from "../images/dashboard_icons/history.png";
import status from "../images/dashboard_icons/status.svg";
import { Link, useNavigate } from "react-router-dom";
import Admin from "../Higher user level/Admin/AdminDashboard";
import Doc_Dash from "../Higher user level/Doctor/DoctorPage";

const Dashboard = ({ isAdmin, isDoctor, isPatient, token }) => {
  //*Role Based components
  const [loading, setLoading] = useState(true);
  const [patient, setPatient] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [doctor, setDoctor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.from("profile").select("*").single();
      setLoading(false);
      if (data.role === "admin") {
        setAdmin(true);
      } else if (data.role === "patient") {
        setPatient(true);
      } else if (data.role === "doctor") {
        setDoctor(true);
      } else {
        navigate("/Dashboard");
      }
    };
    fetchAdmin();
  }, []);
  //*For Search window drop function
  const [Show, FetchShow] = useState(null);
  const Close = () => FetchShow(false);
  //*Search and reset Function
  const [Name, setName] = useState("");
  const [spSelect, setSpSelect] = useState();
  const [subSelect, setSubSelect] = useState();
  const [Doctors, setDoctors] = useState(null);
  const [noResult, setNoResult] = useState(false);
  const [Hmo, setHmo] = useState();
  const [Filter, setFilter] = useState([]);

  //*select option value
  if (spSelect === "---") {
    setSpSelect("");
  }
  if (subSelect === "---") {
    setSubSelect("");
  }
  //TODO: continue the filteration
  const [showFill, setShowFill] = useState(true);
  useEffect(() => {
    const fetchFilter = async () => {
      const { data, error } = await supabase.from("Dr information").select("*");
      if (error) {
        console.error("Failed to fetch", error.message);
      } else {
        const nameSuggest = data.filter((doctor) =>
          doctor.Name.toLowerCase().includes(Name.toLowerCase())
        );
        setFilter(nameSuggest);
        if (Name === "") {
          setFilter("");
        }
      }
    };
    fetchFilter();
  }, [Name]);
  const handleNameFilterClick = (clickedName) => {
    setName(clickedName);
    setShowFill(false);
  };
  useEffect(() => {
    setShowFill(true);
  }, [Name]);

  const handleReset = async () => {
    setName("");
    setSpSelect("---");
    setSubSelect("---");
    setHmo("");

    const { data, error } = await supabase.from("Dr information").select("*");

    if (error) {
      console.error("Failed to fetch", error.message);
    }
    setDoctors(data);
    setNoResult(false);
  };

  const handleSearch = async () => {
    FetchShow(true);
    if (!Name && !spSelect && !subSelect && !Hmo) {
      setNoResult(true);
      setDoctors(null);
    } else {
      setNoResult(false);

      const { data, error } = await supabase.from("Dr information").select("*");

      if (error) {
        console.error("Error searching for data:", error.message);
        return;
      }
      const filteredData = data.filter((doctor) => {
        const nameMatch = Name
          ? doctor.Name.toLowerCase().includes(Name.toLowerCase())
          : true;
        const specMatch = spSelect
          ? doctor.specialization.toLowerCase().includes(spSelect.toLowerCase())
          : true;
        const subSpecMatch = subSelect
          ? doctor.SubSpecial.toLowerCase().includes(subSelect.toLowerCase())
          : true;
        const HmoMatch = Hmo
          ? doctor.SubSpecial.toLowerCase().includes(subSelect.toLowerCase())
          : true;
        return nameMatch && specMatch && subSpecMatch && HmoMatch;
      });
      setDoctors(filteredData);
      if (filteredData.length === 0) {
        setNoResult(true);
        setDoctors("");
      } else {
        setNoResult(false);
      }
    }
  };

  // Aos useEffect
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <section className="back flex flex-col items-center">
      <div
        className="hero5 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p className="text-5xl font-semibold uppercase" data-aos="fade-up">
          Dashboard
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Have a look at what you can do in our website
        </p>
      </div>

      {/* feautures */}
      <h1
        className="text-4xl font-semibold text-[#315E30] mt-16 mb-14"
        data-aos="fade-up"
      >
        Feautures
      </h1>
      {patient && (
        <>
          {" "}
          <div className="flex justify-center mb-20">
            <div className="grid place-items-center grid-cols-3 gap-x-20 gap-y-16 w-full">
              {/* Online consult */}
              <div className="boxes" data-aos="fade-up">
                <img src={online} alt="/" className="imgDash p-5" />
                <Link to="/Appointment/Online" className="titleText">
                  Online Consult
                </Link>
                <p className="text-sm">
                  Book an appointment for online consult
                </p>
              </div>
              {/* Face to face consult */}
              <div className="boxes" data-aos="fade-up">
                <img src={f2f} alt="/" className="imgDash object-left p-3" />
                <Link to="/Appointment/F2f" className="titleText">
                  Face to face Consult
                </Link>
                <p className="text-sm">
                  Book an appointment for Face to face consult
                </p>
              </div>
              {/* Contact us */}
              <div className="boxes" data-aos="fade-up">
                <img src={contact} alt="/" className=" imgDash p-5 py-8" />
                <Link to="/Contacts" className="titleText">
                  Contact Us!
                </Link>
                <p className="text-sm">Book an for online appointment</p>
              </div>
              {/* Feedback form */}
              <div className="boxes" data-aos="fade-up">
                <img src={feedback} alt="/" className="imgDash p-5" />
                <Link to="/Feedback-Form" className="titleText">
                  Feedback form
                </Link>
                <p className="text-sm">
                  Let us know what you think of our website
                </p>
              </div>
              {/* Consult history */}
              <div className="boxes" data-aos="fade-up">
                <img src={history} alt="/" className="imgDash p-7" />
                <Link to="/Online_Consultation_History" className="titleText">
                  Consultation History
                </Link>
                <p className="text-sm">
                  Have a look at your recent online consultations
                </p>
              </div>
              {/* Appointment status */}
              <div className="boxes" data-aos="fade-up">
                <img src={status} alt="/" className="imgDash p-4" />
                <Link to="/Appointment/Status" className="titleText">
                  Appointment status
                </Link>
                <p className="text-sm">Keep track of your appointment status</p>
              </div>
            </div>
          </div>
          {/* find a doctor */}
          <div className="mb-20">
            <div className="flex flex-col items-center">
              <h1
                className="text-4xl font-semibold text-[#315E30] mb-10"
                data-aos="fade-up"
              >
                Find a Doctor
              </h1>
              {/* Search box with filteration */}
              <div
                className="find bg-white flex flex-col p-10 pb-8"
                data-aos="zoom-in-up"
              >
                <div className="flex flex-col items-center space-y-4">
                  <table>
                    <thead
                      data-aos="fade-up"
                      data-aos-anchor-placement="top-bottom"
                    >
                      <tr>
                        <td className="text-xl text-[#315E30] pb-3">
                          Doctor's Name
                        </td>
                        <td className="text-xl text-[#315E30] pb-3">
                          Specialization
                        </td>
                        <td className="text-xl text-[#315E30] pb-3">
                          Sub-Specialization
                        </td>
                        <td className="text-xl text-[#315E30] pb-3">
                          HMO Accredation
                        </td>
                      </tr>
                    </thead>
                    <tbody
                      data-aos="fade-up"
                      data-aos-anchor-placement="top-bottom"
                    >
                      <tr>
                        <td>
                          <input
                            type="text"
                            placeholder="Enter Name"
                            className="py-1 mr-6 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
                        focus:border-b-[#315E30]"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </td>

                        <td>
                          <div className="flex mr-10">
                            {/* Specialization Dropdown */}
                            <select
                              className="w-44 py-1 duration-100 border-b-2 focus:outline-[#315E30]"
                              value={spSelect}
                              onChange={(e) => setSpSelect(e.target.value)}
                            >
                              {Specials.map((Spec) => {
                                return (
                                  <option key={Spec.id}>
                                    {Spec.Specialization}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div className="flex mr-10">
                            {/* Sub-Specialization Dropdown */}
                            <select
                              id="finddoctor-form-subspec"
                              value={subSelect}
                              onChange={(e) => setSubSelect(e.target.value)}
                              className="w-44 py-2 duration-100 border-b-2 border-siteGreen-darker"
                            >
                              <option key="">---</option>
                              {SubSpecial.map((subspec) => {
                                return (
                                  <option key={subspec.id}>
                                    {subspec.SubSpecialization}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </td>
                        <td>
                          {/* Hmo input */}
                          <input
                            type="text"
                            value={Hmo}
                            onChange={(e) => setHmo(e.target.value)}
                            placeholder="Enter Accredation"
                            className="py-2 pr-8 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
              focus:border-b-[#315E30]"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    type="submit"
                    data-aos-anchor-placement="top-bottom"
                    data-aos="fade-up"
                    onClick={handleSearch}
                    className="bg-[#418D3F] w-2/5 py-1 font-semibold text-xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
                  >
                    SEARCH
                  </button>
                  <button
                    data-aos-anchor-placement="top-bottom"
                    data-aos="fade-up"
                    onClick={handleReset}
                    className="text-[#267124] text-lg"
                  >
                    reset
                  </button>
                </div>
              </div>
              <div className={`${Show ? "show" : "hide"}`}>
                <div className="searchbg rounded-xl pl-10 py-14 pr-[4.2rem] pt-12 bg mt-8 flex">
                  {/* {fetchError && <p>{fetchError}</p>} */}
                  {noResult && (
                    <p className="grid grid-flow-col gap-x-12">
                      No results found
                    </p>
                  )}
                  {Doctors && (
                    <div className="Doctors overflow-x-scroll w-[73rem] grid grid-flow-col gap-x-12">
                      {Doctors.map((Doctors) => (
                        <SearchRes key={Doctors.id} Doctors={Doctors} />
                      ))}
                    </div>
                  )}
                  <button
                    onClick={Close}
                    className="
            text-base text-slate-400 bg-slate-200 px-1 w-[27px] h-full rounded-full -ml-1 -mt-[35px] -mr-14
            transition duration-75 ease-in hover:bg-slate-300 hover:text-slate-500 hover:border-slate-400 border-2"
                  >
                    X
                  </button>
                </div>
              </div>
              {/* // TODO: ADD FILTER */}
              {showFill && Filter.length > 0 && (
                <div className="absolute abs w-48 flex flex-wrap text-sm bg-white z-50 mr-[652px] mt-[195px]">
                  {Filter.map((Filter) => (
                    <li
                      onClick={() => handleNameFilterClick(Filter.Name)}
                      className="list-none px-2 my-1 cursor-pointer w-full hover:bg-primary hover:text-white"
                      key={Filter.id}
                    >
                      {Filter.Name}
                    </li>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {admin && <Admin />}
      {doctor && <Doc_Dash />}
    </section>
  );
};

export default Dashboard;

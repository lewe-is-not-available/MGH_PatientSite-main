import React, { useEffect, useState } from "react";
import SearchPaginated from "../Doctor read/SearchPaginated";
import Specials from "../Specials.json";
import SubSpecial from "../SubSpecial.json";
import supabase from "../config/Supabase";
import Aos from "aos";
import "aos/dist/aos.css";
import online from "../images/dashboard_icons/online.png";
import f2f from "../images/dashboard_icons/f2f.png";
import contact from "../images/dashboard_icons/contact.png";
import history from "../images/dashboard_icons/history.png";
import status from "../images/dashboard_icons/status.svg";
import { Link } from "react-router-dom";
import Admin from "../Higher user level/Admin/AdminDashboard";
import DocDash from "../Higher user level/Doctor/DoctorPage";

const Dashboard = ({ token, showLogin, patient, admin, doctor, user }) => {
  const [Loaded, setLoaded] = useState(true);
  //TODO: Show dashboard even if logged out but link them to open modal
  //*For Search window drop function
  const [Show, FetchShow] = useState(null);
  const Close = () => FetchShow(false);
  //*Search and reset Function
  const [Name, setName] = useState("");
  const [spSelect, setSpSelect] = useState("");
  const [subSelect, setSubSelect] = useState("");
  const [Doctors, setDoctors] = useState(null);
  const [noResult, setNoResult] = useState(false);
  const [type, setType] = useState("");
  const [Filter, setFilter] = useState([]);

  //*select option value
  if (spSelect === "---") {
    setSpSelect("");
  }
  if (subSelect === "---") {
    setSubSelect("");
  }
  if (type === "---") {
    setType("");
  }
  //TODO: continue the filteration
  const [showFill, setShowFill] = useState(true);

  useEffect(() => {
    const fetchFilter = async () => {
      const { data, error } = await supabase.from("dr_information").select("*");
      if (error) {
        console.error("Failed to fetch", error.message);
      } else {
        if (data) {
          var filteredSuggest = data.filter((doctor) => {
            var nameMatch = Name
              ? doctor.name.toLowerCase().includes(Name.toLowerCase())
              : false;

            return nameMatch;
          });
          setFilter(filteredSuggest);
        }

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
  function handleNameChange(e) {
    setName(e.target.value);
    setShowFill(true);
  }

  const handleReset = async () => {
    setName("");
    setSpSelect("---");
    setSubSelect("---");
    setType("");

    const { data, error } = await supabase.from("dr_information").select("*");

    if (error) {
      console.error("Failed to fetch", error.message);
    }
    setDoctors(data);
    setNoResult(false);
  };

  const handleSearch = async () => {
    FetchShow(true);
    if (!Name && !spSelect && !subSelect && !type) {
      setNoResult(true);
      setDoctors(null);
    } else {
      setNoResult(false);

      const { data, error } = await supabase.from("dr_information").select("*");

      if (error) {
        console.error("Error searching for data:", error.message);
        return;
      }
      const filteredData = data.filter((doctor) => {
        const nameMatch = Name
          ? doctor.name.toLowerCase().includes(Name.toLowerCase())
          : true;
        const specMatch = spSelect
          ? doctor.specialization.toLowerCase().includes(spSelect.toLowerCase())
          : true;
        const subSpecMatch = subSelect
          ? doctor.subspecial.toLowerCase().includes(subSelect.toLowerCase())
          : true;
        const typeMatch = type
          ? doctor.type
              .toLowerCase()
              .includes(type === "Face to Face Consult" ? "f2f" : "ol")
          : true;
        return nameMatch && specMatch && subSpecMatch && typeMatch;
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
    Aos.init({ duration: 500 });
  }, []);

  return (
    <section className="back flex flex-col items-center">
      <div
        className="hero5 p-28 py-28 max-sm:px-10 max-sm:py-14 max-sm:space-y-4 flex flex-col
         items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p
          className="text-5xl max-sm:text-3xl font-semibold uppercase"
          data-aos="fade-up"
        >
          Dashboard
        </p>
        <p className="text-3xl max-sm:text-lg font-light" data-aos="fade-up">
          Have a look at what you can do in our website
        </p>
      </div>
      {(patient || !token) && (
        <div className="mt-20 flex flex-col items-center">
          {/* find a doctor */}
          <h1
            className="text-[34px] font-semibold text-[#315E30] mb-4"
            data-aos="fade-up"
          >
            Find a Doctor
          </h1>
          <div className="flex flex-col items-center">
            {/* Search box with filteration */}
            <div
              className="find bg-white flex items-center search_box flex-col px-10 outbox py-8 rounded-md"
              data-aos="zoom-in-up"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="grid grid-cols-4 containtsearch">
                  <div className="text-xl text-[#315E30]">
                    <p className="search_label">Doctor's Name</p>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="py-1 mr-6 serachInput bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
                        focus:border-b-[#315E30]"
                      value={Name}
                      onChange={handleNameChange}
                    />
                    {showFill && Filter && (
                      <div className="absolute abs w-48 flex flex-wrap text-sm bg-white z-50">
                        {Filter.map((Filter) => (
                          <li
                            onClick={() => handleNameFilterClick(Filter.name)}
                            className="list-none px-2 my-1 cursor-pointer w-full hover:bg-primary hover:text-white"
                            key={Filter.id}
                          >
                            {Filter.name}
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xl text-[#315E30]">
                    <p className="search_label">Specialization</p>
                    <div className="flex mr-10">
                      {/* Specialization Dropdown */}
                      <select
                        className="w-44 py-2 serachInput duration-100 border-b-2 focus:outline-[#315E30]"
                        value={spSelect}
                        onChange={(e) => setSpSelect(e.target.value)}
                      >
                        {Specials.map((Spec) => {
                          return (
                            <option key={Spec.id}>{Spec.Specialization}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="text-xl text-[#315E30]">
                    <p className="search_label">Sub-Specialization</p>
                    <div className="flex mr-10">
                      {/* Sub-Specialization Dropdown */}
                      <select
                        id="finddoctor-form-subspec"
                        value={subSelect}
                        onChange={(e) => setSubSelect(e.target.value)}
                        className="w-44 py-2 serachInput duration-100 border-b-2 focus:outline-[#315E30]"
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
                  </div>
                  <div className="text-xl text-[#315E30]">
                    <p className="search_label">Consultation Type</p>
                    {/* Hmo input */}
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="py-2 pr-8 serachInput w-44 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
              focus:border-b-[#315E30]"
                    >
                      <option id="0">---</option>
                      <option id="1">Face to Face Consult</option>
                      <option id="2">Online Consult</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  data-aos-anchor-placement="top-bottom"
                  data-aos="fade-up"
                  onClick={handleSearch}
                  className="bg-[#418D3F] searchbutton w-2/5 py-1 font-semibold text-xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
                >
                  SEARCH
                </button>
                <button
                  data-aos-anchor-placement="top-bottom"
                  data-aos="fade-up"
                  onClick={handleReset}
                  className="text-[#267124] resetbutton text-lg"
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
                  <div className="Doctors">
                    <SearchPaginated
                      Doctors={Doctors}
                      Loaded={Loaded}
                      setLoaded={setLoaded}
                    />
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
          </div>
        </div>
      )}

      {/* feautures */}
      <h1
        className="text-4xl font-semibold text-[#315E30] mt-16 mb-14"
        data-aos="fade-up"
      >
        Features
      </h1>
      {patient || !token ? (
        <>
          <div className="flex justify-center mb-20">
            <div className="grid place-items-center grid-cols-3 features gap-10 w-full">
              {/* Online consult */}
              <Link
                to="/Appointment/Online"
                className="boxes"
                data-aos="fade-up"
                id="trigger"
              >
                <img src={online} alt="/" className="imgDash p-5" />
                <div className="titleText">Online Consult</div>
                <p>Book an appointment for online consult</p>
              </Link>
              {/* Face to face consult */}
              <Link to="/Appointment/F2f" className="boxes" data-aos="fade-up">
                <img src={f2f} alt="/" className="imgDash object-left" />
                <div className="titleText">Face to face Consult</div>
                <p>Book an appointment for Face to face consult</p>
              </Link>
              {/* Appointment status */}
              {!token ? (
                <div
                  onClick={showLogin}
                  className="boxes"
                  data-aos-anchor="#trigger"
                  data-aos="fade-up"
                >
                  <img src={status} alt="/" className="imgDash p-4" />
                  <div className="titleText">Appointment status</div>
                  <p>Keep track of your appointment status</p>
                </div>
              ) : (
                <Link
                  to="/Appointment/Status"
                  className="boxes"
                  data-aos="fade-up"
                  data-aos-anchor="#trigger"
                >
                  <img src={status} alt="/" className="imgDash p-4" />
                  <div className="titleText">Appointment status</div>
                  <p>Keep track of your appointment status</p>
                </Link>
              )}
              <div className="grid grid-cols-2 col-span-3 gap-x-10 w-full">
                {/* Contact us */}
                <Link
                  to="/Contacts"
                  className="BottomBox"
                  data-aos-anchor="#trigger"
                  data-aos="fade-up"
                >
                  <img
                    src={contact}
                    alt="/"
                    className=" imgDashBottom  px-24 py-8 max-[425px]:py-5"
                  />
                  <div className="titleText">Contact Us!</div>
                  <p>Need to give us a message? Feel free to contact us.</p>
                </Link>
                {/* Consult history */}
                {!token ? (
                  <div
                    onClick={showLogin}
                    className="BottomBox"
                    data-aos-anchor="#trigger"
                    data-aos="fade-up"
                  >
                    <img
                      src={history}
                      alt="/"
                      className="imgDashBottom px-24 py-7"
                    />
                    <div className="titleText">Consultation History</div>
                    <p>Have a look at your recent online consultations</p>
                  </div>
                ) : (
                  <Link
                    to="/Online_Consultation_History"
                    className="BottomBox"
                    data-aos="fade-up"
                    data-aos-anchor="#trigger"
                  >
                    <img
                      src={history}
                      alt="/"
                      className="imgDashBottom px-24 py-7"
                    />
                    <div className="titleText">Consultation History</div>
                    <p>Have a look at your recent online consultations</p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {admin && <Admin />}
      {doctor && <DocDash user={user} token={token}/>}
    </section>
  );
};

export default Dashboard;

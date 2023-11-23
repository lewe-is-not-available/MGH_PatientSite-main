import React, { useEffect, useState } from "react";
import supabase from "../config/Supabase";
import DocUniq from "./Appointment Process/DoctorsF2f";
import Specials from "../Specials.json";
import SubSpecial from "../SubSpecial.json";
import Aos from "aos";
import "aos/dist/aos.css";

const F2f = ({ token, isPatient }) => {
  //TODO: Fix filter and suggestion drop
  //TODO: add sign in
  //TODO: Pagination

  //Search and reset Function
  const [Name, setName] = useState("");
  const [spSelect, setSpSelect] = useState("");
  const [subSelect, setSubSelect] = useState();
  const [Doctors, setDoctors] = useState(null);
  const [Filter, setFilter] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [Hmo, setHmo] = useState();

  //select option value
  if (spSelect === "---") {
    setSpSelect("");
  }
  if (subSelect === "---") {
    setSubSelect("");
  }

  const [showFill, setShowFill] = useState(true);
  useEffect(() => {
    const fetchFilter = async () => {
      const { data, error } = await supabase.from("Dr_information").select("*");
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

  //DEFAULT DATA
  const fetchDoc = async () => {
    const { data, error } = await supabase.from("Dr_information").select("*");

    if (error) {
      setDoctors(null);
      console.log(error);
    }
    if (data) {
      return setDoctors(data);
    }
  };

  //REAL TIME DOCTOR DATA
  useEffect(() => {
    fetchDoc();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Dr_information" },
        () => {
          fetchDoc();
        }
      )
      .subscribe();
  }, []);
  // RESET FUNCTION
  const handleReset = async () => {
    setName("");
    setSpSelect("---");
    setSubSelect("---");
    setHmo("");

    const { data, error } = await supabase.from("Dr_information").select("*");

    if (error) {
      console.error("Failed to fetch", error.message);
    }
    setDoctors(data);
    setNoResult(false);
  };

  //SEARCH FUNCTION
  const handleSearch = async () => {
    if (!Name && !spSelect && !subSelect && !Hmo) {
      setNoResult(true);
    } else {
      setNoResult(false);

      const { data, error } = await supabase.from("Dr_information").select("*");

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
      } else {
        setNoResult(false);
      }
    }
  };
  //console.log(spSelect);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="back items-center flex flex-col">
      <div
        className="hero2 p-28 py-28 max-sm:px-10 max-sm:py-14 text-center max-sm:space-y-4 flex flex-col
        items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p className="text-5xl max-sm:text-3xl font-semibold uppercase" data-aos="fade-up">
          RESERVE AN APPOINTMENT NOW!
        </p>
        <p className="text-3xl max-sm:text-lg font-light" data-aos="fade-up">
          Let us assist your appointment for your face to face consultation.
        </p>
      </div>

      <div className="flex flex-col py-[80px] pb-6 items-center">
        <h1
          className="text-4xl font-semibold text-[#315E30] mb-10 text-center"
          data-aos="fade-up"
        >
          Find a Doctor
          <br />
          (Face-to-face Conultation)
        </h1>
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
                  onChange={(e) => setName(e.target.value)}
                />
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
                <p className="search_label">HMO Accredation</p>
                {/* Hmo input */}
                <input
                  type="text"
                  value={Hmo}
                  onChange={(e) => setHmo(e.target.value)}
                  placeholder="Enter Accredation"
                  className="py-2 pr-8 serachInput bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
              focus:border-b-[#315E30]"
                />
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
        {showFill && Filter.length > 0 && (
          <div className="absolute abs w-48 flex flex-wrap text-sm bg-white z-50 mr-[780px] mt-[195px]">
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

      {noResult && (
        <p
          className="grid grid-flow-col gap-x-12 py-8 text-2xl font-semibold text-[#1c531b]"
          data-aos="fade-down"
        >
          No results found
        </p>
      )}
      {Doctors && (
        <div className="grid -z-[0] md:grid-cols-3 max-[844px]:grid-cols-2 mx-auto justify-center max-sm:gap-y-0 xl:grid-cols-4 gap-x-10 gap-y-2">
          {Doctors.map((Doctors) => (
            <DocUniq key={Doctors.id} Doctors={Doctors} />
          ))}
        </div>
      )}
    </div>
  );
};

export default F2f;

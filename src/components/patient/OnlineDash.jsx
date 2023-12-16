import React, { useEffect, useState } from "react";
import supabase from "../config/Supabase";
import DocUniq from "../Doctor read/Doctors";
import Specials from "../Specials.json";
import subspecial from "../SubSpecial.json";
import Aos from "aos";
import "aos/dist/aos.css";
import DoctorInList from "../Doctor read/DoctorInList";
import { TiThLargeOutline, TiThListOutline } from "react-icons/ti";

const Online = () => {
  //TODO: Fix filter and suggestion drop
  //TODO: add sign in
  //TODO: Pagination

  //Search and reset Function
  const [name, setName] = useState("");
  const [spSelect, setSpSelect] = useState("");
  const [subSelect, setSubSelect] = useState("");
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
      const { data, error } = await supabase
        .from("dr_information")
        .select("*")
        .eq("type", "ol");
      if (error) {
        console.error("Failed to fetch", error.message);
      } else {
        const nameSuggest = data.filter((doctor) =>
          doctor.name.toLowerCase().includes(name.toLowerCase())
        );
        setFilter(nameSuggest);
        if (name === "") {
          setFilter("");
        }
      }
    };
    fetchFilter();
  }, [name]);
  const handleNameFilterClick = (clickedName) => {
    setName(clickedName);
    setShowFill(false);
  };
  useEffect(() => {
    setShowFill(true);
  }, [name]);

  //DEFAULT DATA
  const fetchDoc = async () => {
    const { data, error } = await supabase.from("dr_information").select("*");

    if (error) {
      setDoctors(null);
      console.log(error);
    }
    if (data) {
      setDoctors(data);
    }
  };

  //REAL TIME LOADING OF DATA
  useEffect(() => {
    fetchDoc();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dr_information" },
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

    const { data, error } = await supabase
      .from("dr_information")
      .select("*")
      .eq("type", "ol");

    if (error) {
      console.error("Failed to fetch", error.message);
    }
    setDoctors(data);
    setNoResult(false);
  };

  //SEARCH FUNCTION
  const handleSearch = async () => {
    if (!name && !spSelect && !subSelect && !Hmo) {
      setNoResult(true);
    } else {
      setNoResult(false);

      const { data, error } = await supabase
        .from("dr_information")
        .select("*")
        .eq("type", "ol");

      if (error) {
        console.error("Error searching for data:", error.message);
        return;
      }
      const filteredData = data.filter((doctor) => {
        const nameMatch = name
          ? doctor.fname.toLowerCase().includes(name.toLowerCase())
          : true;
        const specMatch = spSelect
          ? doctor.specialization.toLowerCase().includes(spSelect.toLowerCase())
          : true;
        const subSpecMatch = subSelect
          ? doctor.subspecial.toLowerCase().includes(subSelect.toLowerCase())
          : true;
        const HmoMatch = Hmo
          ? doctor.subspecial.toLowerCase().includes(subSelect.toLowerCase())
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

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  //*Tiles or list
  const [isList, setIsList] = useState(false);

  return (
    <div className="back items-center flex flex-col h-auto min-h-screen">
      <div
        className="hero2 p-28 py-28 max-sm:px-10 max-sm:py-14 text-center max-sm:space-y-4 flex flex-col
        items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p
          className="text-5xl max-sm:text-3xl font-semibold uppercase"
          data-aos="fade-up"
        >
          RESERVE AN APPOINTMENT NOW!
        </p>
        <p className="text-3xl max-sm:text-lg font-light" data-aos="fade-up">
          Let us assist your appointment for your online consultation.
        </p>
      </div>
      <div className="grid grid-cols-4 w-full justify-center mt-10 mb-9 items-end">
        <div className=""></div>
        <div className="flex flex-col col-span-2 items-center">
          <h1
            className="text-4xl max-[425px]:text-3xl font-semibold text-[#315E30] mb-10 text-center"
            data-aos="fade-up"
          >
            Find a Doctor
            <br />
            (Online Conultation)
          </h1>
          <div
            className="find bg-white flex items-center search_box flex-col px-10 outbox py-8 rounded-md"
            data-aos="zoom-in-up"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="grid grid-cols-3 containtsearch">
                <div className="text-xl text-[#315E30]">
                  <p className="search_label">Doctor's name</p>
                  <input
                    type="text"
                    placeholder="Enter name"
                    className="py-1 mr-6 serachInput bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
                        focus:border-b-[#315E30]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="text-xl text-[#315E30]">
                  <p className="search_label">specialization</p>
                  <div className="flex mr-10">
                    {/* specialization Dropdown */}
                    <select
                      className="w-full py-2 serachInput duration-100 border-b-2 focus:outline-[#315E30]"
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
                  <p className="search_label">Sub-specialization</p>
                  <div className="flex">
                    {/* Sub-specialization Dropdown */}
                    <select
                      id="finddoctor-form-subspec"
                      value={subSelect}
                      onChange={(e) => setSubSelect(e.target.value)}
                      className="w-full py-2 serachInput duration-100 border-b-2 focus:outline-[#315E30]"
                    >
                      <option key="">---</option>
                      {subspecial.map((subspec) => (
                        <option key={subspec.id}>
                          {subspec.SubSpecialization}
                        </option>
                      ))}
                    </select>
                  </div>
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
        <div className="flex ml-8 text-4xl text-green-800 space-x-3">
          <div className=""></div>

          <TiThLargeOutline
            onClick={() => setIsList(false)}
            className={`${
              !isList && "bg-[#7bbb7ec0]"
            } p-[6px] cursor-pointer rounded-md bg-[#9beb9fc0] shadow-lg transition duration-75 hover:bg-[#7bbb7ec0]`}
          />
          <TiThListOutline
            onClick={() => setIsList(true)}
            className={`${
              isList && "bg-[#7bbb7ec0]"
            } p-[6px] cursor-pointer rounded-md bg-[#9beb9fc0] shadow-lg transition duration-75 hover:bg-[#7bbb7ec0]`}
          />
        </div>
      </div>

      {noResult && (
        <p
          className="grid grid-flow-col gap-x-12 py-8 text-2xl font-semibold text-[#1c531b]"
          data-aos="fade-down"
        >
          No results found
        </p>
      )}
      {!isList && (
        <div className="grid -z-[0] md:grid-cols-3 max-[844px]:grid-cols-2 mx-auto justify-center max-sm:gap-y-0 xl:grid-cols-4 gap-x-10 gap-y-2">
          {Doctors?.map((Doctors) => (
            <DocUniq key={Doctors.id} Doctors={Doctors} />
          ))}
        </div>
      )}
      {isList && (
        <div className="flex flex-col w-[60%] space-y-2 mb-3 items-center">
          {Doctors?.map((Doctors) => (
            <DoctorInList key={Doctors.id} ol={Doctors} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Online;

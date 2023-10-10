import React, { useEffect, useState } from "react";
import supabase from "./config/Supabase";
import DocUniq from "./DocUIniq";
import Specials from "./Specials.json";
import SubSpecial from "./SubSpecial.json";
import Aos from "aos";
import "aos/dist/aos.css";

const Appointment = ({ token}) => {
  //TODO: Fix filter and suggestion drop
  //TODO: add sign in

  //Search and reset Function
  const [Name, setName] = useState("");
  const [spSelect, setSpSelect] = useState("");
  const [subSelect, setSubSelect] = useState();
  const [Doctors, setDoctors] = useState(null);
  const [filter, setFilter] = useState(null);
  const [noResult, setNoResult] = useState(false);
  const [Hmo, setHmo] = useState();

  //select option value
  if (spSelect === "---") {
    setSpSelect("");
  }
  if (subSelect === "---") {
    setSubSelect("");
  }

  //console.log(spSelect, subSelect);

  //DEFAULT DATA
  useEffect(() => {
    const fetchDoc = async () => {
      const { data, error } = await supabase.from("Dr information").select("*");

      if (error) {
        setDoctors(null);
        console.log(error);
      }
      if (data) {
        return setDoctors(data);
      }
    };
    fetchDoc();
  }, []);

  useEffect(() => {
    const Drop = async () => {
      const { data, error } = await supabase.from("Dr information").select("*");
  
      if(error) {
        setFilter(null);
        console.log(error);
      }
      if(data) {
        return setFilter(data);
      }
      
    };
    Drop();
  }, []);
 
  // RESET FUNCTION
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

  //SEARCH FUNCTION
  const handleSearch = async () => {
    if (!Name && !spSelect && !subSelect && !Hmo) {
      setNoResult(true);
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
        className="hero2 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full"
        data-aos="fade-up"
      >
        <p className="text-5xl font-semibold" data-aos="fade-up">
          RESERVE AN APPOINTMENT NOW!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Let us assist your appointment either online or onsite.
        </p>
      </div>
    
      <div className="flex flex-col py-[80px] pb-6 items-center">
        <h1
          className="text-4xl font-semibold text-[#315E30] mb-10"
          data-aos="fade-up"
        >
          Find a Doctor
        </h1>
        {token?
        ""
        :<div className="flex z-30 w-screen h-screen fixed justify-center backdrop-blur-lg bg-slate-700 inset-0 bg-opacity-30">
        <div className=" absolute abs px-10 py-8 mt-56 bg-white">You need to Sign in first</div>
      </div>}
        <div
          className="find bg-white flex flex-col p-8 pb-8"
          data-aos="zoom-in-up"
        >
          <div className="flex flex-col items-center z-[99999]">
            <table>
              <thead data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                <tr>
                  <td className="text-xl text-[#315E30] pb-3">Doctor's Name</td>
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
              <tbody data-aos="fade-up" data-aos-anchor-placement="top-bottom">
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
                    <div className="flex mr-5">
                      {/* Specialization Dropdown */}
                      <select
                        className="w-56 py-1 duration-100 border-b-2 focus:outline-[#315E30]"
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
                  </td>
                  <td>
                    <div className="flex mr-5">
                      {/* Sub-Specialization Dropdown */}
                      <select
                        id="finddoctor-form-subspec"
                        value={subSelect}
                        onChange={(e) => setSubSelect(e.target.value)}
                        className="w-full py-1 duration-100 border-b-2 border-siteGreen-darker"
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
                      className="py-1 pr-8 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
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
              className="bg-[#418D3F] w-2/5 py-1 mt-5 font-semibold text-xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
            >
              SEARCH
            </button>
            <button
              data-aos-anchor-placement="top-bottom"
              data-aos="fade-up"
              onClick={handleReset}
              className="text-[#267124] text-lg mt-3"
            >
              reset
            </button>
          </div>
        </div>
      </div>
      {/* //TODO CONTINUE THIS
      <div className="absolute abs drop p-8 w-52 max-h-64 overflow-y-scroll bg-white z-10 mr-[750px] mt-[40rem]">
        {Doctors && filter.map((Doctors) => <p>{Doctors.Name}</p>)}
      </div> */}
      {noResult && (
        <p
          className="grid grid-flow-col gap-x-12 py-8 text-2xl font-semibold text-[#1c531b]"
          data-aos="fade-down"
        >
          No results found
        </p>
      )}
      {Doctors && (
        <div className="Doctors grid -z-[0] grid-cols-4 gap-x-10 gap-y-2">
          {Doctors.map((Doctors) => (
            <DocUniq key={Doctors.id} Doctors={Doctors} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointment;

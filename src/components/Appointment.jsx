import React, {useEffect, useState} from "react";
import supabase from "./config/Supabase";
import DocUniq from "./DocUIniq";
import Specials from "./Specials.json";
import SubSpecial from "./SubSpecial.json";
import Aos from "aos";
import 'aos/dist/aos.css'

const Appointment = () => {
  const [fetchError, setFetch] = useState(null)
  const [Doctors, setDoctors] = useState(null)

  useEffect(()=>{
    const fetchDoc = async () => {
      const {data, error} = await supabase
      .from('Dr information')
      .select()

      if(error){
        setFetch('Failed to fetch')
        setDoctors(null)
        console.log(error)
      }
      if(data){
        setDoctors(data)
        setFetch(null)
      }
    }
    fetchDoc()
  }, [])

  useEffect(() => {
    Aos.init({duration: 1000});
  }, [])

  return (
    <div className="back items-center flex flex-col">
      <div className="hero2 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full" data-aos="fade-up">
        <p className="text-5xl font-semibold" data-aos="fade-up">
          RESERVE AN APPOINTMENT NOW!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Let us assist your appointment either online or onsite.
        </p>
      </div>
      <div className="flex flex-col py-[80px] pb-6 items-center">
        <h1 className="text-4xl font-semibold text-[#315E30] mb-10" data-aos="fade-up">
          Find a Doctor
        </h1>
        
        <div className="find bg-white  flex flex-col p-14 pb-12 mb-10"  data-aos="zoom-up" data-aos-duration="800">
          <div className="flex flex-col items-center space-y-8">
            <table>
              <thead data-aos="fade-up">
              <tr>
                <td className="text-2xl text-[#315E30] pr-6 pb-3">
                  Doctor's Name
                </td>
                <td className="text-2xl text-[#315E30] pr-6 pb-3">
                  Specialization
                </td>
                <td className="text-2xl text-[#315E30] pr-6 pb-3">
                  Sub-Specialization
                </td>
                <td className="text-2xl text-[#315E30] pr-6 pb-3">
                  HMO Accredation
                </td>
              </tr>
              </thead>
              <tbody data-aos="fade-up">
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="py-2 mr-6 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
              focus:border-b-[#315E30] invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  />
                </td>

                <td>
                  <div className="flex mr-5">
                    {/* Specialization Dropdown */}
                    <select className="w-56 py-2 duration-100 border-b-2 focus:outline-[#315E30]">
                        <option>---</option>
                        {Specials.map((special) => {
                          return (
                            <option value={special.id} key={special.id}>
                              {special.Specialization}{" "}
                            </option>
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
                        className="w-full py-2 duration-100 border-b-2 border-siteGreen-darker"
                      >
                        <option value="">---</option>
                        {SubSpecial.map((subspec) => {
                          return (
                          <option value={subspec.id}>{subspec.SubSpecialization}</option>
                          );
                        }
                        )}
                        
                      </select>
                  </div>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Enter Accredation"
                    className="py-2 pr-8 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
              focus:border-b-[#315E30] invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                  />
                </td>
              </tr>
              </tbody>
            </table>
            <button data-aos="fade-up" className="bg-[#418D3F] ring-[#418D3F] w-1/2 py-1 font-semibold text-2xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124]  hover:ring-[3px]">
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {fetchError && (<p>{fetchError}</p>)}
      {Doctors && (
        <div className="Doctors grid grid-cols-4 gap-x-10 gap-y-2">
          {Doctors.map(Doctors=>(
            <DocUniq key={Doctors.id} Doctors={Doctors}/>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointment;

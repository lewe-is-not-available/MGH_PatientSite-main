import React, { useEffect, useState } from "react";
import logo from "./images/MGHlogo.png";
import { IoLocationSharp } from "react-icons/io5";
import Aos from "aos";
import "aos/dist/aos.css";

const HospitalProfile = () => {
  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);
  return (
    <div className="h-full back flex flex-col items-center justify-center">
      <div className="h-[35rem] w-full company mb-14">
        <div className="flex flex-col items-center justify-center h-full">
          <div data-aos="fade-up" className="flex">
            <img src={logo} alt="" className="w-52" />
            <h1 className="text-7xl flex items-center w-[45.8rem] text-left ml-4 text-white flex-wrap font-bold">
              MENDOZA GENERAL HOSPITAL
              <span className="whitespace-nowrap text-xl flex">
                <IoLocationSharp className="text-2xl mr-2" /> A. Morales St.
                Poblacion Sta. Maria Bulacan
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div
        data-aos="fade-up"
        className="bg-white abs w-[50%] py-8 px-14 mb-16 rounded-md bg-opacity-70 text-center text-xl"
      >
        <h1 className="text-[#3f7c3e] text-3xl font-semibold mb-8">
          COMPANY PROFILE
        </h1>
        <p className="text-justify indent-20 text-slate-700 font-sans">
          Mendoza General Hospital, Inc., is a 36 bed capacity health care
          facility with implementing bed capacity of 17 beds, offering secondary
          level of care, located at F. Santiago corner A. Morales St.,
          Poblacion, Santa Maria, Bulacan, Philippines, established in 1968 by
          the humble couple, Dr. Ciriaco Perez Mendoza and Dr. Elisa Marbella-
          Mendoza, with Department of Health (DOH) license number
          03-0149-23-H1-2, Philippine Health Insurance (Philhealth)
          accreditation number HO3004537 and accreditation from the Private
          Hospital Association of the Philippines (PHAP). <br />
          <br />
          {"   "} Services offered are 24 Hours Emergency Room, OPD Clinics,
          General Surgery, Radiology and Imaging Services, 24Hr Level 2
          Laboratory Services, 24Hr Pharmacy, 24Hr Ambulance Service, Medical
          and Surgical Wards, Pediatric Wards, OB-GYNE Wards and Cardiologic
          Diagnostic Procedures. We are also tied up with the McLaren Group of
          Health Services for all advanced imaging services such as CT-Scans and
          Mammography and soon will be offering Ambulatory Surgical Clinic (ASC)
          services. Mendoza General Hospital operates with a total of 69
          employees which includes professional staff and personnel on the
          different departments. It accommodates approximately 6,000 clients per
          year of its serving population of Santa Maria, clients also includes
          different health insurances holders. The current management team is
          headed by Dr. Jose Teodoro M. Mendoza as Medical Director and
          President, Dr. Ma. Chona Mendoza as Hospital Administrator, Secretary
          and CEO, Dr. Joselito Mendoza as Vice President, Elsa Mendoza-Mariño
          as Finance Officer and Treasurer and Venerando D. Centeno, RN, MSN,
          Chief Operating Officer.
        </p>
      </div>
    </div>
  );
};

export default HospitalProfile;

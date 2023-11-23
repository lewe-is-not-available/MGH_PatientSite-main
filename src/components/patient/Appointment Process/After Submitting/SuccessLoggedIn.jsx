import React from "react";
import { cardio } from "ldrs";
import { Link } from "react-router-dom";

cardio.register();

// Default values shown

const SuccessLoggedIn = ({ user }) => {
  return (
    <div className="w-full flex flex-col text-center items-center justify-center">
      <h2 className="text-3xl font-semibold  text-green-600">
        Booking Succesful!
      </h2>
      <h1 className="text-xl">
        <br />
        Your appointment has been submitted Succesfully and is waiting for
        confirmation
      </h1>
      <p className="text-lg">
        click the button below to check you appointment status
      </p>
      <Link 
      to="/Appointment/Status"
      className="bg-green-600 text-white transition duration-75 border-[3px] hover:text-green-800 hover:border-green-600 hover:bg-[#A5DD9D] border-green-800 w-[50%] py-2 mt-9 text-xl rounded-md">
        Check Appointment Status
      </Link>
    </div>
  );
};

export default SuccessLoggedIn;

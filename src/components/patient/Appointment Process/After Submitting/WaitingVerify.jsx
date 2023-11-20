import React, { useState } from "react";
import { dotWave } from "ldrs";

dotWave.register();

const WaitingVerify = () => {
  return (
    <div className="back flex items-center h-screen justify-center">
      <div className="flex h-[60%] justify-center space-y-3 px-14 flex-col items-center abs rounded-md bg-white">
        <div className=" flex items-center ">
          <h1 className="text-5xl text-green-700 font-semibold">
            Waiting for verification{" "}
          </h1>
          <l-dot-wave size="50" speed="0.4" color="#149044"></l-dot-wave>
        </div>
        <p className="text-xl">
          Please check you email for the verification link...
        </p>
        <p>
          If the verification is not sent click <button className="transition duration-100 text-primary hover:text-primary-800">Resend Confirmation</button>
        </p>
      </div>
    </div>
  );
};

export default WaitingVerify;

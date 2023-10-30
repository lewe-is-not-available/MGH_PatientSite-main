import React, { useState } from "react";

const HospitalProfile = () => {
  const [isChecked, setChecked] = useState(false);

  console.log(isChecked);
  return (
    <div className="h-screen">
      <div
        className="hero2 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full"
      >
        <p className="text-5xl font-semibold" data-aos="fade-up">
          RESERVE AN APPOINTMENT NOW!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Let us assist your appointment either online or onsite.
        </p>
      </div>
      <input
        onChange={(e) => setChecked(e.target.checked)}
        type="checkbox"
        className="m-5"
      />

      {isChecked && <p>meron</p>}

      <div class="flex items-center mb-4 ml-10">
        <input
          id="default-radio-1"
          type="radio"
          value=""
          name="default-radio"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500
           dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
            dark:border-gray-600"
            checked
        />
        <label
          for="default-radio-1"
          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Default radio
        </label>
      </div>
      <div class="flex items-center ml-10">
        <input
          checked
          id="default-radio-2"
          type="radio"
          value=""
          name="default-radio"
          class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500
           dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700
            dark:border-gray-600"
        />
        <label
          for="default-radio-2"
          class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Checked state
        </label>
      </div>
    </div>
  );
};

export default HospitalProfile;

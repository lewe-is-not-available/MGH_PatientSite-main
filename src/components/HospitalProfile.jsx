import React, { useState } from 'react'

const HospitalProfile = () => {

  const [isChecked, setChecked] = useState(false)

  console.log(isChecked)
  return (
    <div className='h-screen'>
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
      <input 
      onChange={(e) => setChecked(e.target.checked)}
      type="checkbox"
      className='m-5'/>
      
      {isChecked && <p>meron</p>}

    </div>
  )
}

export default HospitalProfile
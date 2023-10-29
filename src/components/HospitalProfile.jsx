import React, { useState } from 'react'

const HospitalProfile = () => {

  const [isChecked, setChecked] = useState(false)

  console.log(isChecked)
  return (
    <div className='h-screen'>
      <input 
      onChange={(e) => setChecked(e.target.checked)}
      type="checkbox"
      className='m-5'/>
      
      {isChecked && <p>meron</p>}

    </div>
  )
}

export default HospitalProfile
import React from 'react'
import supabase from '../../config/Supabase'

useEffect(() => {
  const 
  const fetchFilter = async () => {
    const { data, error } = await supabase.from("Patient_Appointments").select("*");
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

const Status = () => {
  return (
    <div className='back h-screen w-full flex place-content-center'><div className='abs absolute mt-10 bg-white p-10'>asdasd</div></div>
  )
}

export default Status
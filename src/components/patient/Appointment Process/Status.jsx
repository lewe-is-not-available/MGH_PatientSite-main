import React, {useEffect, useState} from 'react'
import supabase from '../../config/Supabase'


const Status = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchFilter = async () => {
      const { data, error } = await supabase.from("Patient_Appointments").select("*");
      if (error) {
        console.error("Failed to fetch", error.message);
      }
      setData(data)
    };
    fetchFilter();
  }, []);
  
  return (
    <div className='back h-screen w-full flex place-content-center'><div className='abs absolute mt-10 bg-white p-10'>{}</div></div>
  )
}

export default Status
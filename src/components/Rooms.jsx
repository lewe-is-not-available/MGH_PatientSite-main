import React, {useEffect} from 'react'
import Aos from "aos";
import 'aos/dist/aos.css'
import Room1 from './images/RoomEx1.png'
import Room2 from './images/RoomEx2.png'

const Rooms = () => {
  useEffect(() => {
    Aos.init({duration: 1000});
  }, [])
  return (
    <div className='back'>
      <div className="hero4 p-28 py-28 flex flex-col items-center text-white space-y-10 w-full" data-aos="fade-up">
        <p className="text-5xl font-semibold" data-aos="fade-up">
           CHECK OUT OUR AVAILABLE ROOMS
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          We care about your comfort!
        </p>
      </div>

      <div className="py-[80px] grid grid-cols-2 place-items-center gap-x-24 px-56 gap-y-16">
      
          <img src ={Room1} alt='' className='rounded-lg' data-aos="fade-up"/>
          <img src ={Room2} alt='' className='rounded-lg' data-aos="fade-up"/>

          <h1 className='text-3xl font-semibold' data-aos="fade-up" data-aos-anchor-placement="top-center">EXCLUSIVE ROOMS</h1>
          <h1 className='text-3xl font-semibold' data-aos="fade-up" data-aos-anchor-placement="top-center">STANDARD ROOMS</h1>

          <div className='bg-slate-300 py-96 px-[40%] text-4xl' data-aos="zoom-out" data-aos-anchor-placement="top-center"><span data-aos="fade-up">DETAILS</span></div>
          <div className='bg-slate-300 py-96 px-[40%] text-4xl' data-aos="zoom-out" data-aos-anchor-placement="top-center"><span data-aos="fade-up">DETAILS</span></div>
       
      </div>
    </div>
  );
};

export default Rooms;

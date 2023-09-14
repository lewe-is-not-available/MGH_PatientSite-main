import React, {useEffect} from 'react'
import Aos from "aos";
import 'aos/dist/aos.css'

const Feedback = () => {
  useEffect(() => {
    Aos.init({duration: 1000});
  }, [])
  return (
    <div>
        <div className="hero3 p-28 py-28 flex flex-col items-center text-white space-y-14 w-full" data-aos="fade-up">
        <p className="text-5xl font-semibold" data-aos="fade-up">
           GIVE US YOUR FEEDBACK!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Tell us what you feel, leave a comment.
        </p>
      </div>
      <div className="back py-[80px] flex flex-col items-center">
        
      </div>
      
    </div>
  )
}

export default Feedback
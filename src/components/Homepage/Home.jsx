import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import Carousel from "./ServicesCarousel";
import outpatient from "../images/slides/outpatient.jpg";
import laboratory from "../images/slides/laboratory-design.jpg";
import xray from "../images/slides/xray.jpg";
import admission from "../images/slides/admission.jpg";
import ultrasound from "../images/slides/ultrasound.jpg";
import echo from "../images/slides/2D-echo.jpg";

const slides = [admission, outpatient, ultrasound,echo, laboratory, xray];
const Home = () => {
  //TODO: add sign in

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div>
      <div
        className="hero1 p-28 py-28 flex flex-col items-center text-white space-y-14"
        data-aos="fade-up"
      >
        <p className="text-5xl font-semibold" data-aos="fade-up">
          WE'RE HERE READY FOR YOUR SERVICE!
        </p>
        <p className="text-3xl font-light" data-aos="fade-up">
          Need to book for a doctor's appointment? 
        </p>
        <Link to="/Appointment">
          <button
            data-aos="fade-up"
            className="bg-transparent text-[20px] px-7 py-2 border-solid border-white border-2 transition duration-50 ease-in-out hover:text-[#315E30] hover:bg-white"
          >
            Click Here!
          </button>
        </Link>
      </div>

      <div className="back py-[40px] flex flex-col items-center">
        <section id="Contact-num">
          <div className="mb-[33px] flex flex-col space-y-2 items-center">
            <p
              className="text-xl font-semibold text-[#315E30]"
              data-aos="fade-up"
            >
              CONTACT NUMBERS
            </p>
            <label
              className="text-[#315E30] flex flex-col text-center space-y-3"
              data-aos="fade-up"
            >
              <span data-aos="fade-up">+63 995 230 2499</span>
              <span data-aos="fade-up">+63 (44) 288 2417</span>
              <span data-aos="fade-up">+63 (44) 641 1582</span>
            </label>

            <p
              className="text-xl font-semibold text-[#315E30]"
              data-aos="fade-up"
            >
              E-MAIL ADDRESSES
            </p>
            <span className="text-[#315E30]" data-aos="fade-up">
              mendozageneralhospital@gmail.com
            </span>
          </div>
        </section>

        <section
          data-aos="fade-up"
          id="services"
          className="flex flex-col items-center"
        >
          <h1
            className="text-4xl font-semibold text-[#315E30]"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            Showcase of Services Offered
          </h1>

          <div className="w-[60%] mb-12">
            <Carousel slides={slides} />
          </div>
        </section>

        <section id="Blogs">
          <div className="flex flex-col items-center space-y-6">
            <h1
              className="text-4xl font-semibold text-[#315E30]"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              Blogs
            </h1>
            <div
              className="bg-slate-400 p-6 w-2/3 flex"
              data-aos="zoom-out"
              data-aos-anchor-placement="center-bottom"
              data-aos-duration="500"
            >
              <p data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Voluptatem temporibus dolor fugit quia tenetur, perferendis illo
                fuga accusantium voluptatum doloremque eveniet sit dolore rerum
                dolorem accusamus officiis totam velit minima tempora explicabo
                quod reprehenderit ipsa magnam. Repudiandae, et in? Veritatis
                sed sapiente a eaque nulla, modi at magni repellat temporibus!
              </p>
              <div
                className="p-20 bg-slate-500 justify-evenly font-bold"
                data-aos="zoom-in"
                data-aos-anchor-placement="bottom-bottom"
              >
                PICTURE
              </div>
            </div>
            <div
              className="bg-slate-400 p-6 w-2/3 flex"
              data-aos="zoom-out"
              data-aos-anchor-placement="center-bottom"
              data-aos-duration="500"
            >
              <p data-aos="fade-up" data-aos-anchor-placement="bottom-bottom">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Voluptatem temporibus dolor fugit quia tenetur, perferendis illo
                fuga accusantium voluptatum doloremque eveniet sit dolore rerum
                dolorem accusamus officiis totam velit minima tempora explicabo
                quod reprehenderit ipsa magnam. Repudiandae, et in? Veritatis
                sed sapiente a eaque nulla, modi at magni repellat temporibus!
              </p>
              <div
                className="p-20 bg-slate-500 justify-evenly font-bold"
                data-aos="zoom-in"
                data-aos-anchor-placement="bottom-bottom"
              >
                PICTURE
              </div>
            </div>
          </div>
        </section>
      </div>

      <div></div>
    </div>
  );
};

export default Home;

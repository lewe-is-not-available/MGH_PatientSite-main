import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { Carousel, initTE } from "tw-elements";

initTE({ Carousel });

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
          Need some emergency assistance? Contact Us!
        </p>
        <Link to="/Contacts">
          <button
            data-aos="fade-up"
            className="bg-transparent text-[20px] px-7 py-2 border-solid border-white border-2 transition duration-50 ease-in-out hover:text-[#315E30] hover:bg-white"
          >
            Click Here!
          </button>
        </Link>
      </div>

      <div className="back py-[80px] flex flex-col items-center">
        <section id="Contact-num">
          <div className="mt-[40px] mb-[33px] flex flex-col space-y-2 items-center">
            <p
              className="text-xl font-semibold text-[#315E30]"
              data-aos="fade-up"
            >
              CONTACT NUMBER
            </p>
            <span className="text-[#315E30]" data-aos="fade-up">
              +639455963805
            </span>
            <p
              className="text-xl font-semibold text-[#315E30]"
              data-aos="fade-up"
            >
              EMERGENCY HOT-LINE
            </p>
            <span className="text-[#315E30]" data-aos="fade-up">
              1234-567
            </span>
            <p
              className="text-xl font-semibold text-[#315E30]"
              data-aos="fade-up"
            >
              E-MAIL ADDRESSES
            </p>
            <span className="text-[#315E30]" data-aos="fade-up">
              JuanCruz@email.com
            </span>
          </div>
        </section>

        {/* <section id="services">
          <div className="flex flex-col items-center space-y-6 mb-8">
            <h1
              className="text-4xl font-semibold text-[#315E30]"
              data-aos="fade-up"
              data-aos-duration="500"
            >
              Showcase of Services Offered
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
        </section> */}
        <section id="services">
          <h1
            className="text-4xl font-semibold text-[#315E30]"
            data-aos="fade-up"
            data-aos-duration="500"
          >
            Showcase of Services Offered
          </h1>

          <div
            id="default-carousel"
            className="relative w-full"
            data-carousel="slide"
          >
            {/* <!-- Carousel wrapper --> */}

           
            {/* <!-- Slider indicators --> */}
            <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="true"
                aria-label="Slide 1"
                data-carousel-slide-to="0"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 2"
                data-carousel-slide-to="1"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 3"
                data-carousel-slide-to="2"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 4"
                data-carousel-slide-to="3"
              ></button>
              <button
                type="button"
                className="w-3 h-3 rounded-full"
                aria-current="false"
                aria-label="Slide 5"
                data-carousel-slide-to="4"
              ></button>
            </div>
            {/* <!-- Slider controls --> */}
            <button
              type="button"
              className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-prev
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              data-carousel-next
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-gray-800"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
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

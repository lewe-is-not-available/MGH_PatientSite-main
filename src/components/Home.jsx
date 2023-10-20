import React, { useEffect, useState } from "react";
import supabase from "./config/Supabase";
import { Link } from "react-router-dom";
import SearchRes from "./SearchResult";
import Specials from "./Specials.json";
import SubSpecial from "./SubSpecial.json";
import Aos from "aos";
import "aos/dist/aos.css";
import Emergency from "./images/slides/emergency.jpg";
import lab from "./images/slides/laboratory-design.jpg";
import { Carousel, initTE } from "tw-elements";

initTE({ Carousel });

const Home = ({ token }) => {
  //TODO: add sign in
  //!FIX SUGGESTION FILTER
  //For Search window drop function
  const [Show, FetchShow] = useState(null);
  const Close = () => FetchShow(false);
  //Search and reset Function
  const [Name, setName] = useState("");
  const [spSelect, setSpSelect] = useState();
  const [subSelect, setSubSelect] = useState();
  const [Doctors, setDoctors] = useState(null);
  const [noResult, setNoResult] = useState(false);
  const [Hmo, setHmo] = useState();
  const [Filter, setFilter] = useState([]);

  //select option value
  if (spSelect === "---") {
    setSpSelect("");
  }
  if (subSelect === "---") {
    setSubSelect("");
  }
  //TODO: continue the filteration
  const [showFill, setShowFill] = useState(true);
  useEffect(() => {
    const fetchFilter = async () => {
      const { data, error } = await supabase.from("Dr information").select("*");
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
  const handleNameFilterClick = (clickedName) => {
    setName(clickedName);
    setShowFill(false);
  };
  useEffect(() => {
    setShowFill(true);
  }, [Name]);

  // useEffect(() => {
  //   if (Name) {
  //     setShowFill(true); // Show suggestions when the user types
  //   }
  //   else {
  //     setShowFill(false); // Hide suggestions when the input is empty
  //   }
  // }, [Name]);

  const handleReset = async () => {
    setName("");
    setSpSelect("---");
    setSubSelect("---");
    setHmo("");

    const { data, error } = await supabase.from("Dr information").select("*");

    if (error) {
      console.error("Failed to fetch", error.message);
    }
    setDoctors(data);
    setNoResult(false);
  };

  const handleSearch = async () => {
    FetchShow(true);
    if (!Name && !spSelect && !subSelect && !Hmo) {
      setNoResult(true);
      setDoctors(null);
    } else {
      setNoResult(false);

      const { data, error } = await supabase.from("Dr information").select("*");

      if (error) {
        console.error("Error searching for data:", error.message);
        return;
      }
      const filteredData = data.filter((doctor) => {
        const nameMatch = Name
          ? doctor.Name.toLowerCase().includes(Name.toLowerCase())
          : true;
        const specMatch = spSelect
          ? doctor.specialization.toLowerCase().includes(spSelect.toLowerCase())
          : true;
        const subSpecMatch = subSelect
          ? doctor.SubSpecial.toLowerCase().includes(subSelect.toLowerCase())
          : true;
        const HmoMatch = Hmo
          ? doctor.SubSpecial.toLowerCase().includes(subSelect.toLowerCase())
          : true;
        return nameMatch && specMatch && subSpecMatch && HmoMatch;
      });
      setDoctors(filteredData);
      if (filteredData.length === 0) {
        setNoResult(true);
        setDoctors("");
      } else {
        setNoResult(false);
      }
    }
  };

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
        <h1
          className="text-4xl font-semibold text-[#315E30] mb-10"
          data-aos="fade-up"
        >
          Find a Doctor
        </h1>
        {/* Search box with filteration */}
        <div
          className="find bg-white flex flex-col p-8 pb-8"
          data-aos="zoom-in-up"
        >
          {token ? (
            ""
          ) : (
            <div className="flex z-30  fixed justify-center backdrop-blur-lg bg-slate-700 inset-0 bg-opacity-30">
              <div className=" absolute abs px-10 py-8 mt-20 bg-white">
                You need to Sign in first
              </div>
            </div>
          )}
          <div className="flex flex-col items-center space-y-4">
            <table>
              <thead data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                <tr>
                  <td className="text-xl text-[#315E30] pb-3">Doctor's Name</td>
                  <td className="text-xl text-[#315E30] pb-3">
                    Specialization
                  </td>
                  <td className="text-xl text-[#315E30] pb-3">
                    Sub-Specialization
                  </td>
                  <td className="text-xl text-[#315E30] pb-3">
                    HMO Accredation
                  </td>
                </tr>
              </thead>
              <tbody data-aos="fade-up" data-aos-anchor-placement="top-bottom">
                <tr>
                  <td>
                    <input
                      type="text"
                      placeholder="Enter Name"
                      className="py-1 mr-6 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
                        focus:border-b-[#315E30]"
                      value={Name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </td>

                  <td>
                    <div className="flex mr-5">
                      {/* Specialization Dropdown */}
                      <select
                        className="w-44 py-1 duration-100 border-b-2 focus:outline-[#315E30]"
                        value={spSelect}
                        onChange={(e) => setSpSelect(e.target.value)}
                      >
                        {Specials.map((Spec) => {
                          return (
                            <option key={Spec.id}>{Spec.Specialization}</option>
                          );
                        })}
                      </select>
                    </div>
                  </td>
                  <td>
                    <div className="flex mr-5">
                      {/* Sub-Specialization Dropdown */}
                      <select
                        id="finddoctor-form-subspec"
                        value={subSelect}
                        onChange={(e) => setSubSelect(e.target.value)}
                        className="w-44 py-2 duration-100 border-b-2 border-siteGreen-darker"
                      >
                        <option key="">---</option>
                        {SubSpecial.map((subspec) => {
                          return (
                            <option key={subspec.id}>
                              {subspec.SubSpecialization}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </td>
                  <td>
                    {/* Hmo input */}
                    <input
                      type="text"
                      value={Hmo}
                      onChange={(e) => setHmo(e.target.value)}
                      placeholder="Enter Accredation"
                      className="py-2 pr-8 bg-white border-2 border-r-transparent border-t-transparent border-l-transparent focus:outline-none 
              focus:border-b-[#315E30]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="submit"
              data-aos-anchor-placement="top-bottom"
              data-aos="fade-up"
              onClick={handleSearch}
              className="bg-[#418D3F] w-2/5 py-1 font-semibold text-xl text-white rounded-md transition duration-10 ease-in-out hover:bg-[#A5DD9D] hover:text-[#267124] hover:ring-[#418D3F] hover:ring-[3px]"
            >
              SEARCH
            </button>
            <button
              data-aos-anchor-placement="top-bottom"
              data-aos="fade-up"
              onClick={handleReset}
              className="text-[#267124] text-lg"
            >
              reset
            </button>
          </div>
        </div>
        <div className={`${Show ? "show" : "hide"}`}>
          <div className="searchbg rounded-xl pl-10 py-14 pr-[4.2rem] pt-12 bg mt-8 flex">
            {/* {fetchError && <p>{fetchError}</p>} */}
            {noResult && (
              <p className="grid grid-flow-col gap-x-12">No results found</p>
            )}
            {Doctors && (
              <div className="Doctors overflow-x-scroll w-[73rem] grid grid-flow-col gap-x-12">
                {Doctors.map((Doctors) => (
                  <SearchRes key={Doctors.id} Doctors={Doctors} />
                ))}
              </div>
            )}
            <button
              onClick={Close}
              className="
            text-base text-slate-400 bg-slate-200 px-1 w-[27px] h-full rounded-full -ml-1 -mt-[35px] -mr-14
            transition duration-75 ease-in hover:bg-slate-300 hover:text-slate-500 hover:border-slate-400 border-2"
            >
              X
            </button>
          </div>
        </div>
        {/* // TODO: ADD FILTER */}
        {showFill && Filter.length > 0 && (
          <div className="absolute abs w-48 flex flex-wrap text-sm bg-white z-50 mr-[652px] mt-[195px]">
            {Filter.map((Filter) => (
              <li
                onClick={() => handleNameFilterClick(Filter.Name)}
                className="list-none px-2 my-1 cursor-pointer w-full hover:bg-primary hover:text-white"
                key={Filter.id}
              >
                {Filter.Name}
              </li>
            ))}
          </div>
        )}

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
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
              {/* <!-- Item 1 --> */}
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="./images/slides/emergency.jpg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              {/* <!-- Item 2 --> */}
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src="./images/slides/emergency.jpg"
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
            </div>
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

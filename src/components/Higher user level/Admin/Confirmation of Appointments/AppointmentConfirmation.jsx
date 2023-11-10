import React, { useState, useEffect } from "react";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import Online from "./Online";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import { BsSearch } from "react-icons/bs";
import { MagnifyingGlass } from "react-loader-spinner";

const AppointmentConfirmation = ({ CDNURL, user }) => {
  //TODO: REDESIGN TABLE INTO BULK WITH PROFILE PIC
  //*prevent access from non-admin users
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAdmin = async () => {
      const { data } = await supabase.from("profile").select("*").single();
      if (data.role !== "admin") {
        navigate("/Dashboard");
      }
    };
    fetchAdmin();
  }, [navigate]);
  
  const [filt, setfilt] = useState([]);

  //*get filter inputs
  const [Search, setSearch] = useState("");
  const [Someone, setSomeone] = useState("");
  const [time, settime] = useState("");
  const [Type, setType] = useState("");
  const [Status, setStatus] = useState("");
  const [createdAt, setCreated] = useState("");
  const [isAsc, setisAsc] = useState(true);
  useEffect(() => {
    //booked by someone
    if (Someone === "Show all") {
      setSomeone("");
    } //status
    if (Status === "Show all") {
      setStatus("");
    }
    //time
    if (time === "all") {
      settime("");
    }
    //created at
    if (createdAt === "descending") {
      setisAsc(true);
    } else if (createdAt === "ascending") {
      setisAsc(false);
    }
    //Type
    if (Type === "Show all") {
      setType("");
    } else if (Type === "Online Consult") {
      setType("ol");
    } else if (Type === "Face to face Consult") {
      setType("f2f");
    }
  }, [
    createdAt,
    setisAsc,
    Status,
    time,
    Type,
    Someone,
    setSomeone,
    settime,
    setType,
  ]);

  //*Loading function
  const [searchLoad, setsearchLoad] = useState(true);
  const [Loaded, setLoaded] = useState(true)

  //*get patient appointments
  const [books, setBook] = useState([]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from("Patient_Appointments")
      .select("*");
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    }

    if (data) {
      setfilt(data);
    }
  };
  //console.log(filt);
  //*search filter
  const handleSearch = () => {
    setLoaded(false)
    const search = filt.filter((items) => {
      console.log(items);
      const fname = items.fname.toLowerCase().includes(Search.toLowerCase());
      const lname = items.lname.toLowerCase().includes(Search.toLowerCase());
      const mname = items.mname.toLowerCase().includes(Search.toLowerCase());
      const docname = items.fname.toLowerCase().includes(Search.toLowerCase());
      return fname || lname || mname || docname;
    });
      setBook(search);
      if(filt){
        setLoaded(true)
      }
   
  };
  console.log(books);

  useEffect(() => {
    setLoaded(false)
    if (filt) {
      const filterBook = filt
        .filter((item) => {
          const defStat = !item.status.includes("Confirmed");
          const someone = item.someone.includes(Someone);
          const Time = item.time.toLowerCase().includes(time);
          const type = item.type.toLowerCase().includes(Type);
          const status = item.status.toLowerCase().includes(Status);
          return defStat && someone && Time && type && status;
        })
        .sort((a, b) =>
          isAsc
            ? a.created_at > b.created_at
              ? -1
              : 1
            : a.created_at < b.created_at
            ? -1
            : 1
        );
      setBook(filterBook);
      setLoaded(true)
   
    }
  }, [isAsc, Type, Status, time, Someone, setBook, filt]);

  useEffect(() => {
    fetchBooks();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Patient_Appointments" },
        () => {
          fetchBooks();
        }
      )
      .subscribe();
  }, []);

  const [isFilterOpen, setisFilterOpen] = useState(false);
  //*Filter function
  async function getImages(id, setimgName, setImgEmpty) {
    const { data, error } = await supabase.storage
      .from("images")
      .list(id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (data[0]) {
      setImgEmpty(true);
      setimgName(data[0].name);
    }

    if (error) {
      setImgEmpty(false);
      console.log(error);
    }
  }

  //*Aos Function
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="back h-screen flex justify-center">
      <div className="w-[70%]">
        <p className="text-4xl font-semibold text-[#315E30]"></p>

        {/*search and filter  */}
        <div className="w-full flex justify-between items-center mt-10 mb-3 ">
          <div
            onClick={() => setisFilterOpen(!isFilterOpen)}
            className="px-4 py-1 items-center select-none hover:cursor-pointer w-fit transition duration-75 
                       ease-in hover:bg-[#78b673f8] bg-[#98dd93c4] text-[#295f34] mx-4  rounded-full hover:text-white flex"
          >
            {isFilterOpen ? (
              <>
                {" "}
                <VscFilterFilled className="text-2xl mr-2" />
                <p className="">Close Filter</p>
              </>
            ) : (
              <>
                {" "}
                <VscFilter className="text-2xl mr-2" />
                <p className="">Filter</p>
              </>
            )}
          </div>
        </div>
        {isFilterOpen && (
          <div className="bg-[#98dd93c4] px-5 pt-5 pb-8 rounded-lg items-center gap-x-7 gap-y-4 grid grid-cols-3">
            <div className="flex flex-col">
              <label className="mb-1">Search by name</label>
              <div className="flex h-6 text-slate-500">
                {!Search && (
                  <div className="absolute flex space-x-1 items-center translate-x-4">
                    <BsSearch className="w-4" />
                    <p>Type here</p>
                  </div>
                )}
                <div className="flex items-center w-full">
                  <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-3 rounded-md h-8 w-full text-black border-slate-400 border-2"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-[#60af5ac4] hover:bg-[#84d17fc4] hover:text-[#388332c4]
                   text-white border-[#388332c4] border-2 px-2 rounded-r-md relative"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label>Appointment type</label>
              <select
                className="w-full rounded-md h-8 border-slate-400 border-2"
                onChange={(e) => setType(e.target.value)}
              >
                <option key="1">Show all</option>
                <option key="2">Online Consult</option>
                <option key="3">Face to face Consult</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>sort created book date by</label>
              <select
                className="w-full rounded-md h-8 border-slate-400 border-2"
                onChange={(e) => setCreated(e.target.value)}
              >
                <option key="1">descending</option>
                <option key="2">ascending</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>Appointment time</label>
              <select
                className="w-full rounded-md h-8 border-slate-400 border-2"
                onChange={(e) => settime(e.target.value)}
              >
                <option key="1">all</option>
                <option key="2">morning</option>
                <option key="3">afternoon</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>status</label>
              <select
                className="w-full rounded-md h-8 border-slate-400 border-2"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option key="1">Show all</option>
                <option key="2">pending</option>
                <option key="3">rescheduled</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label>Booked by someone</label>
              <select
                className="w-full rounded-md h-8 border-slate-400 border-2"
                onChange={(e) => setSomeone(e.target.value)}
              >
                <option key="1">Show all</option>
                <option key="2">Yes</option>
                <option key="3">No</option>
              </select>
            </div>
          </div>
        )}

        <div className=" flex justify-center">
          <div className="w-full text-sm flex mt-3 overflow-y-scroll max-h-[38rem] flex-wrap justify-between rounded-lg text-gray-500 dark:text-gray-400">
           
            {Loaded ? (
              books &&
              books.map((ol) => (
                <>
                  <Online
                    data-aos="fade-left"
                    key={ol.book_id}
                    ol={ol}
                    user={user}
                    CDNURL={CDNURL}
                    getImages={getImages}
                  />
                </>
              ))
            ):(
               <div className="w-full flex justify-center items-center">
              <MagnifyingGlass
                visible={true}
              
                width="50"
                ariaLabel="MagnifyingGlass-loading"
                wrapperStyle={{}}
                wrapperClass="MagnifyingGlass-wrapper"
                glassColor="#c0efffb7"
                color="#388332c4"
              />
              <p className="text-2xl text-slate-600">Searching</p>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentConfirmation;

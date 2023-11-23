import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "../../../config/Supabase";
import supabaseAdmin from "../../../config/supabaseAdmin";
import UserMap from "./EditDocMap";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import { BsSearch } from "react-icons/bs";
import { MagnifyingGlass } from "react-loader-spinner";

const EditDoctors = () => {
  const [books, setBook] = useState([]);
  const [filt, setFilt] = useState([]);
  const fetchBooks = async () => {
    const { data, error } = await supabase.from("Dr_information").select("*");
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      setFilt(data);
    }
  };
  useEffect(() => {
    fetchBooks();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Dr_information" },
        () => {
          fetchBooks();
        }
      )
      .subscribe();
  }, []);

  const fetchDocAcc = async () => {
    await supabaseAdmin.auth.admin.createUser({
      email: "user@email.com",
      password: "password",
      email_confirm: true,
      options: {
        data: {
          role: "doctor",
        },
      },
    });
  };
  const [User, setUsers] = useState();
  const fetchUsers = async () => {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.log(error);
    }
    if (data) {
      //console.log(data)
    }
  };

  const [PatientId, setPatientId] = useState();
  const fetchDocRole = async () => {
    const { error } = await supabase
      .from("profile")
      .update({ role: "doctor" })
      .eq("email", "user@email.com");
    if (error) {
      console.log(error);
    }
  };

  //Filter function
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

  const [Loaded, setLoaded] = useState(true);

  //*search filter
  const [isFilterOpen, setisFilterOpen] = useState(false);
  const [searchLoad, setsearchLoad] = useState(true);
  const handleSearch = () => {
    setsearchLoad(false);
    const search = filt.filter((items) => {
      const fname = items.Name.toLowerCase().includes(Search.toLowerCase());
      return fname;
    });
    setBook(search);
    if (filt) {
      setTimeout(() => {
        setsearchLoad(true);
      }, 1000);
    }
  };
  //*Filter function
  useEffect(() => {
    if (filt) {
      const filterBook = filt
        .filter((item) => {
          const someone = item.specialization.includes(Someone);
          return someone;
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
      if (books) {
        setTimeout(() => {
          setLoaded(true);
        }, 1000);
      }
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

  // useEffect(() => {
  //   fetchDocRole();
  //   supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "profile" },
  //       () => {
  //         fetchDocRole();
  //       }
  //     )
  //     .subscribe();
  // }, []);

  return (
    <div className="back h-full w-full flex place-content-center">
      <div className="w-[80%] max-2xl:w-[90%] max-sm:w-full mt-10 rounded-lg p-10 max-sm:p-3 ">
        {/* filter */}
        <section>
          <div className=" flex justify-between items-center mt-10 mb-3 ">
            <div
              onClick={() => setisFilterOpen(!isFilterOpen)}
              className="px-4 py-1 items-center select-none hover:cursor-pointer w-fit transition duration-75 
                         ease-in hover:bg-[#78b673f8] bg-[#98dd93c4] text-[#295f34] mx-4  rounded-full
                       hover:text-white flex"
            >
              {isFilterOpen ? (
                <>
                  <VscFilterFilled className="text-2xl mr-2" />
                  <p className="">Close Filter</p>
                </>
              ) : (
                <>
                  <VscFilter className="text-2xl mr-2" />
                  <p className="">Filter</p>
                </>
              )}
            </div>
          </div>
          <div
            className={`${
              isFilterOpen
                ? "transition-all duration-300 ease-in overflow-y-visible max-h-[20rem]"
                : "transition-all duration-300 ease-out overflow-y-hidden max-h-0"
            }`}
          >
            <div
              className="bg-[#98dd93c4] px-5 pt-5 pb-8 mb-2 rounded-lg items-center gap-x-7 gap-y-4 grid
             grid-cols-3"
            >
              <div className="flex flex-col">
                <label className="mb-1">Search by name</label>
                <div className="flex h-6 text-slate-500">
                  {!Search && (
                    <div
                      className={`${
                        isFilterOpen
                          ? "absolute flex space-x-1 items-center translate-x-4"
                          : "hidden"
                      }`}
                    >
                      <BsSearch className="w-4" />
                      <p>Type here</p>
                    </div>
                  )}
                  <div className="flex items-center w-full">
                    <input
                      type="text"
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-3 rounded-l-md h-8 w-full text-black border-slate-400 border-2"
                    />
                    <button
                      onClick={handleSearch}
                      className="bg-[#60af5ac4] h-8 border-l-0 hover:bg-[#84d17fc4] hover:text-[#388332c4]
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
          </div>
        </section>
        <button onClick={fetchDocAcc}>submit</button>
        <div className="grid -z-[0] md:grid-cols-3 max-[844px]:grid-cols-2 mx-auto justify-center max-sm:gap-y-0 xl:grid-cols-4 gap-x-10   gap-y-2">
          {searchLoad ? (
            books &&
            books.map((data) => (
              <UserMap
                ol={data}
                setPatientId={setPatientId}
                PatientId={PatientId}
              />
            ))
          ) : (
            <div className="w-full flex justify-center mt-20">
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
  );
};

export default EditDoctors;

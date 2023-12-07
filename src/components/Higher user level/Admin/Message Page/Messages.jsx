import React from "react";
import { useState } from "react";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import { BsSearch } from "react-icons/bs";
import { MagnifyingGlass } from "react-loader-spinner";
import MessagesPaginated from "./MessagesPaginated";
import { FaMessage, FaRegMessage } from "react-icons/fa6";
import { FaRegStar, FaStar } from "react-icons/fa";
import Ratings from "./Ratings/Ratings"

const MessagesAdmin = ({ CDNURL }) => {
  const [message, setMessage] = useState();
  const [Loaded, setLoaded] = useState(false);
  const [filt, setFilt] = useState([]);
  //*Get Messages
  const fetchMessages = async () => {
    setLoaded(false);
    const { data: mess, error: messErr } = await supabase
      .from("messages")
      .select();
    if (messErr) {
      toast.error(messErr.message, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", messErr.message);
    }

    if (mess) {
      setLoaded(true);
      setFilt(mess);
    }
  };

  //*Realtime data
  useEffect(() => {
    fetchMessages();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          fetchMessages();
        }
      )
      .subscribe();
  }, []);

  //*get filter inputs
  const [Search, setSearch] = useState("");
  const [Type, setType] = useState("");
  const [createdAt, setCreated] = useState("");
  const [isAsc, setisAsc] = useState(true);
  useEffect(() => {
    //created at
    if (createdAt === "recent to oldest") {
      setisAsc(true);
    } else if (createdAt === "oldest to recent") {
      setisAsc(false);
    }
    //Type
    if (Type === "Show all") {
      setType("");
    }
  }, [createdAt, setisAsc, Type, setType]);

  //*search filter
  const [searchLoad, setsearchLoad] = useState(true);
  const handleSearch = () => {
    setsearchLoad(false);
    const search = filt.filter((items) => {
      const name = items.name.toLowerCase().includes(Search.toLowerCase());
      return name;
    });
    setMessage(search);
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
          const type = item.type.toLowerCase().includes(Type.toLowerCase());
          return type;
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
      setMessage(filterBook);
      if (message) {
        setTimeout(() => {
          setLoaded(true);
        }, 1000);
      }
    }
  }, [isAsc, Type, setMessage, filt]);

  //*Switch Page
  const [isRatings, setIsRatings] = useState(false);

  return (
    <div className="back min-h-screen h-auto flex justify-center py-10">
      <div className="w-[70%] ">
        {/* Buttons to switch Messages and Ratings */}
        <div className="flex items-center mt-10 space-x-1 -ml-3 w-full">
          <button
            onClick={(e) => setIsRatings(false) || e.preventDefault()}
            className={`${
              isRatings
                ? "px-4 py-1 items-center select-none hover:cursor-pointer w-fit transition duration-75 ease-in hover:bg-[#78b673f8] bg-[#98dd93c4] text-[#295f34] mx-4  rounded-full hover:text-white flex"
                : "px-4 py-1 items-center select-none hover:cursor-pointer w-fit transition duration-75 ease-in bg-[#78b673f8] text-white mx-4 rounded-full flex"
            }`}
          >
            {isRatings ? (
              <>
                <FaRegMessage className="mr-1" /> <span>Messages</span>
              </>
            ) : (
              <>
                <FaMessage className="mr-1" /> <span>Messages</span>
              </>
            )}
          </button>
          <button
            onClick={(e) => setIsRatings(true) || e.preventDefault()}
            className={`${
              isRatings
                ? "px-4 py-1 items-center select-none hover:cursor-pointer w-fit transition duration-75 ease-in bg-[#78b673f8] text-white mx-4 rounded-full flex"
                : "px-4 py-1 items-center select-none hover:cursor-pointer w-fit transition duration-75 ease-in hover:bg-[#78b673f8] bg-[#98dd93c4] text-[#295f34] mx-4  rounded-full hover:text-white flex"
            }`}
          >
            {isRatings ? (
              <>
                <FaStar className="mr-1" /> <span>Ratings</span>
              </>
            ) : (
              <>
                {" "}
                <FaRegStar className="mr-1" /> <span>Ratings</span>
              </>
            )}
          </button>
        </div>
        <p className="text-4xl font-semibold text-[#315E30]"></p>
        {/*search and filter */}
        {isRatings ? (
          <Ratings />
        ) : (
          <>
            <div className="grid grid-cols-3 items-center w-full gap-y-5 justify-start gap-x-8 py-4">
              {/* <div className="col-span-3 w-full flex items-center mb-3">Filter Results</div> */}

              <div className="flex flex-col w-full">
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
              <div className="flex flex-col w-full">
                <label>Message Type</label>
                <select
                  className="w-full rounded-md h-8 border-slate-400 border-2"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option key="0">Show all</option>
                  <option id="1">Complaint</option>
                  <option id="2">Commendation</option>
                  <option id="2">Service Inquiry</option>
                </select>
              </div>
              <div className="flex flex-col w-full">
                <label>sort date by</label>
                <select
                  className="w-full rounded-md h-8 border-slate-400 border-2"
                  onChange={(e) => setCreated(e.target.value)}
                >
                  <option key="1">recent to oldest</option>
                  <option key="2">oldest to recent</option>
                </select>
              </div>
            </div>
            <div className=" flex justify-center">
              <div
                className="w-full h-auto min-h-screen text-sm flex mt-3 mb-10 flex-wrap justify-between
           rounded-lg text-gray-500 dark:text-gray-400"
              >
                {searchLoad ? (
                  <MessagesPaginated
                    // setOpenMessage={setOpenMessage}
                    books={message}
                    CDNURL={CDNURL}
                    setLoaded={setLoaded}
                    Loaded={Loaded}
                  />
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
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;

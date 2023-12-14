import React, { useEffect, useState } from "react";
import supabase from "../../../../config/Supabase";
import ProgressBar from "@ramonak/react-progress-bar";
import { toast } from "react-toastify";
import RatingsPaginated from "./RatingsPaginated";
import _ from "lodash";
//import { CProgress, CProgressBar } from "@coreui/react";
//import ProgressBar from 'react-bootstrap/ProgressBar'

const Ratings = () => {
  //*Get Messages
  const [Loaded, setLoaded] = useState(false);
  const [rateSort, setRateSort] = useState([]);
  const [star, setStar] = useState([]);
  const [starCount, setStarCount] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    total: "",
  });

  const fetchRatings = async () => {
    setLoaded(false);
    try {
      const { data: mess, error: messErr } = await supabase
        .from("ratings")
        .select();
      if (mess) {
        setLoaded(true);
        setStar(mess);
      }
      if (messErr) {
        throw messErr;
      }
    } catch (error) {
      setLoaded(true);
      toast.error(error.message, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    }
  };
  useEffect(() => {
    //*Realtime data.
    fetchRatings();
    const fetchAndSubscribe = async () => {
      await fetchRatings();
      const realtime = supabase
        .channel("room1")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "ratings" },
          (payload) => {
            setStar(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
  }, []);

  const [sortInput, setSortInput] = useState();
  const getSortedData = (data, sortBy) => {
    switch (sortBy) {
      case "date oldest to recent":
        return _.orderBy(data, ["created_at"], ["asc"]);
      case "date recent to oldest":
        return _.orderBy(data, ["created_at"], ["desc"]);
      case "star highest to lowest":
        return _.orderBy(data, ["rate"], ["desc"]);
      case "star lowest to highest":
        return _.orderBy(data, ["rate"], ["asc"]);
      default:
        return _.orderBy(data, ["created_at"], ["desc"]);
    }
  };
  useEffect(() => {
    setRateSort(getSortedData(star, sortInput));
  }, [sortInput, star]);

  useEffect(() => {
    if (star) {
      const sOne = star.filter((item) => {
        return item.rate.includes("1");
      });
      const sTwo = star.filter((item) => {
        return item.rate.includes("2");
      });
      const sThree = star.filter((item) => {
        return item.rate.includes("3");
      });
      const sFour = star.filter((item) => {
        return item.rate.includes("4");
      });
      const sFive = star.filter((item) => {
        return item.rate.includes("5");
      });

      setStarCount((prev) => ({
        ...prev,
        one: sOne.length,
        two: sTwo.length,
        three: sThree.length,
        four: sFour.length,
        five: sFive.length,
        midTotal:
          sOne.length +
          sTwo.length +
          sThree.length +
          sFour.length +
          sFive.length / 5,
        total:
          sOne.length +
          sTwo.length +
          sThree.length +
          sFour.length +
          sFive.length,
      }));
    }
  }, [star, sortInput]);

  return (
    <div className="flex flex-col space-y-3">
      <h1 className="font-semibold mt-7 text-xl">{starCount.total} Reviews</h1>
      <div className="flex flex-col ml-5 space-y-4 text-green-600">
        <div className="flex items-center space-x-4">
          <p className="flex w-fit whitespace-nowrap">5 Stars</p>
          <ProgressBar
            completed={starCount.five}
            maxCompleted={starCount.midTotal}
            bgColor="#fcba03"
            baseBgColor="white"
            height="10px"
            isLabelVisible={false}
            className="w-[40rem] shadow-md"
          />
          <p className="flex w-fit whitespace-nowrap">({starCount.five})</p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="flex w-fit whitespace-nowrap">4 Stars</p>
          <ProgressBar
            completed={starCount.four}
            maxCompleted={starCount.midTotal}
            bgColor="#fcba03"
            baseBgColor="white"
            height="10px"
            isLabelVisible={false}
            className="w-[40rem] shadow-md"
          />
          <p className="flex w-fit whitespace-nowrap">({starCount.four})</p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="flex w-fit whitespace-nowrap">3 Stars</p>
          <ProgressBar
            completed={starCount.three}
            maxCompleted={starCount.midTotal}
            bgColor="#fcba03"
            baseBgColor="white"
            height="10px"
            isLabelVisible={false}
            className="w-[40rem] shadow-md"
          />
          <p className="flex w-fit whitespace-nowrap">({starCount.three})</p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="flex w-fit whitespace-nowrap">2 Stars</p>
          <ProgressBar
            completed={starCount.two}
            maxCompleted={starCount.midTotal}
            bgColor="#fcba03"
            baseBgColor="white"
            height="10px"
            isLabelVisible={false}
            className="w-[40rem] shadow-md"
          />
          <p className="flex w-fit whitespace-nowrap">({starCount.two})</p>
        </div>
        <div className="flex items-center space-x-4">
          <p className="flex w-fit whitespace-nowrap">1 Stars</p>
          <ProgressBar
            completed={starCount.one}
            maxCompleted={starCount.midTotal}
            bgColor="#fcba03"
            baseBgColor="white"
            height="10px"
            isLabelVisible={false}
            className="w-[40rem] shadow-md"
          />
          <p className="flex w-fit whitespace-nowrap">({starCount.one})</p>
        </div>
      </div>
      <div className="flex flex-col">
        <p>Sort by:</p>
        <select
          onChange={(e) => setSortInput(e.target.value)}
          className="w-fit px-2 py-1 rounded-md border-2 border-slate-300"
        >
          <option key={1}>date recent to oldest</option>
          <option key={2}>date oldest to recent</option>
          <option key={3}>star highest to lowest</option>
          <option key={4}>star lowest to highest</option>
        </select>
      </div>
      <RatingsPaginated
        books={rateSort}
        sortInput={sortInput}
        setLoaded={setLoaded}
        Loaded={Loaded}
      />
    </div>
  );
};

export default Ratings;

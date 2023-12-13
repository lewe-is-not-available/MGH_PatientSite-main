import React, { useState } from "react";
import { cardio } from "ldrs";
import { Link, useParams } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { MdCheckCircleOutline } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

cardio.register();

const SuccessLoggedIn = ({ user }) => {
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState();
  const [message, setMessage] = useState();
  const [Load, setLoad] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const id = useParams();

  async function onSubmit(e) {
    e.preventDefault();
    setLoad(true);
    if (rating === null) {
      toast.error("Please give us a rating before submitting", {
        autoClose: false,
        id: "error",
      });
      setLoad(false);
      return;
    }
    const { error } = await supabase
      .from("ratings")
      .insert({ user_id: user.id, message, rate: rating });
    try {
      if (error) throw error;
      else {
        setSubmitted(true);
        setLoad(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoad(false);
    }
  }
  return (
    <div className="w-full flex flex-col text-center items-center justify-center">
      <h2 className="text-3xl font-semibold text-green-600">
        Booking Succesful!
      </h2>
      <h1 className="text-xl">
        <br />
        Your appointment has been submitted Succesfully and is waiting for
        confirmation
      </h1>
      <p className="text-lg">
        click the button below to check you appointment status
      </p>
      <Link
        to={"/Appointment/Patient/Details/" + id.bookID}
        className="bg-[#16891d] text-white transition duration-75 border-[3px] hover:text-green-800 hover:border-green-600 hover:bg-[#A5DD9D] border-[#16891d] w-[50%] py-2 mt-9 text-xl rounded-md"
      >
        Check Appointment Status
      </Link>
      <div className="w-full border-b-2 border-slate-300 mt-9 mb-3"></div>
      {Load ? (
        <>Loading</>
      ) : (
        <>
          {submitted ? (
            <div className="text-center mt-10">
              <p className="text-3xl flex items-center text-green-600"><FaCheckCircle className="text-3xl mr-1"/> <span>Review Submitted Succesfully!</span></p>
              <p className="text-xl mt-2">Thank you for your response</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="w-full">
              <label className="text-lg">How was your booking?</label>
              <div className="flex items-center justify-center mt-2 space-x-3 text-5xl text-slate-500">
                {[...Array(5)].map((star, i) => {
                  const currentRating = i + 1;
                  return (
                    <label key={i}>
                      <input
                        required
                        type="radio"
                        className="hidden"
                        value={currentRating}
                        onClick={() => setRating(currentRating)}
                      />
                      <IoStar
                        className={
                          currentRating <= (hover || rating)
                            ? "text-[#ffc107]"
                            : "text-[#c4e5e9]"
                        }
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(null)}
                      />
                    </label>
                  );
                })}
              </div>
              <textarea
                required
                placeholder="Tell us something more about your experience"
                type="text"
                className="w-full p-2 border-2 border-slate-400 mt-3 mb-6"
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="px-8 py-2 rounded-md transition duration-100 border-[#16891d] border-[2px] hover:bg-[#16891d] hover:text-white bg-[#a5e5a9] text-[#106716]"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default SuccessLoggedIn;

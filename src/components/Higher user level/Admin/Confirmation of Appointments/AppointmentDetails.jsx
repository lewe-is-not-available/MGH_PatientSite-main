import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

const AppointmentDetails = () => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  //*get patient's appointment details
  const { id } = useParams();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [Email, setEmail] = useState("");
  const [isSomeone, setisSomeone] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("patient_Appointments")
        .select()
        .eq("book_id", id)
        .single();

      if (error) {
        toast.error(error + " error", {
          toastId: "error",
        });
      }
      if (data.someone === "Yes") {
        setisSomeone(true);
      } else {
        setisSomeone(false);
      }
      setEmail(data.email);
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);
  console.log(isSomeone);
  //*getting image
  useEffect(() => {
    if (Email) {
      async function getImages() {
        const { data, error } = await supabase.storage
          .from("images")
          .list(Email + "/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (data[1]) {
          setImgEmpty(true);
          setimgName(data[1].name);
        }

        if (error) {
          setImgEmpty(false);
          console.log(error);
        }
      }
      getImages();
    }
  }, [setimgName, Email, setImgEmpty]);

  //*date format
  const date = new Date(data.created_at);
  function formateDateTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "pm" : "am";

    return `${year}/${month}/${day} ${hours}:${minutes}${ampm}`;
  }
  //*accepting the appointment
  const navigate = useNavigate();
  async function handleAccept(e) {
    e.preventDefault();
    const { error } = await supabase
      .from("patient_Appointments")
      .update({ status: "Confirmed" })
      .eq("book_id", id);
    if (error) {
      console.log(error);
    }
    navigate("/Confirm_Appointments");
  }

  return (
    <div className="back flex flex-col items-center h-screen w-full">
      <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
        Appointment details
      </h1>
      <form className="flex flex-col px-12 py-10 mt-10 bg-white w-[80%] abs">
        {loading ? (
          <div className="flex justify-center w-full ">
            <Oval
              height={80}
              width={80}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : (
          <div className="grid grid-cols-4 row-span-2">
            <div className="flex flex-col text-center items-center">
              <img
                className="object-cover rounded-full shadow-xl w-[13rem] mb-5 h-[13rem]"
                src={`${
                  isImgEmpty
                    ? CDNURL + data.email + "/" + imgName
                    : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                }`}
                alt="/"
              />
              <div className="w-full space-y-3">
                <p>
                  <span className="font-semibold">Patient Name:</span>
                  <br />
                  {data.fname} {data.lname}
                </p>
                <p>
                  <span className="font-semibold">Patient Email:</span>
                  <br />
                  {data.email}{" "}
                </p>
                <p>
                  <span className="font-semibold">Contact Number:</span>
                  <br />
                  {data.number}
                </p>
              </div>
            </div>
            <div className="flex flex-col text-left items-left mt-10 space-y-8">
              <p>
                <span className="font-semibold">Booking Reference id:</span>
                <br />
                {data.book_id}
              </p>
              <p>
                <span className="font-semibold">Booked at:</span>
                <br />
                {formateDateTime(date)}
              </p>
              <p>
                <span className="font-semibold">Appointment day:</span>
                <br />
                {data.date}
              </p>

              <p>
                <span className="font-semibold">Reason of appointment:</span>
                <br />
                {data.reason}
              </p>
            </div>
            <div className="flex flex-col text-left items-left mt-10 space-y-8">
              <p>
                <span className="font-semibold">Booked for someone?</span>
                <br />
                {data.someone}{" "}
              </p>
              <p>
                <span className="font-semibold">Patient Birthdate:</span>
                <br />
                {data.bday}
              </p>
              {isSomeone && (
                <>
                  <p>
                    <span className="font-semibold">
                      Relation of patient to the person who booked:
                    </span>
                    <br />
                    {data.relation}
                  </p>
                  <p>
                    <span className="font-semibold">
                      Name of the authorized representative:
                    </span>
                    <br />
                    {data.relation}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex justify-center text-white space-x-3">
                <button
                  onClick={handleAccept}
                  className="transition duration-100 bg-green-600 hover:bg-green-400 px-2 rounded-full "
                >
                  accept
                </button>
                <button className="transition duration-100 bg-red-600 hover:bg-red-400 px-2 rounded-full ">
                  reject
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
export default AppointmentDetails;

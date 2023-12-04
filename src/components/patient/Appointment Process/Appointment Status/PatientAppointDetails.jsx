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
  //*getting image for patient
  useEffect(() => {
    if (Email) {
      async function getImages() {
        const { data, error } = await supabase.storage
          .from("images")
          .list(Email + "/profile/", {
            limit: 10,
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
      getImages();
    }
  }, [setimgName, Email, setImgEmpty]);

  //*Get doctor details
  const [Doc, setDoc] = useState([]);
  async function fetchDoc() {
    if (data.docname) {
      const { data: DocDetails, error: failDoc } = await supabase
        .from("dr_information")
        .select()
        .eq("name", data.docname)
        .single();
      try {
        if (failDoc) throw failDoc;
        setDoc(DocDetails);
        console.log(DocDetails);
      } catch (failDoc) {
        console.log(failDoc);
      }
    }
  }

  //*getting image for doctor
  const [docImg, setDocImg] = useState();
  const [isDocImgEmpty, setisDocImgEmpty] = useState(false);
  useEffect(() => {
    if (Doc.email) {
      async function getImageDoc() {
        const { data, error } = await supabase.storage
          .from("images")
          .list(Doc.email + "/profile/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (data[0]) {
          setisDocImgEmpty(true);
          setDocImg(data[0].name);
        }

        if (error) {
          setisDocImgEmpty(false);
          console.log(error);
        }
      }
      getImageDoc();
    }
  }, [Doc.Email]);
  //*Realtime
  useEffect(() => {
    fetchDoc(data.docname);
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dr_information" },
        () => {
          fetchDoc();
        }
      )
      .subscribe();
  }, [data.docname]);
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

  //*Convert to am/pm time
  const convertToAMPM = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="back flex flex-col items-center min-h-screen h-auto pb-10 w-full">
      <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
        Appointment details
      </h1>
      <section className="flex flex-col px-12 py-10 mt-10 rounded-lg bg-white w-[80%] abs">
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
          <div className="grid grid-cols-4 gap-x-4 row-span-2">
            <div className="flex flex-col text-center items-center">
              <img
                className="object-cover rounded-full shadow-xl w-[13rem] mb-5 h-[13rem]"
                src={`${
                  isImgEmpty
                    ? CDNURL + data.email + "/profile/" + imgName
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
            <div className="flex flex-col text-left items-left mt-10 space-y-8">
              <div className="flex flex-col justify-center space-x-3">
                <span className="font-semibold">Queuing Number:</span>
                <h2 className="text-6xl font-semibold">6</h2>
              </div>
              <p>
                <span className="font-semibold">Status:</span>
                <br />
                <p className="px-4 text-white rounded-full bg-primary w-fit">
                  {data.status}
                </p>
              </p>
            </div>
          </div>
        )}
      </section>
      <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
        Doctor's details
      </h1>
      <section className="flex flex-col px-12 py-10 mt-10 bg-white w-[80%] abs">
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
          <div className="grid grid-cols-3 text-lg row-span-2 gap-3">
            {Doc && (
              <>
                <div className="flex flex-col  text-center items-center">
                  <img
                    className="object-cover rounded-md shadow-xl w-[15rem] mb-5 h-[15rem]"
                    src={`${
                      isDocImgEmpty
                        ? CDNURL + Doc.email + "/profile/" + docImg
                        : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/doc.jpg"
                    }`}
                    alt="/"
                  />
                </div>

                <div className="flex flex-col text-left items-left mt-10 space-y-8 pr-6">
                  <p className="">
                    <span className="font-semibold">Doctor's Name:</span>
                    <br />
                    {Doc.honorific} {Doc.name}
                  </p>
                  <p>
                    <span className="font-semibold">Consultation type:</span>
                    <br />
                    {Doc.type === "ol" ? "Online Consultation" : "Face to face"}
                  </p>
                </div>
                <div className="flex flex-col text-left items-left mt-10 space-y-8 pr-6">
                  <p>
                    <span className="font-semibold">Doctor id:</span>
                    <br />
                    {Doc.id}
                  </p>
                  <p>
                    <span className="font-semibold">Specialization:</span>
                    <br />
                    {Doc.specialization}
                  </p>
                  <p>
                    <span className="font-semibold">Sub-specialization:</span>
                    <br />
                    {Doc.subspecial}
                  </p>
                </div>
              </>
            )}
            <div className="col-span-4 flex justify-center text-xl font-semibold ">
              <p>Schedule</p>
            </div>
            <div className="flex-col items-center  col-span-4">
              <div className="bg-green-600 grid grid-cols-4 w-full text-white py-2 col-span-4 justify-center px-10">
                <p className="col-span-2">Days</p>
                <p className="text-center">Check In</p>
                <p className="text-center">Check Out</p>
              </div>
              {Doc.schedule &&
                Doc.schedule.map((item) => (
                  <div className="col-span-3 bg-slate-200 py-2 grid grid-cols-4 w-full my-3 px-10">
                    <div className="col-span-2 ">{item.day}</div>
                    <div className="text-center">
                      {convertToAMPM(item.startTime)}
                    </div>
                    <div className="text-center">
                      {convertToAMPM(item.endTime)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
export default AppointmentDetails;

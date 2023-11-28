import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

const DocDetails = () => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  //*get doctor's details
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("dr_information")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      toast.error(error + " error", {
        toastId: "error",
      });
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setData(data);
      setSched(data.sched)
    }
  };

  //*Get Appointment Details
  const [Appoint, setAppoint] = useState([]);
  const [AppCount, setAppCount] = useState([]);
  const [FinishedAppCount, setFinishedAppCount] = useState([]);
  const [Sched, setSched] = useState([]);
  //*realtime
  useEffect(() => {
    fetchData();
    supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "dr_information" },
        () => {
          fetchData();
        }
      )
      .subscribe();
  }, []);

  //*Get appointment count for doctor
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data: books, error: fail } = await supabase
        .from("patient_Appointments")
        .select()
        .eq("docname", data && data.name);

      try {
        if (fail) throw fail;
        else {
          if (data.name) {
            setAppoint(books);
          }
        }
      } catch (fail) {
        toast.error(fail.message, { autoClose: false, id: "Error" });
      }
    };
    fetchAppointments();
  }, [data.name]);

  useEffect(() => {
    if (Appoint) {
      const Pfiltered = Appoint.filter((item) => {
        const stat = !item.status.includes("Completed");
        return stat;
      });
      const finished = Appoint.filter((item) => {
        const stat1 = item.status.includes("Completed");
        return stat1;
      });
      setAppCount(Pfiltered);
      setFinishedAppCount(finished);
    }
  }, [Appoint]);

  //*getting image
  useEffect(() => {
    if (data.email) {
      async function getImages() {
        const { data: pic, error } = await supabase.storage
          .from("images")
          .list(data.email + "/profile/", {
            limit: 10,
            offset: 0,
            sortBy: { column: "created_at", order: "asc" },
          });

        if (pic[0]) {
          setImgEmpty(true);
          setimgName(pic[0].name);
        }

        if (error) {
          setImgEmpty(false);
          console.log(error);
        }
      }
      getImages();
    }
  }, [setimgName, data.email, setImgEmpty]);

  //*Convert to am/pm time
  const convertToAMPM = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <div className="back flex flex-col items-center min-h-screen h-auto w-full">
      <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
        Doctor's details
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
          <div className="grid grid-cols-3 text-lg row-span-2 gap-3">
            {data && (
              <>
                <div className="flex flex-col  text-center items-center">
                  <img
                    className="object-cover rounded-md shadow-xl w-[15rem] mb-5 h-[15rem]"
                    src={`${
                      isImgEmpty
                        ? CDNURL + data.email + "/profile/" + imgName
                        : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
                    }`}
                    alt="/"
                  />
                  <div className="w-full space-y-3">
                    <p className="">
                      <span className="font-semibold">Name:</span>
                      <br />
                      {data.honorific} {data.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>
                      <br />
                      {data.email}{" "}
                    </p>
                    <p>
                      <span className="font-semibold">Contact Number:</span>
                      <br />
                      {data.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col text-left items-left mt-10 space-y-8 pr-6">
                  <p>
                    <span className="font-semibold">Doctor id:</span>
                    <br />
                    {data.id}
                  </p>
                  <p>
                    <span className="font-semibold">Specialization:</span>
                    <br />
                    {data.specialization}
                  </p>
                  <p>
                    <span className="font-semibold">Appointment day:</span>
                    <br />
                    {data.subspecial}
                  </p>

                  <p>
                    <span className="font-semibold">Consultation type:</span>
                    <br />
                    {data.type === "ol"
                      ? "Online Consultation"
                      : "Face to face"}
                  </p>
                </div>
                <div className="flex flex-col text-left items-left mt-10 space-y-8">
                  <div>
                    <span className="font-semibold">
                      Pending booked appointments:
                    </span>
                    <br />
                    <div className="text-5xl font-semibold">{AppCount.length === 0 ? <p className="text-lg w-[18rem] font-thin">No pending booked appointments yet</p> : AppCount.length}</div>
                  </div>
                  <p>
                    <span className="font-semibold">
                      Completed Appointments:
                    </span>
                    <br />
                    <p className="text-5xl font-semibold">
                      {FinishedAppCount.length === 0 ? <p className="text-lg w-[16rem] font-thin">No completed appointments yet</p> : FinishedAppCount.length}
                    </p>
                  </p>
                </div>
              </>
            )}

            <div className="flex-col items-center  col-span-4">
              <div className="bg-green-600 grid grid-cols-4 w-full text-white py-2 col-span-4 justify-center px-10">
                <p className="col-span-2">Days</p>
                <p className="text-center">Check In</p>
                <p className="text-center">Check Out</p>
              </div>
              {data.schedule.map((item) => (
                <div className="col-span-3 bg-slate-200 py-2 grid grid-cols-4 w-full my-3 px-10">
                  <div className="col-span-2 ">{item.day}</div>
                  <div className="text-center">{convertToAMPM(item.startTime)}</div>
                  <div className="text-center">{convertToAMPM(item.endTime)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default DocDetails;

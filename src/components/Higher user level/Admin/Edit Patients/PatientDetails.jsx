import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../config/Supabase";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import EditPatientModal from "./EditPatientModal";
import ConfirmDelete from "./ConfirmDelete";

const PatientDetails = () => {
  const CDNURL =
    "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/";
  const [imgName, setimgName] = useState([]);
  const [isImgEmpty, setImgEmpty] = useState(false);

  //*get doctor's details
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const fetchData = async () => {
    const { data, error: profileErr } = await supabase
      .from("profile")
      .select()
      .eq("id", id)
      .single();

    if (profileErr) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      nav("/Edit_Patients");
    } else {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      setData(data);
    }
  };
  const [confirmDelete, setConfirmDelete] = useState(false);

  //*Get Appointment Details
  const [Appoint, setAppoint] = useState([]);
  const [AppCount, setAppCount] = useState([]);
  const [FinishedAppCount, setFinishedAppCount] = useState([]);
  //*realtime
  useEffect(() => {
    fetchData();
    supabase
      .channel("room1")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        () => {
          fetchData();
        }
      )
      .subscribe();
  }, []);
  //*Get appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      const { data: books, error: fail } = await supabase
        .from("patient_Appointments")
        .select()
        .eq("email", data && data.email);

      try {
        if (fail) throw fail;
        else {
          if (data.email) {
            setAppoint(books);
          }
        }
      } catch (fail) {
        toast.error(fail.message, { autoClose: false, id: "Error" });
      }
    };
    fetchAppointments();
  }, [data.email]);
  //*filteration for count
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
        const { data: pic, error: imageErr } = await supabase.storage
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

        if (imageErr) {
          setImgEmpty(false);
          console.log(imageErr);
        }
      }
      getImages();
    }
  }, [setimgName, data.email, setImgEmpty]);

  //*open edit modal
  const [openEdit, setOpenEdit] = useState(false);
  if (openEdit) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-1 z-50">
        {openEdit && (
          <EditPatientModal
            isImgEmpty={isImgEmpty}
            CDNURL={CDNURL}
            imgName={imgName}
            data={data}
            setOpenEdit={setOpenEdit}
          />
        )}
        {confirmDelete && (
          <ConfirmDelete data={data} setConfirmDelete={setConfirmDelete} />
        )}
      </div>

      <div className="back flex flex-col items-center min-h-screen h-auto w-full">
        <h1 className="w-full text-3xl mt-10 text-center font-semibold text-[#256e2b] uppercase">
          Patient's details
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
                        {data.first_name} {data.last_name}
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
                      <span className="font-semibold">Patient's id:</span>
                      <br />
                      {data.id}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>
                      <br />
                      {data.address}
                    </p>
                    <p>
                      <span className="font-semibold">Birth date:</span>
                      <br />
                      {data.birthday}
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
                      <div className="text-5xl font-semibold">
                        {AppCount.length === 0 ? (
                          <p className="text-lg w-[18rem] font-thin">
                            No pending booked appointments yet
                          </p>
                        ) : (
                          AppCount.length
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold">
                        Completed Appointments:
                      </span>
                      <br />
                      <div className="text-5xl font-semibold">
                        {FinishedAppCount.length === 0 ? (
                          <p className="text-lg w-[16rem] font-thin">
                            No completed appointments yet
                          </p>
                        ) : (
                          FinishedAppCount.length
                        )}
                      </div>
                    </div>
                    <div className="flex justify-start items-center">
                      <button
                        onClick={(e) => setOpenEdit(true) || e.preventDefault()}
                        className="px-4 py-1 transition duration-75 hover:bg-primary-400 hover:text-white bg-primary-200 rounded-full flex space-x-2 items-center"
                      >
                        <FaRegEdit className="text-xl -mt-[3px]" />
                        <span>Edit patient's details</span>
                      </button>
                    </div>
                    <div className="flex justify-start items-center">
                      <button
                        onClick={(e) =>
                          setConfirmDelete(true) || e.preventDefault()
                        }
                        className="px-3 text-base py-1 transition duration-75 bg-red-600 hover:text-black text-white hover:bg-[#ff9090] rounded-full flex space-x-2 items-center"
                      >
                        <RiDeleteBin6Line className="text-xl -mt-[3px]" />
                        <span>Delete account</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientDetails;

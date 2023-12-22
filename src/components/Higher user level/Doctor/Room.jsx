import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import supabase from "../../config/Supabase";
import { toast } from "react-toastify";
import moment from "moment";
import { TiBackspace } from "react-icons/ti";

const Room = ({ user }) => {
  const isPatient = user.role === "patient";
  const isDoctor = user.role === "doctor";
  const { id } = useParams();
  const [doc, setDoc] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);
  async function fetchDoc() {
    const { data, error } = await supabase
      .from("dr_information")
      .select()
      .eq("id", id);
    if (data?.length !== 0) {
      setDoc(data[0]);
    } else if (error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    fetchDoc();
  }, [id, user]);

  //*Book Getter
  const [current, setBooks] = useState([]);
  const [nextSched, setnextSched] = useState([]);
  async function fetchBooks() {
    try {
      const { data: book, error } = await supabase
        .from("patient_Appointments")
        .select()
        .match({
          doc_id: id,
          status: "Consultation Ongoing",
        })
        .single();

      if (error) throw error;
      if (book) {
        setBooks(book);
      }
      //*Get Queued appointments today
      const { data: queNum, error: queErr } = await supabase
        .from("patient_Appointments")
        .select()
        .match({
          doc_id: id,
          date: moment(new Date()).format("yyyy-M-D"),
        })
        .or("status.eq.Confirmed,status.eq.rescheduled")
        .order("queue", { ascending: true });
      if (queErr) {
        throw queErr;
      }
      if (queNum) {
        setnextSched(queNum);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  //*Realtime
  useEffect(() => {
    fetchBooks();
    const fetchAndSubscribe = async () => {
      await fetchBooks();

      const realtime = supabase
        .channel("room10")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "patient_Appointments",
            filter: `doc_id=eq.${id}`,
          },
          () => {
            fetchBooks();
            if (nextSched.length === 0) {
              setBooks([]);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(realtime);
        realtime.unsubscribe();
      };
    };
    fetchAndSubscribe();
    if (isPatient && current && user.email && current.email) {
      if (current.email !== user.email) {
        nav("/");
      }
    }
  }, [isPatient, user, id]);
  const nav = useNavigate();

  async function handleNextConsult(e) {
    e.preventDefault();
    try {
      //*Start next consultation
      const { error: endErr } = await supabase
        .from("patient_Appointments")
        .update({ status: "Completed", current: null })
        .eq("book_id", current.book_id);
      if (endErr) throw endErr;

      if (nextSched) {
        //*Update Current Queue status
        const { error: nextCurrentErr } = await supabase
          .from("patient_Appointments")
          .update({ current: nextSched[0]?.queue })
          .match({
            doc_id: id,
            date: moment(new Date()).format("yyyy-M-D"),
          })
          .or("status.eq.Confirmed,status.eq.rescheduled");
        if (nextCurrentErr) throw nextCurrentErr;

        //*Start next consultation
        const { error: CurrentErr } = await supabase
          .from("patient_Appointments")
          .update({ status: "Consultation Ongoing" })
          .eq("book_id", nextSched[0]?.book_id);
        if (CurrentErr) throw CurrentErr;
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  //*UI for Video Conference kit
  const appID = 653232867;
  const serverSecret = process.env.REACT_APP_ZEGOCLOUD_SECRET;
  const roomid = id;

  async function meetingUI(e) {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomid,
      uuid(),
      (isDoctor ? doc?.honorific + " " : "") +
        user?.first_name +
        " " +
        user?.last_name
    );

    const ui = ZegoUIKitPrebuilt.create(kitToken);
    ui.joinRoom({
      container: e,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: true,
      maxUsers: 2,
      layout: "Auto",
      videoResolutionList: [
        ZegoUIKitPrebuilt.VideoResolution_360P,
        ZegoUIKitPrebuilt.VideoResolution_180P,
        ZegoUIKitPrebuilt.VideoResolution_480P,
        ZegoUIKitPrebuilt.VideoResolution_720P,
      ],
      showLayoutButton: false,

      onLeaveRoom: async () => {
        if (isPatient) {
          try {
            //*Complete current
            const { error: endErr } = await supabase
              .from("patient_Appointments")
              .update({ status: "Completed" })
              .eq("book_id", current.book_id);
            if (endErr) throw endErr;

            if (nextSched !== 0 && nextSched[0]?.queue !== undefined) {
              //*Update next Queue
              const { error: nextCurrentErr } = await supabase
                .from("patient_Appointments")
                .update({ current: nextSched[0]?.queue })
                .match({
                  doc_id: id,
                  date: moment(new Date()).format("yyyy-M-D"),
                })
                .or("status.eq.Confirmed,status.eq.rescheduled");
              if (nextCurrentErr) throw nextCurrentErr;

              //*Start next consultation
              const { error: CurrentErr } = await supabase
                .from("patient_Appointments")
                .update({ status: "Consultation Ongoing" })
                .eq("book_id", nextSched[0]?.book_id);
              if (CurrentErr) throw CurrentErr;
            } 
            nav("/Appointment/Patient/Details/" + current.book_id);
          
          } catch (error) {
            console.error(error.message);
          }
        }
      },
    });
  }
  const meetingRef = useRef();
  useEffect(() => {
    if (doc && user) {
      meetingUI(meetingRef.current);
    }
  }, [doc, user, isDoctor]);

  if (openConfirm) {
    document.documentElement.style.overflowY = "hidden";
  } else {
    document.documentElement.style.overflowY = "unset";
  }

  return (
    <>
      {/* {isPatient && openConfirm && (
        <div className="absolute w-full h-screen z-[60]">
          <ConfirmLeave setOpenConfirm={setOpenConfirm} />
        </div>
      )} */}
      <div className="back min-h-screen h-auto flex flex-col justify-center items-center">
        <div className="text-3xl flex w-full justify-center my-14 font-semibold uppercase">
          Consultation Room
        </div>
        {isPatient && (
          <div className="text-primary text-2xl -mt-10">
            NOTE: If you leave the meeting room, your consultation will be
            completed and you will not be able to rejoin again.
          </div>
        )}
        <div ref={meetingRef} className="w-[80%] h-[80vh]"></div>
        {isDoctor &&
          (current.length !== 0 ? (
            <div className="w-[65%] mb-20 mt-10 flex flex-wrap items-start bg-white abs rounded-lg p-7 space-x-10">
              <strong className="w-full text-3xl uppercase mb-3">
                Current meeting
              </strong>
              <div className="flex flex-col">
                <p className="text-2xl">Current Queue</p>
                <strong className="text-6xl">{current?.queue}</strong>
              </div>
              <div className="flex flex-col">
                <p className="text-2xl">Patient Name</p>
                <strong className="text-3xl">
                  {current?.fname + " " + current?.lname}
                </strong>
              </div>
              <div className="flex flex-col">
                <p className="text-2xl">Reason of appointment</p>
                <strong className="text-3xl">{current?.reason}</strong>
              </div>
              <div className="flex flex-col">
                <p className="text-2xl">Age</p>
                <strong className="text-3xl">
                  {moment(moment(new Date()).format("LL")).diff(
                    moment(current.bday).format("LL"),
                    "years"
                  )}
                </strong>
              </div>
              {nextSched !== 0 && nextSched[0]?.fname !== undefined ? (
                <div className="flex flex-col w-[18rem]">
                  <p className="text-lg">
                    If queue does not proceed with the next consultation{" "}
                    <span
                      onClick={handleNextConsult}
                      className="text-primary cursor-pointer hover:underline text-lg"
                    >
                      click here
                    </span>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col w-[18rem]">
                  <p className="text-lg">
                    If queue does not finish the consultation{" "}
                    <span
                      onClick={handleNextConsult}
                      className="text-primary cursor-pointer hover:underline text-lg"
                    >
                      click here
                    </span>
                  </p>
                </div>
              )}

              {nextSched !== 0 && nextSched[0]?.fname !== undefined && (
                <p className="w-full text-xl my-3">
                  Next in queue is with patient{" "}
                  <strong>
                    {nextSched[0]?.fname + " " + nextSched[0]?.lname}
                  </strong>
                </p>
              )}
            </div>
          ) : (
            <div className="py-7 px-20 flex flex-col my-10 w-fit abs items-center bg-white rounded-lg text-4xl font-semibold">
              <span>You have no consultation meetings left for today</span>
              <Link
                to="/Dashboard"
                className="mt-4 bg-green-400 hover:bg-green-600 transition duration-100 text-white px-12 py-1 flex items-center justify-center rounded-lg text-2xl font-light"
              >
                <TiBackspace className="text-3xl mr-2" />
                <span>Go back to dashboard</span>
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};

export default Room;

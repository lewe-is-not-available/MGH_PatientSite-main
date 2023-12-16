import moment from "moment";
import React from "react";
import { IoAdd } from "react-icons/io5";

const AppDetailPDF = ({
  data,
  isImgEmpty,
  CDNURL,
  imgName,
  isSomeone,
  payImg,
  Doc,
  isDocImgEmpty,
  docImg,
  AppPrint,
}) => {
  return (
    <div ref={AppPrint} className="flex flex-col items-center w-full">
      <h1 className="text-3xl font-semibold w-full flex justify-center text-center">
        Appointment Details
      </h1>
      <div className="grid grid-cols-3 gap-x-4 row-span-2 w-full">
        <div className="flex flex-col row-span-2 ">
          <img
            className="object-cover rounded-sm shadow-xl w-[13rem] mb-5 h-[13rem]"
            src={`${
              isImgEmpty
                ? CDNURL + data.email + "/profile/" + imgName
                : "https://iniadwocuptwhvsjrcrw.supabase.co/storage/v1/object/public/images/alternative_pic.png"
            }`}
            alt="/"
          />
          <div className="w-full space-y-8">
            <p>
              <span className="font-semibold">Patient Name:</span>
              <br />
              {data.fname} {data.lname}
            </p>
            <p>
              <span className="font-semibold">Patient Email:</span>
              <br />
              {data.email}
            </p>
            <p>
              <span className="font-semibold">Contact Number:</span>
              <br />
              {data.number}
            </p>
          </div>
        </div>
        <div className="flex flex-col text-left items-left mt-12 space-y-10 row-span-2">
          <p>
            <span className="font-semibold">Booking Reference id:</span>
            <br />
            {data.book_id}
          </p>
          <p>
            <span className="font-semibold">Booked at:</span>
            <br />
            {/* {formateDateTime(date)} */}
            {moment(new Date(data.created_at)).format("lll")}
          </p>
          <p>
            <span className="font-semibold">Appointment day:</span>
            <br />
            {moment(new Date(data.date)).format("ll")}
          </p>
          <p>
            <span className="font-semibold">Patient Birthdate:</span>
            <br />
            {moment(new Date(data.bday)).format("ll")}
          </p>
          <p>
            <span className="font-semibold">Reason of appointment:</span>
            <br />
            {data.reason}
          </p>
        </div>
        <div className="flex flex-col text-left items-left mt-10 space-y-10">
          <p>
            <span className="font-semibold">Booked for someone?</span>
            <br />
            {data.someone}
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
                {data.appointee}
              </p>
            </>
          )}
          <div className="flex flex-col text-left items-left mt-10 w-full space-y-3">
            {data.status === "rejected" ? (
              <>
                <div className="flex flex-col">
                  <span className="font-semibold">Status:</span>
                  <p className="text-white rounded-full bg-red-500 w-fit">
                    {data.status}
                  </p>
                  <p className="font-semibold mt-2">remark:</p>
                  <p>{data.remark}</p>
                </div>
              </>
            ) : (
              <>
                {data.status === "Confirmed" && (
                  <div className="flex flex-col justify-start h-full space-x-3">
                    <span className="font-semibold">Queuing Number:</span>
                    <h2 className="text-6xl font-semibold">{data.queue}</h2>
                  </div>
                )}
                <div>
                  <span className="font-semibold">Status:</span>
                  <br />
                  <p className="rounded-full bg-primary w-fit">{data.status}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="col-span-3 w-full h-full mt-6"></div>
        <div className="flex flex-col space-x-3 mb-14">
          <h1 className="font-semibold">Payment Screenshot/s:</h1>
          {payImg ? (
            <>
              {payImg.map((item, i) => (
                <div key={i} className="flex flex-col text-left">
                  <p className="w-full">
                    {i === 0 && "1st attempt"}
                    {i === 1 && "2nd attempt"}
                    {i === 2 && "last attempt"}
                  </p>
                  <img
                    className="object-cover cursor-pointer shadow-xl w-[13rem] mb-5 h-[13rem]"
                    src={
                      CDNURL +
                      data.email +
                      "/payment/" +
                      data.book_id +
                      "/" +
                      item.name
                    }
                    alt="/"
                  />
                </div>
              ))}
            </>
          ) : (
            <p>No Payment Sent</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 w-full text-lg row-span-2 gap-3">
        <h1 className="text-3xl col-span-4 mt-16 font-semibold w-full flex justify-center text-center">
          Doctor's Details
        </h1>
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
        <div className="col-span-4 flex justify-start text-xl font-semibold ">
          <p>Schedule</p>
        </div>
        <div className="flex-col items-center col-span-3">
          <div className="bg-green-600 grid grid-cols-4 w-full py-2 col-span-4 justify-center px-10">
            <p className="col-span-2">Days</p>
            <p className="text-center">Check In</p>
            <p className="text-center">Check Out</p>
          </div>
          {Doc.schedule &&
            Doc.schedule.map((item, i) => (
              <div 
              key={i}
              className="col-span-3 bg-slate-200 py-2 grid grid-cols-4 w-full my-3 px-10">
                <div className="col-span-2 ">{item.day}</div>
                <div className="text-center">
                  {moment(new Date(`2000-01-01T${item.startTime}`)).format(
                    "LT"
                  )}
                </div>
                <div className="text-center">
                  {moment(new Date(`2000-01-01T${item.endTime}`)).format("LT")}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AppDetailPDF;

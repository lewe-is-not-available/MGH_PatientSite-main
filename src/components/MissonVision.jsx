import React from "react";
import logo from "./images/MGHlogo.png";

const MissonVision = () => {
  return (
    <div className="h-full back flex flex-col items-center justify-center">
      <div className="h-[35rem] w-full company mb-14">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex">
            <img src={logo} alt="" className="w-52" />
            <div className="flex-col mt-4">
              <h1 className="text-7xl flex items-center w-[45.8rem] text-left ml-4 text-white flex-wrap font-bold">
                MENDOZA GENERAL HOSPITAL
              </h1>
              <p className="text-white text-3xl mt-4 ml-5">MISSION AND VISION</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white abs w-[50%] py-8 px-14 mb-16 rounded-md bg-opacity-70 text-center text-xl">
        <h1 className="text-[#3f7c3e] text-3xl font-semibold mb-5">MISSION</h1>
        <p className="text-justify indent-20 text-slate-700 font-sans mb-10">
          <span className="font-semibold">
            To provide exceptional and patient-centered ambulatory surgical care
            in a safe, efficient, and compassionate environment.
          </span>{" "}
          <br />
          <br />
          We strive to deliver the highest quality surgical services, focusing
          on individualized patient needs, while fostering a culture of
          excellence, innovation, and continuous improvement. To provide
          exceptional and patient-centered ambulatory surgical care in a safe,
          efficient, and compassionate environment. We strive to deliver the
          highest quality surgical services, focusing on individualized patient
          needs, while fostering a culture of excellence, innovation, and
          continuous improvement.
        </p>
        <h1 className="text-[#3f7c3e] text-3xl font-semibold mb-5">VISION</h1>
        <p className="text-justify indent-20 text-slate-700 font-sans">
          <span className="font-semibold">
            To be the leading ambulatory surgical clinic, recognized for our
            commitment to outstanding surgical outcomes, exceptional patient
            experiences, and a collaborative approach to healthcare.
          </span>{" "}
          <br />
          <br />
          We aim to be the preferred choice for patients, physicians, and
          healthcare partners, setting the benchmark for excellence in
          ambulatory surgical care. Through a dedicated and skilled team,
          state-of-the-art facilities, and advanced surgical techniques, we
          aspire to be at the forefront of advancements in ambulatory surgery,
          continuously raising the standards of patient care and satisfaction.
        </p>
      </div>
    </div>
  );
};

export default MissonVision;

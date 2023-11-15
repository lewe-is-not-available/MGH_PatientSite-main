import React, { useEffect, useRef } from "react";

const Consent = ({ setRead }) => {
  //*Closes modal when clicked outside
  let TermsRef = useRef();
  useEffect(() => {
    let handler = (e) => {
      if (!TermsRef.current.contains(e.target)) {
        setRead(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [setRead]);
  return (
    <div className="flex justify-center backdrop-blur-sm bg-slate-700 fixed z-50 inset-0 bg-opacity-30">
      <div ref={TermsRef} className="absolute abs rounded-md bg-white mt-40">
        <div className="overflow-y-scroll h-72">
          "I, [Your Name], hereby confirm that I am booking this appointment on
          behalf of [Patient's Full Name] and have obtained their express
          consent to do so. I understand and agree to the following: I have the
          full authority and permission from the patient to schedule, manage,
          and receive information about their medical appointment. I am
          responsible for providing accurate information regarding the patient's
          personal details, medical history (if applicable), and contact
          information. I understand that all information provided will be used
          for the sole purpose of scheduling and managing the appointment, as
          well as for communication related to this appointment. Any changes to
          this appointment, including rescheduling or cancellation, will be
          communicated to the patient and require their approval. I acknowledge
          that the patient's medical information, including any records related
          to this appointment, will be handled in accordance with applicable
          healthcare data privacy regulations. I am aware that I may be
          contacted using the contact information I provide for
          appointment-related notifications, confirmations, reminders, or
          changes. By checking this box and completing the appointment booking
          process, I confirm my understanding and agreement to the terms
          outlined above and the receipt of proper consent from the patient,
          [Patient's Full Name]."
        </div>
      </div>
    </div>
  );
};

export default Consent;

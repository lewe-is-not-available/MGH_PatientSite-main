<div className="w-full bg-[#A5DD9D]">
  <div className="flex pl-3">
    {doctor ? (
      ""
    ) : (
      <>
        <Link
          to="/"
          className="px-4 py-1 font-bold peer/ic relative nav mt-1 hover:mt-1"
        >
          <AiFillHome className="peer-hover/ic:shadow-md shadow-sm" />
        </Link>
      </>
    )}

    {admin || doctor ? (
      ""
    ) : (
      <>
        <li className="px-4 py-1 font-bold relative nav list-none peer/os hover:cursor-default flex">
          Online Services
        </li>
        <AiFillCaretDown className="mt-2 -ml-4 mr-2 transition duration-500 ease-in-out peer-hover/os:rotate-180 peer-hover/os:text-white" />
        <li className="px-4 py-1 font-bold relative nav list-none peer/about hover:cursor-default">
          About Us
        </li>
        <AiFillCaretDown className="mt-2 -ml-4 mr-2 transition duration-500 ease-in-out peer-hover/about:rotate-180 peer-hover/about:text-white" />
        <Link to="/Contacts" className="px-4 py-1 font-bold relative nav">
          Contact Us
        </Link>
      </>
    )}
    {admin && (
      <>
        <Link
          to="/Confirm_Appointments"
          className="px-4 py-1 font-bold relative nav"
        >
          Appointments
        </Link>
        <Link to="/Edit_doctors" className="px-4 py-1 font-bold relative nav">
          Edit Doctors
        </Link>
        <Link to="/User_feedbacks" className="px-4 py-1 font-bold relative nav">
          Feedbacks
        </Link>
      </>
    )}
    {doctor ? (
      <Link to="/Doctor" className="px-4 py-1 font-bold relative nav">
        Doctor
      </Link>
    ) : (
      ""
    )}
    {/* Online Services Dropdown */}
    <div
      className="absolute opacity-0 max-h-0 hidden transition-all duration-300 ease-in-out peer-hover/os:opacity-100
   peer-hover/os:max-h-40 hover:max-h-40 hover:flex peer-hover/os:flex peer-hover/os:hover:visible hover:opacity-100 flex-col py-3 mt-8 ml-[60px] bg-[#A5DD9D] 
   shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] rounded-b-lg"
    >
      <Link
        to="/Appointment"
        className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer mb-2 px-2 w-full"
      >
        Appointment
      </Link>
      <Link
        to="/Feedback-Form"
        className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer px-2 w-full"
      >
        Patient's Feedback Form
      </Link>
    </div>

    {/* About Us Dropdown */}
    <div
      className="absolute opacity-0 max-h-0 hidden transition-all duration-300 ease-in-out peer-hover/about:opacity-100 
    peer-hover/about:visible hover:flex peer-hover/about:flex peer-hover/about:max-h-40 hover:opacity-100 hover:max-h-40 flex-col py-3 mt-8 ml-[215px]
  bg-[#A5DD9D] shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5)] rounded-b-lg"
    >
      <Link
        to="/Mission-and-Vision"
        className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer mb-2 px-2 pr-7 w-full"
      >
        Mission & Vision
      </Link>
      <Link
        to="/Hospital-Profile"
        className="transition duration-300 ease-in-out hover:bg-[#4B974A] hover:cursor-pointer px-2 w-full"
      >
        Hospital Profile
      </Link>
    </div>
    {patient && (
      <Link
        to="/OnlineConsultationHistory"
        className="px-4 py-1 font-bold relative nav"
      >
        Online Consultation history
      </Link>
    )}
    {doctor && (
      <Link
        to="/DoctorConsultHistory"
        className="px-4 py-1 font-bold relative nav"
      >
        Doctor's Consultation history
      </Link>
    )}
  </div>
</div>;

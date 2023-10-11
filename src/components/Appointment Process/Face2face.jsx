import React from "react";
import doc from "../images/doc.jpg";
import { Input, initTE } from "tw-elements";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import { AiOutlineCalendar, AiFillCalendar } from "react-icons/ai";

var yesterday = moment().subtract(1, "day");
var valid = function (current) {
  return current.isAfter(yesterday);
};

initTE({ Input });


const Face2face = () => {
  
  return (
    <div className="back p-8 flex justify-between">
      <div className="text-center justify-center w-[16%] ml-52">
        <img src={doc} className="px-5 py-3" alt="" />
        <p className="font-semibold">Dr. asdfasdfad</p>
        <p>special</p>
        <p>sub special</p>
      </div>
      <div className="bg-white text-center mt-3 w-[58%] mr-52 text-[#315E30]">
        <h1 className="text-5xl font-semibold">
          Fill up the form to proceed reservation{" "}
        </h1>
        <span className="text-4xl">(face-to-face)</span>
        <form>
          <div className="grid font-semibold text-left grid-cols-3 gap-5 px-8 mt-5">
            <p>
              First Name: <br />
              <input className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
            <p>
              Last Name: <br />
              <input className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
            <p>
              Middle Name: <br />
              <input className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
            <p>
              Mobile Number: <br />
              <input
                type="number"
                className="outline-none rounded-md font-thin border-2 px-2 grid- border-slate-300 focus:border-[#71b967d3] w-full"
              />
            </p>
            <p>
              Last Name: <br />
              <input className="outline-none rounded-md font-thin border-2 px-2 border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
            <div>
              <p>Are you an existing patient?</p>
              <div className="flex space-x-5">
                <div className="font-thin mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid
                     border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full 
                     before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1]
                      after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] 
                      checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] 
                      checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] 
                      checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
                      focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)]
                      focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 
                      checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                   "
                    type="radio"
                    name="flexRadioDefault"
                    id="radioDefault01"
                  />
                  <label
                    className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor="radioDefault01"
                  >
                    Yes
                  </label>
                </div>
                <div className="font-thin mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none
                    rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none
                    before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent
                     before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] 
                     after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary
                     checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 
                     checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary
                     checked:after:bg-primary  checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] 
                     hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
                     focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] 
                     focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s]
                     checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]
                     checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s]"
                    type="radio"
                    name="flexRadioDefault"
                    id="radioDefault02"
                  />
                  <label
                    className="mt-px inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor="radioDefault02"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
            <p className="col-span-2">
              Your Address: <br />
              <textarea className="outline-none border-2 font-thin px-2 h-10 rounded-md border-slate-300 focus:border-[#71b967d3] w-full" />
            </p>
            <div>
              <p className="whitespace-normal ">
                Select Date and time of appointment:
              </p>
              <input
                className="outline-none border-2 font-thin px-2 h-9 rounded-lg border-slate-300 focus:border-[#71b967d3]"
                type="datetime-local"
                id="meeting-time"
                name="meeting-time"
              />
            </div>
            <div class="flex items-center mb-4">
    <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
    <label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default checkbox</label>
</div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Face2face;

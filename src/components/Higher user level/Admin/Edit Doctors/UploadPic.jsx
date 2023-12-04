import React from "react";

const UploadPic = ({
    isSelected,
    image,
    handleCancel,
    handleDragOver,
    handleDrop,
    handleFile,
    File
}) => {
  return (
    <div className="flex flex-col items-center">
      {isSelected ? (
        <div className="flex flex-col items-center w-full -mb-16">
          <img
            className="object-contain mb-4 rounded-md items-center justify-center w-full h-[20rem]"
            src={image}
            alt="/"
          />
          <ul className="flex">
            <p className="font-semibold mr-2">File name: </p>
            {Array.from(File).map((file, idx) => (
              <li className="truncate max-w-[14rem]" key={idx}>
                {file.name}
              </li>
            ))}
          </ul>

          <div className="flex space-x-4 mb-4">
            <button
              className="text-gray-900 bg-white border border-gray-300 focus:outline-none
                                 transition duration-75 ease-in hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 
                                font-medium rounded-lg px-5 dark:bg-gray-800 dark:text-white dark:border-gray-600
                                dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              onClick={handleCancel}
            >
              Choose another file
            </button>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center">
          {/* Drop-Zone */}
          <label
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            accept="image/png, image/jpeg"
            className="flex flex-col mb-5 rounded-md items-center justify-center w-[20rem] h-[20rem] border-2
           border-gray-300 border-dashed cursor-pointer bg-gray-50 transition duration-100 ease-in dark:hover:bg-bray-800
          dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500
          dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG or JPG
              </p>
            </div>

            {/* Image input */}
            <input
              id="dropzone-file"
              onChange={handleFile}
              accept="image/png, image/jpeg"
              type="file"
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadPic;

import React, { useState, useEffect } from "react";
import SearchResult from "./SearchResult";
import ReactPaginate from "react-paginate";
import { Oval } from "react-loader-spinner";

const SearchPaginated = ({
  Doctors,
  Loaded,
  setLoaded,
  imgName,
  isImgEmpty,
}) => {
  //*Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const itemsPerPage = 4;
  const [currentItems, setcurrentItems] = useState(null);
  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setcurrentItems(Doctors.slice(itemOffset, endOffset));
    setpageCount(Math.ceil(Doctors.length / itemsPerPage));
    if (currentItems) {
      setTimeout(() => {
        setLoaded(true);
      }, 500);
    }
  }, [itemOffset, itemsPerPage, Doctors, setLoaded]);
  const handlePageClick = (event) => {
    setLoaded(false);
    const newOffset = (event.selected * itemsPerPage) % Doctors.length;
    setItemOffset(newOffset);
  };
  return (
    <div className="w-full flex flex-col items-center rounded">
      {Loaded ? (
        <div className="flex space-x-5">
          {currentItems &&
            currentItems.map((ol) => (
              <>
                <SearchResult
                  imgName={imgName}
                  isImgEmpty={isImgEmpty}
                  key={ol.id}
                  Doctors={ol}
                />
              </>
            ))}
        </div>
      ) : (
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
      )}
      <ReactPaginate
        breakLabel=". . ."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        className="flex space-x-3 mt-6 w-full justify-center items-center select-none"
        breakClassName="text-xl font-semibold"
        pageLinkClassName="text-slate-600 text-lg transition duration-100 bg-[#cbcbcba8] hover:bg-[#bfbfbffc] hover:text-slate-700 px-[10px] py-[8px] rounded"
        previousLinkClassName="text-white text-xl transition duration-100 bg-[#4fa94d] hover:bg-[#3d833ce7] px-3 py-[7px] rounded"
        nextLinkClassName="text-white text-xl transition duration-100 bg-[#4fa94d] hover:bg-[#3d833ce7] px-3 py-[7px] rounded"
        activeLinkClassName="border-2 border-green-700 text-xl rounded"
      />
    </div>
  );
};

export default SearchPaginated;

import React, { useState, useEffect } from "react";
import Online from "./AppointMap";
import ReactPaginate from "react-paginate";
import { Oval } from "react-loader-spinner";

const AppconfirmPaginated = ({
  books,
  CDNURL,
  user,
  Loaded,
  setLoaded,
  setCancel,
  setBookID
}) => {
  //*Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const [pageCount, setpageCount] = useState(0);
  const itemsPerPage = 7;
  const [currentItems, setcurrentItems] = useState(null);
  useEffect(() => {
    if (user) {
      const endOffset = itemOffset + itemsPerPage;
      setcurrentItems(books.slice(itemOffset, endOffset));
      setpageCount(Math.ceil(books.length / itemsPerPage));
      if (currentItems) {
        setTimeout(() => {
          setLoaded(true);
        }, 500);
      }
    }
  }, [itemOffset, itemsPerPage, books, setLoaded, user]);

  const handlePageClick = (event) => {
    setLoaded(false);
    const newOffset = (event.selected * itemsPerPage) % books.length;
    setItemOffset(newOffset);
  };
  return (
    <div className="w-full flex flex-col items-center rounded">
      <ReactPaginate
        breakLabel=". . ."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        className="flex space-x-3 mb-6 w-full justify-center items-center select-none"
        breakClassName="text-xl font-semibold"
        pageLinkClassName="text-slate-600 text-lg transition duration-100 bg-[#cbcbcba8] hover:bg-[#bfbfbffc] hover:text-slate-700 px-[10px] py-[8px] rounded"
        previousLinkClassName="text-white text-xl transition duration-100 bg-[#4fa94d] hover:bg-[#3d833ce7] px-3 py-[7px] rounded"
        nextLinkClassName="text-white text-xl transition duration-100 bg-[#4fa94d] hover:bg-[#3d833ce7] px-3 py-[7px] rounded"
        activeLinkClassName="border-2 border-green-700 text-xl rounded"
      />
      {Loaded ? (
        currentItems &&
        currentItems.map((ol) => (
          <div key={ol.book_id} className="w-full">
            <Online
              ol={ol}
              setBookID={setBookID}
              setCancel={setCancel}
              user={user}
              CDNURL={CDNURL}
            />
          </div>
        ))
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
    </div>
  );
};

export default AppconfirmPaginated;

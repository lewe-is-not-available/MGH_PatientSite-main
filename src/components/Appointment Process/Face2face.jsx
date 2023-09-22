import React from 'react'
import doc from "../images/doc.jpg";

const Face2face = () => {
  return (
    <div className='back p-8 flex justify-between'>
        <div className='text-center justify-center w-[16%] ml-52'>
            <img src={doc} className='px-5 py-3' alt=''/>
            <p className='font-semibold'>Dr. asdfasdfad</p>
            <p>special</p>
            <p>sub special</p>
        </div>
        <div className='bg-white text-center mt-3 w-[58%] mr-52 text-[#315E30]'>
            <h1 className='text-5xl font-semibold'>Fill up the form to proceed reservation </h1>
            <span className='text-4xl'>(face-to-face)</span>
            <p>form here</p>
        </div>
    </div>
  )
}

export default Face2face
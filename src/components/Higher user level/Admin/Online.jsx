import React from "react";

const Online = ({ ol }) => {
  //console.log(ol.online_id);
  return (
    <tr
      key={ol.online_id}
      className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {ol.fname} {ol.lname}
      </th>
      <td className="px-6 py-4">{ol.docname}</td>
      <td className="px-6 py-4">{ol.email}</td>
      <td className="px-6 py-4">{ol.date}</td>
      <td className="px-6 py-4">{ol.time}</td>
      <td className="px-6 py-4">{ol.reason}</td>
      <td className="px-6 py-4">{ol.existing}</td>
      <td className="px-6 py-4 text-white">
        <button className="px-3 rounded-md bg-green-500 mr-2">accept</button>
        <button className="px-3 rounded-md bg-red-500">reject</button>
      </td>
    </tr>
  );
};

export default Online;

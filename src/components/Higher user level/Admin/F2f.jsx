import React from "react";

const F2f = ({ f2 }) => {
  return (
    <tr
      key={f2.id}
      className="text-base bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    >
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {f2.fname} {f2.lname}
      </th>
      <td className="px-6 py-4">{f2.docname}</td>
      <td className="px-6 py-4">{f2.email}</td>
      <td className="px-6 py-4">{f2.date}</td>
      <td className="px-6 py-4">{f2.time}</td>
      <td className="px-6 py-4">{f2.reason}</td>
      <td className="px-6 py-4">{f2.existing}</td>
      <td className="px-6 py-4 text-white">
        <button className="px-3 rounded-md bg-green-500 mr-2">accept</button>
        <button className="px-3 rounded-md bg-red-500">reject</button>
      </td>
    </tr>
  );
};

export default F2f;

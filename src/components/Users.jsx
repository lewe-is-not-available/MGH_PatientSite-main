import { useState, useEffect } from "react";
import Axios from "./API/Axios";

const Users = () => {
  const [users, setUsers] = useState();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await Axios.get("/users", {
          signal: controller.signal,
        });
        console.log(response.data);
        isMounted && isMounted(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>User List</h2>
      {users?.length ? (
        <ul>
          {users.map((use, i) => (
            <li key={i}>{users?.username}</li>
          ))}
        </ul>
      ) : (
        <p>No users to display</p>
      )}
    </article>
  );
};

export default Users;

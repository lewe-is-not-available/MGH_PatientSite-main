import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "../../config/Supabase";
import supabaseAdmin from "../../config/supabaseAdmin";
import PatientMap from "./UserMap";

const EditDoctors = () => {
  const [books, setBook] = useState([]);
  const fetchBooks = async () => {
    const { data, error } = await supabaseAdmin.from("profile").select("*");
    if (error) {
      toast.error(error, {
        toastId: "dataError",
      });
      console.error("Failed to fetch", error.message);
    } else {
      console.log(data);
      setBook(data);
    }
  };
  useEffect(() => {
    fetchBooks();
    supabaseAdmin
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile" },
        () => {
          fetchBooks();
        }
      )
      .subscribe();
  }, []);

  const fetchDocAcc = async () => {
    await supabaseAdmin.auth.admin.createUser({
      email: "user@email.com",
      password: "password",
      email_confirm: true,
      options: {
        data: {
          role: "doctor",
        },
      },
    });
  };
  const [User, setUsers] = useState();
  const fetchUsers = async () => {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.log(error);
    }
    if (data) {
      //console.log(data)
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const [PatientId, setPatientId] = useState();
  // const fetchDocRole = async () => {
  //   const { error } = await supabase
  //     .from("profile")
  //     .update({ role: "doctor" })
  //     .eq("email", "user@email.com");
  //     if(error){
  //       console.log(error)
  //     }
  // };

  // useEffect(() => {
  //   fetchBooks();
  //   supabase
  //     .channel("custom-all-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "profile" },
  //       () => {
  //         fetchDocRole();
  //       }
  //     )
  //     .subscribe();
  // }, []);

  return (
    <div className="back h-screen w-full flex place-content-center">
      <div className="abs absolute mt-10 rounded-lg bg-white p-10">
        {books &&
          books
            .filter((item) => item.role && item.role.includes("patient"))
            .map((data) => (
              <PatientMap data={data} setPatientId={setPatientId} PatientId={PatientId}/>
            ))}
        <button onClick={fetchDocAcc}>submit</button>
      </div>
    </div>
  );
};

export default EditDoctors;

import React, { useEffect } from "react";
import supabase from "../config/Supabase";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
    const fetchAdmin = async () => {
      const { data } = await supabase
        .from("profile")
        .select("*")
        .single();

      if(data.role !== "admin"){
        navigate('/');
      }
    };
    fetchAdmin();

  return (
    <div>
      Admin
    </div>
  );
};

export default Admin;

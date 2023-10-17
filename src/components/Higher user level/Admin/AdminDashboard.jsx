import React from "react";
import supabase from "../../config/Supabase";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
    
  const fetchAdmin = async () => {
      const { data } = await supabase
        .from("profile")
        .select("*")
        .single();

      //*prevent access from non-admin users
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

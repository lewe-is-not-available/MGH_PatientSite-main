import { useEffect, useState } from "react";
import supabase from "../components/config/Supabase";
import { toast } from "react-toastify";

const useHandleSubmitContactInformation = (user) => {
  //*useStates
  const [Name, setName] = useState();
  const [number, setNumber] = useState("");
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mname: "",
    email: "",
    type: "",
    message: "",
  });

  //*autofill value
  useEffect(() => {
    if (user) {
      setNumber(user.phone);
      setFormData((prev) => ({
        ...prev,
        fname: user.first_name,
        mname: user.middle_name,
        lname: user.last_name,
        email: user.email,
      }));
    }
  }, [user]);

  //*Combining first last and middle name
  useEffect(() => {
    setName(
      formData.fname +
        (formData.mname ? " " + formData.mname : "") +
        " " +
        formData.lname
    );
  }, [formData]);

  //*onchange function
  function handleChange(e) {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  //*useStates
  const [submit, setSubmit] = useState(false);
  const [load, setIsLoading] = useState(false);

  //*Insert to message table
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setIsLoading(true);
      await supabase.from("messages").insert({
        name: Name,
        fname: formData.fname,
        mname: formData.mname,
        lname: formData.lname,
        email: formData.email,
        phone: number,
        type: formData.type,
        message: formData.message,
      });
      setIsLoading(false);
      setSubmit(true);
    } catch (err) {
      setIsLoading(false);
      toast.error(err.message);
    }
  }

  return {
    load,
    submit,
    Name,
    number,
    formData,
    handleChange,
    setSubmit,
    handleSubmit,
  };
};

export default useHandleSubmitContactInformation;

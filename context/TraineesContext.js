import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const Context = createContext();

const TraineesContext = ({ children }) => {
  const [trainees, setTrainees] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCustodyDetails = async (custodyID) => {
    setLoading(true);
    try {
      const url = `user/CustodyDetails/${custodyID}`;
      const res = await axios.get(url);
      setTrainees(res?.data?.custodyDetails?.[0]?.users);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went wrong");
      setLoading(false);
    }
  };
  return (
    <Context.Provider
      value={{ fetchCustodyDetails, trainees, loading, setTrainees }}
    >
      {children}
    </Context.Provider>
  );
};

export default TraineesContext;

export const useTrainees = () => useContext(Context);

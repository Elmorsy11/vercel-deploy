import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

const DashboardInfoContext = ({ children }) => {
  const [local, setLocal] = useState(
    localStorage.getItem("dashboardInfo") ? true : false
  );
  const [dashboardInfoLocal, setDashboardInfoLocal] = useState();

  useEffect(() => {
    if (local) {
      setDashboardInfoLocal(
        localStorage.getItem("dashboardInfo")
          ? JSON.parse(localStorage.getItem("dashboardInfo"))
          : null
      );
    }
  }, [local]);

  return (
    <Context.Provider value={{ local, setLocal, dashboardInfoLocal }}>
      {children}
    </Context.Provider>
  );
};

export default DashboardInfoContext;

export const useDashboardContext = () => useContext(Context);

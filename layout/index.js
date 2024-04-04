import React, { useEffect } from "react";
//sidebar
import Sidebar from "./sidebar";
import { useDispatch, useSelector } from "react-redux";
import { encryptName } from "helpers/encryptions";
import { setConfig } from "lib/slices/config";

const Layout = ({ children, setSelectedLabel, selectedLabel, setBreadcrumbs }) => {
  const config = useSelector((state) => state.config);
  const dispatch = useDispatch();
  useEffect(() => {
    const getConfig = sessionStorage.getItem(encryptName("config"));
    if (getConfig) {
      dispatch(setConfig(JSON.parse(getConfig)));
    }
  }, [config, dispatch]);
  return (
    <>
      {/* <Header /> */}
      <Sidebar setSelectedLabel={setSelectedLabel} selectedLabel={selectedLabel} setBreadcrumbs={setBreadcrumbs} />
      <main className="main-content mt-5">
        <div className={"position-relative  mt-n5 py-0 "}>{children}</div>
      </main>
    </>
  );
};

export default Layout;

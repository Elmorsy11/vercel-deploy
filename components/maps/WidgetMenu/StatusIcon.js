import React, { useEffect, useState } from "react";
import configUrls from "config/config";
import { getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import StreamHelper from "helpers/streamHelper";
import Image from "next/image";
import { useSelector } from "react-redux";
import { iconUrl } from "helpers/helpers";

const StatusIcon = ({ item, vehicleIcon }) => {
  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };
  const [statusIcons, setStatusIcon] = useState(item.VehicleStatus ?? {});
  const { CalcVstatus } = StreamHelper();
  const darkMode = useSelector((state) => state.config.darkMode);
  const App = initializeApp(firebaseConfig, "updatefb");
  const db = getDatabase(App);
  useEffect(() => {
    const fetchVehicleData = async () => {
      const fetchDataAndUpdateState = () => {
        onValue(ref(db, `${item?.SerialNumber}`), (snapshot) => {
          if (snapshot.exists()) {
            const newData = snapshot.val();
            newData
              ? setStatusIcon(CalcVstatus({ ...item, ...newData }))
              : setStatusIcon(CalcVstatus(item));
          } else {
            setStatusIcon(CalcVstatus(item));
          }
        });
      };
      fetchDataAndUpdateState();
    };
    fetchVehicleData();
  }, [item]);

  return (
    <>
      <div
        className={`position-relative  ${
          darkMode ? "bg-primary p-1" : "bg-transparent p-0"
        } d-flex justify-content-center rounded-1`}
        style={{ padding: "3px" }}
      >
        <Image
          src={iconUrl(item?.configJson, vehicleIcon, statusIcons)}
          width={11}
          height={20}
          alt={item?.SerialNumber}
          title={item?.SerialNumber}
        />
      </div>
    </>
  );
};

export default StatusIcon;

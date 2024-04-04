import React, { useEffect, useState } from "react";
import ViolationsPopup from "./ViolationsPopup";
import dynamic from "next/dynamic";
import { off, onValue, ref } from "firebase/database";
import { db } from "firebaseTrannie";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "lib/slices/notificationSlice";
import { useRouter } from "next/router";
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
);
let icon;
let L;
if (typeof window !== "undefined") {
  L = require("leaflet");
}
const MarkerComponent = ({ icon, user, dashboardUsers }) => {
  const [trainee, setTrainee] = useState(!dashboardUsers ? user : null);
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const fetchTrainee = async () => {
      const fetchDataAndUpdateState = () => {
        onValue(ref(db, `${user?.user?.SerialNumber}`), (snapshot) => {
          const newData = snapshot.val();
          const data = {
            Mileage: newData.Mileage,
            IsPowerCutOff: newData.IsPowerCutOff,
            Address: newData.Address,
            Longitude: newData.Longitude,
            Latitude: newData.Latitude,
            IsOverSpeed: newData.IsOverSpeed,
            SerialNumber: newData.SerialNumber,
            SeatBelt: newData.SeatBelt || newData.SeatBeltStatus,
            Speed: newData.Speed
          }
          if (
            (dashboardUsers || router.pathname === "/map") && ((newData.IsOverSpeed && newData.Speed >= 145)
              //  || (newData.SeatBelt && newData.Speed >= 15)
            )) {
            dispatch(setNotifications({
              user: {
                username: user.user.username,
                _id: user.user._id
              },
              newData: data
            }))
            setTrainee({
              user: user.user,
              data
            });
          } else if (
            dashboardUsers &&
            !(newData.IsOverSpeed && newData.Speed >= 145
              // || (newData.SeatBelt && newData.Speed >= 15)
            )
          ) {
            setTrainee(null);
          } else if (!dashboardUsers) {
            setTrainee({
              user: user.user,
              data,
            });
          }
        });
      };
      fetchDataAndUpdateState();
      return () => {
        off(`${user?.SerialNumber}`);
      };
    };
    fetchTrainee();
  }, [db, user?.user?.SerialNumber, dashboardUsers, user?.user]);

  icon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style='background-color:${(trainee?.data?.IsOverSpeed && trainee?.data?.Speed >= 145)
      //  || (trainee?.data?.SeatBelt && trainee?.data?.Speed >= 15)
      ? "#CA0000"
      : "#5E86ED"
      };' class='marker-pin'>
          <i class='material-icons' style="background-image: url('${trainee?.user?.image?.url
      }');">
          <img style='width:100%' src='${user.user.image?.url}' /></i></div>`,
    iconSize: [50, 50],
    iconAnchor: [15, 42],
  });
  return (
    <>
      {trainee && (
        <Marker
          position={[trainee?.data?.Latitude, trainee?.data?.Longitude]}
          icon={icon}
        >
          <ViolationsPopup user={trainee} mainDashboard={dashboardUsers} />
        </Marker>
      )}
    </>
  );
};

export default MarkerComponent;

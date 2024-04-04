import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { db } from "firebaseTrannie";
import { useSession } from "next-auth/client";
import React from "react";
import MarkerComponent from "components/map/MarkerComponent";
import { useDispatch, useSelector } from "react-redux";
import { allTrainees } from "lib/slices/custodies";
import { useRouter } from "next/router";

let icon;
let L;
if (typeof window !== "undefined") {
  L = require("leaflet");
}
const Markers = ({ userId, dashboardUsers, mainPage }) => {
  const [trainees, setTrainees] = useState([]);
  const [session] = useSession();
  const [users, setUsers] = useState([]);
  const traineeData = useSelector(
    (state) => state.custodies?.allTrainees?.data?.users
  );
  const tranieeInfo = useSelector(
    (state) => state.custodies.custodyTranieeStatistcs?.data?.users[0]
  );
  const dispatch = useDispatch()
  const isSafetyAdvisor = session?.user?.data?.role === 'safety-advisor'
  const safetyAdvisorCustodyId = session?.user?.data?.custodyId
  const router = useRouter()
  useEffect(() => {
    if (userId) {
      setUsers([tranieeInfo])
    } else {
      if (traineeData?.length) {
        setUsers(
          traineeData?.filter(
            (user) => user?.SerialNumber !== null
          )
        );
      } else {
        if (router.pathname == '/map') dispatch(allTrainees({ itc: isSafetyAdvisor ? safetyAdvisorCustodyId : null }))
      }


    }

    // if (true) {
    //   if (session?.user?.data?.role !== "safety-advisor") {
    //     axios
    //       .get(`user/getAllTrainers`, {
    //         headers: {
    //           Authorization: `Bearer ${session?.user.token}`,
    //         },
    //       })
    //       .then((res) => {
    //         response = res.data;
    //         if (userId) {
    //           setUsers(response.users.filter((user) => user?._id == userId));
    //         } else {
    //           setUsers(
    //             response.users.filter((user) => user?.SerialNumber !== null)
    //           );
    //         }
    //       });
    //   } else {
    // axios
    //   .get(`user/CustodyDetails/${session.user?.data?.custodyId}`)
    //   .then((res) => {
    //     if (userId) {
    //       setUsers(
    //         res?.data?.custodyDetails[0].users.filter(
    //           (user) => user?._id == userId
    //         )
    //       );
    //     } else {
    //       setUsers(
    //         res?.data?.custodyDetails[0].users.filter(
    //           (user) => user?.SerialNumber !== null
    //         )
    //       );
    //     }
    //   });
    //   }
    // }
  }, [dashboardUsers, tranieeInfo, traineeData]);
  useEffect(() => {
    const fetchTrainees = async () => {
      let tempArray = [];
      let i = 0;
      users?.forEach((user) => {
        const fetchDataAndUpdateState = () => {
          onValue(ref(db, `${user?.SerialNumber}`), async (snapshot) => {
            if (snapshot.exists()) {
              const newData = await snapshot.val();
              if (newData) {
                const temptrainee = {
                  user: user,
                  data: {
                    Mileage: newData.Mileage,
                    IsPowerCutOff: newData.IsPowerCutOff,
                    Address: newData.Address,
                    Speed: newData.Speed,
                    Longitude: newData.Longitude,
                    Latitude: newData.Latitude,
                  },
                };
                tempArray.push(temptrainee);
              }
            } else {
              i = i + 1;
            }
            if (tempArray.length + i == users.length) {
              setTrainees(tempArray);
            }
            off(ref(db, `${user?.SerialNumber}`));
          });
        };
        fetchDataAndUpdateState();
      });
    };
    fetchTrainees();
  }, [users]);
  let temp = trainees?.map((user, i) => {
    // icon = L.divIcon({
    //   className: "custom-div-icon",
    //   html: `<div style='background-color:${
    //     dashboardUsers ? "#CA0000" : "#5E86ED"
    //   };' class='marker-pin'>
    //       <i class='material-icons' style="background-image: url('${
    //         user.user.image?.url
    //       }');">
    //       <img style='width:100%' src='${user.user.image?.url}' /></i></div>`,
    //   iconSize: [50, 50],
    //   iconAnchor: [15, 42],
    // });

    return (
      user?.data?.Latitude &&
      user?.data?.Longitude && (
        <MarkerComponent
          key={i}
          // icon={icon}
          user={user}
          dashboardUsers={dashboardUsers?.length > 0 ? true : false}
        />
      )
    );
  });
  return <>{temp}</>;
};

export default Markers;

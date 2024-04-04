import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import moment from "moment";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import configUrls from "config/config";
import StreamHelper from "helpers/streamHelper";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "lib/slices/notifications";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { addNotConnectedSerials } from "lib/slices/StreamData";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const vehiclesRef = useRef({});
  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };
  let fbSubscribers = [];
  const overSpeedCode = 101;
  const { CalcVstatus } = StreamHelper();
  const { VehFullData } = useSelector((state) => state.streamData);
  const App = initializeApp(firebaseConfig, "updatefb");
  const db = getDatabase(App);
  const dispatch = useDispatch();
  //  this part control rerender and rerender time to handle update numbers for each part
  const [repeater, setRepeater] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRepeater((prev) => !prev);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  //  check for each vehicle if it need to notify user will update redux state
  const sendNotification = (locInfo) => {
    if (
      !moment(moment.parseZone(locInfo?.RecordDateTime))
        .local()
        .isBefore(moment().subtract(5, "minutes"))
    ) {
      if (locInfo.VehicleStatus === overSpeedCode) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} Is over speed`,
            serial: locInfo.SerialNumber,
            type: "over speed",
          })
        );
      } else if (locInfo.IsPowerCutOff) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} power is off`,
            serial: locInfo.SerialNumber,
            type: "power",
          })
        );
      } else if (locInfo.IsFuelCutOff) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} fuel is off`,
            serial: locInfo.SerialNumber,
            type: "fuel",
          })
        );
      } else if (locInfo.IsCrash) {
        dispatch(
          addNotification({
            message: `${locInfo.DisplayName} is Crashed`,
            serial: locInfo.SerialNumber,
            type: "crash",
          })
        );
      }
    }
  };
  // this piece of code use to sync Vehicles data with firebase
  // update status numbers all over the app
  // and send notification for use cases
  const syncVehicles = () => {
    vehiclesRef.current = Object.fromEntries(
      VehFullData.map((x) => [x?.SerialNumber, { Speed: 0, ...x }])
    );
    const notConnectedVehicles = {};
    VehFullData?.forEach((vehicle, i) => {
      const subid = fbSubscribers.push({ cancel: false }) - 1;
      onValue(
        ref(db, vehicle.SerialNumber),
        (snapshot) => {
          if (i == VehFullData.length - 1) {
            dispatch(
              addNotConnectedSerials(
                Array.from(Object.keys(notConnectedVehicles))
              )
            );
          }
          if (!snapshot.hasChildren()) {
            notConnectedVehicles[vehicle.SerialNumber] = vehicle;
            return;
          }
          if (fbSubscribers[subid]?.cancel) {
            return;
          }
          //  all the parts need only vehicle status aggregations
          const newData = snapshot.val();
          if (!newData) return;
          const locInfo = {
            ...vehicle,
            ...newData,
            VehicleStatus: CalcVstatus({ ...vehicle, ...newData }),
          };
          // we use useRef hook to update state without rerender to control rerender time
          // we also use mapping logic to update vehicle state quickly
          vehiclesRef.current[vehicle.SerialNumber] = locInfo;
          sendNotification(locInfo);
          snapshot.exists();
        },
        (error) => {
          toast.error(`Error: ${JSON.stringify(error)}`);
        }
      );
    });
  };
  useEffect(() => {
    syncVehicles();
    // this clean up function will activate if we fine another way to handle notifications
    // return () => {
    //   fbSubscribers.forEach((subscriber) => {
    //     subscriber.cancel = true;
    //   });
    // };
  }, [VehFullData]);

  const vehiclesMemoized = useMemo(() => {
    return [...Object.values(vehiclesRef.current)];
  }, [repeater, vehiclesRef.current]);

  const value = {
    vehicles: vehiclesMemoized,
  };

  return (
    <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>
  );
};

export const useVehicleContext = () => {
  return useContext(VehicleContext);
};

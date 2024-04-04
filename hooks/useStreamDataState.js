import axios from "axios";
import { useDispatch } from "react-redux";
import { locConfigModel } from "helpers/helpers";
import { addFullVehData } from "lib/slices/StreamData";
import { encryptName } from "helpers/encryptions";
import { useSession } from "next-auth/client";
import moment from "moment";
import { useState } from "react";

function useStreamDataState(VehFullData) {
  const [loading, setLoading] = useState(false);
  // useDispatch to update the global state
  const dispatch = useDispatch();
  const [session] = useSession();
  const userData = JSON.parse(
    localStorage.getItem(encryptName("userData")) ?? "{}"
  );

  let updatedDataObj = VehFullData
    ? Object.fromEntries(VehFullData.map((x) => [x.SerialNumber, x]))
    : {};

  const apiGetVehicles = async (localExpireMin = 30, syncBtn = false) => {
    let vehStorage = {};
    let updated = false;

    vehStorage = userData["userId"] == session?.user.id ? userData : {};
    if (!localStorage.getItem(encryptName("updatedStorage"))) {
      localStorage.clear();
      vehStorage = {};
    }

    if (syncBtn) {
      localStorage.removeItem(encryptName("userData"));
      vehStorage = {};
    }

    const isStorageExpired =
      (new Date(vehStorage?.updateTime) ?? new Date(0)) <
      new Date(new Date().setMinutes(new Date().getMinutes() - localExpireMin));
    if (!vehStorage?.vehData?.length || isStorageExpired) {
      let apiData = [];
      apiData = await apiLoadVehSettings(true, syncBtn); //load full data

      apiData = Object.fromEntries(apiData.map((x) => [x?.SerialNumber, x]));

      updatedDataObj = { ...updatedDataObj, ...apiData };

      dispatch(addFullVehData([...Object.values(updatedDataObj)]));
      updated = true;
    } else {
      updatedDataObj = Object.fromEntries(
        vehStorage?.vehData?.map((x) => [x?.SerialNumber, x])
      );
      dispatch(addFullVehData([...Object.values(updatedDataObj)]));
    }

    let udo = Object.values(updatedDataObj);

    if (updated) {
      udo =
        udo.length < 4000
          ? udo
          : udo.map((x) => {
              return {
                VehicleID: x.VehicleID,
                SerialNumber: x.SerialNumber,
                DriverID: x.DriverID,
                DisplayName: x.DisplayName,
                PlateNumber: x.PlateNumber,
                GroupName: x.GroupName,
                DriverName: x.DriverName,
                GroupID: x.GroupID,
                EngineStatus: x.EngineStatus,
                RecordDateTime: moment.utc(x.RecordDateTime),
                Latitude: x.Latitude,
                Longitude: x.Longitude,
                Speed: x.Speed ?? 0,
                SpeedLimit: x.SpeedLimit,
                lastTrips: x.lastTrips,
                GroupID: x.GroupID,
              };
            });

      localStorage.setItem(
        encryptName("userData"),
        JSON.stringify({
          userId: session?.user.id,
          updateTime: new Date(),
          vehData: udo,
        })
      );
      localStorage.setItem(encryptName("updatedStorage"), true);
    }

    return {
      updatedResult: udo,
    };
  };

  const apiLoadVehSettings = async (withLoc = true) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `vehicles/settings?withloc=${withLoc ? 1 : 0}`
      );

      let result =
        res.data?.map((x) => {
          return {
            ...x,
            WorkingHours: x?.WorkingHours || 0,
            SpeedLimit: (x?.SpeedLimit ?? 0) > 0 ? x?.SpeedLimit : 120,
            MinVolt: x?.MinVolt ?? 0,
            MaxVolt: x?.MaxVolt ?? 0,
            RecordDateTime: moment.utc(
              x.RecordDateTime || locConfigModel.RecordDateTime
            ),
            Speed: x.Speed ?? 0,
            SerialNumber: x?.SerialNumber
              ? x?.SerialNumber
              : `NoSerial_${Math.floor(Math.random() * 100000)}`,
          };
        }) || [];

      // Get an array of vehicle IDs from the result
      const vehicleSerial = result.map((vehicle) => vehicle.VehicleID);

      const getLastTrip = async (vehicleSerialArray) => {
        const data = {
          // lite: 1,
          vids: vehicleSerialArray,
        };
        try {
          const response = await axios.post(`vehicles/lastTrip`, data);
          return response.data.lastTrips;
        } catch (error) {
          return [];
        }
      };

      const setLastTrip = async () => {
        const lastTrips = await getLastTrip(vehicleSerial);
        const lastTripsMap = {};
        lastTrips.forEach((trip) => {
          lastTripsMap[trip._id] = trip.lastTrip;
        });
        return lastTripsMap;
      };

      const lastTripsMap = await setLastTrip();
      result.forEach((vehicle) => {
        vehicle.lastTrips =
          moment
            .utc(lastTripsMap[vehicle.VehicleID])
            .local()
            .format("YYYY-MM-DD HH:mm:ss") || null;
      });
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return [];
    }
  };

  const trackStreamLoader = async (syncBtn) => {
    await apiGetVehicles(30, syncBtn);
  };

  return {
    loading,
    trackStreamLoader,
  };
}

export default useStreamDataState;

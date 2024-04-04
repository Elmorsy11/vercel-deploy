import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import configUrls from "config/config";
import { locConfigModel, Date2KSA } from "helpers/helpers";
import StreamHelper from "helpers/streamHelper";
import {
  addFullVehData,
  countVehTotal,
  UpdateVehicle,
} from "lib/slices/StreamData";
import { encryptName } from "helpers/encryptions";
import { useSession } from "next-auth/client";
function useStreamDataState() {
  // useDispatch to update the global state
  const dispatch = useDispatch();
  const [session] = useSession();

  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };
  let fbSubscribers = [];
  // get global state
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  // update Global state
  const apiLoadVehSettings = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiNjQwZGI0ODk2MDlkMWNkMjA5ZjJmODQxIiwicm9sZSI6ImFkbWluIiwiY3VzdG9keUlkIjpudWxsLCJpYXQiOjE2ODEyMDcyNDZ9.QFp9j-cCuOs-fSi7EyMmDJhHtIyWq-0Br7gMqM5Y3W8";
    const response = await axios.get(
      `https://itc-api-hcr64pytia-uc.a.run.app/api/v1/user/getAllTrainers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200 && response.data?.length > 0) {
      let result = response.data.filter((v) => v.SerialNumber !== null);

      result = result.map((x) => {
        var config = Object.assign({}, locConfigModel);
        Object.assign(config, x);
        config.MinVoltage = locConfigModel.MinVolt;
        config.MaxVoltage = locConfigModel.MaxVolt;
        config.RecordDateTime = Date2KSA(config.RecordDateTime);
        return Object.assign(x, config);
      });
      return result;
    }
    return [];
  };

  const FbSubscribe = async (vehicles, myMap, onlyOnce = false) => {
    const { fbtolocInfo } = StreamHelper();
    const subid = fbSubscribers.push({ cancel: false }) - 1;
    const App = initializeApp(firebaseConfig, "updatefb");
    const db = getDatabase(App);
    var ids = vehicles?.map((i) => i?.SerialNumber);
    await ids?.forEach((id) => {
      onValue(
        ref(db, id),
        (snapshot) => {
          if (!snapshot.hasChildren()) return;
          if (fbSubscribers[subid].cancel) return;
          const { locInfo, updated } = fbtolocInfo(snapshot, vehicles);
          if (updated) {
            dispatch(UpdateVehicle(locInfo));
            dispatch(countVehTotal());
            myMap && myMap?.UpdateMarker(locInfo);
          }
          snapshot.exists();
        },
        (error) => {
          console.error("error : ", error);
        },
        { onlyOnce: onlyOnce }
      );
    });
    await ids?.forEach((id) => {
      onValue(ref(db, id), (snapshot) => {});
    });
  };

  const apiGetVehicles = async (localExpireMin = 30) => {
    let vehState = [];
    let vehStorage = {};
    let updatedResult = [];
    let updated = false;
    vehState = [...VehFullData];
    if (vehState.length == 0) {
      const UserData = JSON.parse(
        localStorage.getItem(encryptName("UserData")) ?? "{}"
      );
      vehStorage =
        UserData["userId"] != session?.user?.user?.id ? {} : UserData;
      const isStorageExpired =
        (new Date(vehStorage?.updateTime) ?? new Date(0)) <
        new Date(
          new Date().setMinutes(new Date().getMinutes() - localExpireMin)
        );
      if (
        JSON.stringify(vehStorage?.vehData ?? {}) == "{}" ||
        isStorageExpired
      ) {
        updatedResult = await apiLoadVehSettings(); //load full data
        updated = updatedResult.length > 0;
      } else {
        updatedResult = vehStorage.vehData;
      }
      dispatch(addFullVehData([...updatedResult]));
    } else {
      updatedResult = vehState;
    }

    if (updated)
      localStorage.setItem(
        encryptName("UserData"),
        JSON.stringify({
          userId: session?.user?.user?.id,
          updateTime: new Date(),
          vehData: updatedResult,
        })
      );

    return { updated, updatedResult, vehStorage };
  };
  const trackStreamLoader = async (myMap) => {
    const { updatedResult } = await apiGetVehicles(30);
    await dispatch(countVehTotal());
    await FbSubscribe(updatedResult, myMap);
  };
  return {
    trackStreamLoader,
  };
}

export default useStreamDataState;

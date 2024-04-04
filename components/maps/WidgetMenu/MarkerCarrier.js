import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import configUrls from "config/config";
import StreamHelper from "helpers/streamHelper";

const MarkerCarrier = ({ item, oneVehicle }) => {
  const { myMap } = useSelector((state) => state.mainMap);

  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };

  const app = initializeApp(firebaseConfig, "updatefb");
  const db = getDatabase(app);

  const { aggregate } = StreamHelper();

  useEffect(() => {
    let isUnmounted = false;
    const fetchDataAndUpdateState = async () => {
      try {
        let once = oneVehicle;
        const nodeRef = ref(db, `${item?.SerialNumber}`);
        const onDataChange = (snapshot) => {
          const timeOut = setTimeout(() => {
            if (!snapshot.hasChildren()) {
              myMap.unpin(item.VehicleID);
              return;
            }
            const newInfo = aggregate(snapshot.val(), item);
            myMap.UpdateMarker(
              { ...item, ...newInfo },
              { doRezoom: false },
              once
            );
            once = false;
          }, 0);
          if (isUnmounted) clearTimeout(timeOut);
        };

        onValue(nodeRef, onDataChange);
      } catch (error) {
        console.log(error);
      }
    };

    if (item && !isUnmounted && myMap) fetchDataAndUpdateState();

    return () => {
      isUnmounted = true;
      myMap.unpin(item.VehicleID, { doRezoom: false });
    };
  }, [item, myMap, db]);

  return null;
};

export default MarkerCarrier;

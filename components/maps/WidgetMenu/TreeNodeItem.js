import React, { useEffect, useState } from "react";
import configUrls from "config/config";
import { getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import { useTranslation } from "next-i18next";
import Styles from "styles/Tree.module.scss";
import { handleShowConfigItems } from "helpers/helpers";

const TreeNodeItem = ({ item, ToggleConfig }) => {
  const { t } = useTranslation("common");

  const [currentVehicle, setCurrentVehicle] = useState(item);
  const firebaseConfig = {
    databaseURL: configUrls.firebase_config.databaseURL,
  };
  const App = initializeApp(firebaseConfig, "updatefb");
  const db = getDatabase(App);
  useEffect(() => {
    const fetchVehicleData = async () => {
      const nodeRef = ref(db, `${item?.SerialNumber}`);
      const onDataChange = (snapshot) => {
        if (snapshot.exists()) {
          const newData = snapshot.val();
          newData
            ? setCurrentVehicle({
                ...item,
                ...newData,
              })
            : setCurrentVehicle({
                ...item,
              });
        } else {
          setCurrentVehicle({
            ...item,
          });
        }
      };
      onValue(nodeRef, onDataChange);
    };
    fetchVehicleData();
  }, [item]);

  return (
    <div className="d-flex align-items-center flex-column w-100">
      {/* car name & plateNumber */}
      <div className="d-flex align-items-start justify-content-start ">
        {ToggleConfig?.ToggleConfigSettings?.length > 0 &&
          ToggleConfig?.ToggleConfigSettings?.map((itemToggle, key) => {
            if (itemToggle.value) {
              return (
                <div
                  key={key}
                  className={`${Styles.menuItem} me-1 border-bottom`}
                  title={Object.values(itemToggle)[0]}
                  style={{
                    fontSize: "13px",
                    marginBottom: "10px",
                    paddingBottom: "5px",
                    overflow: "hidden",
                    marginTop: "4px",
                    fontWeight: "600",
                  }}
                >
                  ({currentVehicle[itemToggle.name]} )
                </div>
              );
            }
          })}
      </div>

      {/* car data */}
      <div className="d-flex align-items-center justify-content-start w-100">
        {ToggleConfig?.ToggleConfig &&
          ToggleConfig?.ToggleConfig?.map((x, key) => {
            if (x.value) {
              return (
                <div key={key}>
                  {handleShowConfigItems(x.name, currentVehicle) && (
                    <div
                      key={key}
                      title={t(Object.values(x)[0])}
                      className="fw-bold me-1"
                      style={{
                        fontSize: "11px",
                        backgroundColor:
                          currentVehicle.Speed > currentVehicle.SpeedLimit
                            ? x.name === "Speed"
                              ? "#D9514E"
                              : "#246c66"
                            : "#246c66",
                        borderRadius: "5px",
                        marginTop: "-3px",
                        color: "#fff",
                        minWidth: "30px",
                        textAlign: "center",
                        padding: "0px 8px",
                      }}
                    >
                      {handleShowConfigItems(x.name, currentVehicle)}
                    </div>
                  )}
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default TreeNodeItem;

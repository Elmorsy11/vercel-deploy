import axios from "axios";
import moment, { utc } from "moment";
import XLSX from "xlsx-js-style";
import * as _ from "lodash";

export const locDataModel = {
  Duration: 0,
  WeightReading: "-",
  Address: null,
  RecordDateTime: "2020-01-01T00:00:01", //"2020-01-01T00:00:01", //L.Saferoad.Vehicle.Helpers.Date2KSA(new Date(2020,01,01)),
  Latitude: 0,
  Longitude: 0,
  Direction: 0,
  Speed: 0,
  EngineStatus: -1,
  IgnitionStatus: -1,
  VehicleStatus: -1,
  Mileage: 0,
  Temp: 0,
  HUM: 0,
  DoorStatus: "-",
  IsValidRecord: "-",
  RemainingFuel: "-",
  StoppedTime: "-",
  StreetSpeed: "-",
  WeightVolt: -1,
  EngineTotalRunTime: -1,
  RPM: -1,
  AccelPedalPosition: -1,
  MileageMeter: -1,
  TotalMileage: -1,
  FuelLevelPer: -1,
  InstantFuelConsum: -1,
  TotalFuelConsum: -1,
  CoolantTemp: -1,
};

export const locConfigModel = {
  AccountID: null,
  VehicleID: null,
  SerialNumber: null,
  Serial: null,
  WorkingHours: -1,
  HeadWeight: 0,
  TailWeight: 0,
  TotalWeight: 0,
  MinVolt: 0,
  MaxVolt: 0,
  HasSensor: 0,
  Duration: 0,
  WeightReading: -1,
  Address: null,
  RecordDateTime: "2020-01-01T00:00:01",
  Latitude: 0,
  Longitude: 0,
  Direction: 0,
  Speed: 0,
  EngineStatus: -1,
  IgnitionStatus: -1,
  VehicleStatus: 5,
  Mileage: 0,
  DoorStatus: "-",
  IsValidRecord: "-",
  RemainingFuel: "-",
  StoppedTime: "-",
  StreetSpeed: "-",
  WeightVolt: -1,
  EngineTotalRunTime: -1,
  RPM: -1,
  AccelPedalPosition: -1,
  MileageMeter: -1,
  TotalMileage: -1,
  FuelLevelPer: -1,
  InstantFuelConsum: -1,
  TotalFuelConsum: -1,
  CoolantTemp: -1,
  Battery1: -1,
  Battery2: -1,
  Battery3: -1,
  Battery4: -1,
  Hum1: -1,
  Hum2: -1,
  Hum3: -1,
  Hum4: -1,
  Temp1: 3000,
  Temp2: 3000,
  Temp3: 3000,
  Temp4: 3000,
};

export const Date2KSA = (_date) => moment(_date).utc().local();

export const Date2UTC = (_date) =>
  new Date(
    _date.indexOf("Date") < 0
      ? _date + "+0000"
      : utc(_date ?? new Date(0)).format("YYYY-MM-DDTHH:mm:ss") + "-0300"
  );

export const isDateExpired = (_locInfo) => {
  const locDate =
    _locInfo?.RecordDateTime ??
    Date2KSA(new Date(new Date().getFullYear(), 0, 1));
  const ksaNow = Date2KSA(utc(new Date()).format("YYYY-MM-DDTHH:mm:ss"));
  let age = (new Date(ksaNow) - new Date(locDate)) / 36e5;
  return (_locInfo?.EngineStatus !== 0 && age > 24) || age > 24;
};

export const GetStatusString = (vehicleStatus) => {
  switch (vehicleStatus) {
    case 5:
      return "Offline.";
    case 204:
      return "Sleep Mode.";
    case 101:
      return "Vehicle is Over Speeding.";
    case 100:
      return "Vehicle is running over street speed.";
    case 0:
      return "Vehicle is Stopped.";
    case 1:
      return "Vehicle is running normally.";
    case 2:
      return "Vehicle in Idle State.";
    default:
      return "Invalid Status";
  }
};

export const GetStatusStringMenu = (vehicleStatus) => {
  switch (vehicleStatus) {
    case 600:
    case 5:
      return "Offline.";
    case 101:
      return "Over Speeding";
    case 100:
      return "running";
    case 0:
      return "Stopped.";
    case 1:
      return "running";
    case 2:
      return "Idle";
    default:
      return "Invalid";
  }
};

export const isValidAddress = (_address) =>
  !(
    _address == null ||
    _address == "Address not found" ||
    _address.includes("(")
  );

export const WeightVoltToKG = (_locInfo, _settings) => {
  if (_locInfo.WeightVolt < 0) return _settings.WeightReading;
  if (
    _locInfo.WeightVolt < _settings.MinVoltage ||
    _settings.MinVoltage == _settings.MaxVoltage
  )
    return "Not Available";

  let weight =
    _settings.MaxVoltage == _settings.MinVoltage
      ? 0
      : ((_locInfo.WeightVolt - _settings.MinVoltage) * _settings.TotalWeight) /
      (_settings.MaxVoltage - _settings.MinVoltage);
  weight += _settings.HeadWeight;
  return weight.toFixed(1);
};

export const iconUrl = (VehicleStatus) => {
  let iconUrl = "/assets/images/cars/";
  switch (VehicleStatus) {
    case 0:
    case 1:
    case 2:
    case 100:
    case 101:
      iconUrl += VehicleStatus + ".png";
      // return <Car2 />;
      break;
    case 600:
    case 5:
      iconUrl += "5.png";
      // return <Car4 />;
      break;
    default:
      // return <Car7 />;

      iconUrl += "201.png";
  }
  // switch (Status) {
  //   case "late":
  //     iconUrl += "101.png";
  //     break;
  //   case "idle":
  //     iconUrl += "5.png";
  //     break;
  //   case "noshow":
  //     iconUrl += "201.png";
  //     break;
  //   case "started":
  //     iconUrl += "1.png";
  //     break;

  //   default:
  //     iconUrl += "0.png";
  // }
  return iconUrl;
};

export const colorStatus = (status) => {
  let colorStatus = "";
  switch (status) {
    case "stopped":
      colorStatus = "#c03221";
      break;
    case "waiting":
      colorStatus = "orange";
      break;
    case "running":
      colorStatus = "#1aa053";
      break;
    default:
      colorStatus = "black";
  }
  return colorStatus;
};
export const VehicleOptions = (t) => {
  return [
    {
      label: t ? `${t("sedan_key")} 1` : "",
      name: "sedan1",
      value: "/assets/images/cars/car0/",
      img: "/assets/images/cars/car0/1.png",
    },
    {
      label: t ? `${t("minivan_key")}` : "",
      name: "minivan",
      value: "/assets/images/cars/car1/",
      img: "/assets/images/cars/car1/1.png",
    },
    {
      label: t ? `${t("sedan_key")} 2` : "",
      name: "sedan2",
      value: "/assets/images/cars/car2/",
      img: "/assets/images/cars/car2/1.png",
    },
    {
      label: t ? `${t("pickup_key")}` : "",
      name: "pickup",
      value: "/assets/images/cars/car3/",
      img: "/assets/images/cars/car3/1.png",
    },
    {
      label: t ? `${t("truck_head_key")}` : "",
      name: "truck_head",
      value: "/assets/images/cars/car4/",
      img: "/assets/images/cars/car4/1.png",
    },
    {
      label: t ? `${t("reefer_truck_key")}` : "",
      name: "reefer_truck",
      value: "/assets/images/cars/car5/",
      img: "/assets/images/cars/car5/1.png",
    },
    {
      label: t ? `${t("jeep_key")}` : "",
      name: "jeep",
      value: "/assets/images/cars/car6/",
      img: "/assets/images/cars/car6/1.png",
    },
    {
      label: t ? `${t("bus_key")}` : "",
      name: "bus",
      value: "/assets/images/cars/car7/",
      img: "/assets/images/cars/car6/1.png",
    },
    {
      label: t ? `${t("truck_key")}` : "",
      name: "truck",
      value: "/assets/images/cars/car8/",
      img: "/assets/images/cars/car6/1.png",
    },
  ];
};

export const getKey = (state) => {
  // 1 : Running
  // 0 : Stopped
  // 2 : Idling
  // 5 : Offline
  // 101 : Over Speed
  // 100 : Over Street Speed
  // 203 : Invalid location
  switch (state) {
    case 0:
      return "stopped";
    case 1:
      return "running";
    case 2:
      return "idling";
    case 5:
    case 600:
      return "offline";
    case 100:
      return "over_street_speed";
    case 101:
      return "over_speed";
    case 203:
    default:
      return "invalid_location";
  }
};

export const fbtolocInfo = (_message, _initial = false) => {
  let _USER_VEHICLES =
    JSON.parse(localStorage.getItem(encryptName("user_vehicles"))) ?? [];

  const holdStatus = [600, 5, 0, 2];
  const CalcMileage = (Mileage) => ((Mileage ?? 0) / 1000).toFixed(1);
  const CalcDuration = (newInfo, oldInfo) =>
    Math.abs(
      new Date(newInfo.RecordDateTime) -
      new Date(oldInfo.RecordDateTime ?? newInfo.RecordDateTime)
    ); //in ms

  const CalcVehicleStatus = (newInfo) => {
    if (isDateExpired(newInfo)) {
      newInfo.VehicleStatus = 5;
    } else if (newInfo.IsFuelCutOff == true || newInfo.IsFuelCutOff == 1) {
      return 203;
    } else if (newInfo.IsPowerCutOff) {
      return 201;
    } else if (newInfo.EngineStatus == 1 && newInfo.Speed <= 5) {
      return 2;
    } else if (newInfo.EngineStatus == 1 && newInfo.Speed > 120) {
      return 101; //Vehicle is Over Speeding.
    } else if (
      newInfo.EngineStatus == 1 &&
      newInfo.Speed < 120 &&
      newInfo.Speed > 5
    ) {
      return 1;
    } else if (newInfo.EngineStatus == 0 && newInfo.Speed > 0) {
      return 300;
    } else if (newInfo.EngineStatus == 0) {
      return 0;
    }
    return 5;
  };
  const aggregate = (newInfo, oldInfo) => {
    if (newInfo.DeviceTypeID === 1) {
      newInfo.Mileage = parseFloat(oldInfo.Mileage ?? 0);
      newInfo.Mileage += !holdStatus.includes(newInfo.VehicleStatus)
        ? CalcDistance(newInfo, oldInfo)
        : 0;
      newInfo.Mileage = newInfo.Mileage.toFixed(1);
    }
    newInfo.VehicleStatus = CalcVehicleStatus(newInfo);
    newInfo.Duration = CalcDuration(newInfo, oldInfo);
    newInfo.Duration +=
      newInfo.VehicleStatus == oldInfo.VehicleStatus &&
        Number.isInteger(oldInfo.Duration)
        ? oldInfo.Duration
        : 0;
    newInfo.WeightReading = WeightVoltToKG(newInfo, oldInfo);

    if (oldInfo != null) {
      if (oldInfo.SyncAdd == undefined)
        oldInfo.SyncAdd = Object.assign(
          {},
          {
            Address: oldInfo.Address,
            RecordDateTime: oldInfo.RecordDateTime,
            Longitude: oldInfo.Longitude,
            Latitude: oldInfo.Latitude,
          }
        );
      let SyncAdd = oldInfo.SyncAdd;

      if (!isValidAddress(newInfo.Address) && isValidAddress(SyncAdd.Address))
        newInfo.Address = SyncAdd.Address;
    } else {
      getAddress(newInfo.SerialNumber, null);
    }
    return newInfo;
  };
  let _newInfo = _message.val();
  if (_newInfo == null) return { locInfo: null, updated: false };

  _newInfo.SerialNumber = _newInfo.SerialNumber ?? _newInfo.Serial;
  _newInfo.RecordDateTime = Date2KSA(_newInfo.RecordDateTime);
  _newInfo.Mileage = CalcMileage(_newInfo.Mileage);

  if (isDateExpired(_newInfo)) _newInfo.VehicleStatus = 5;
  delete _newInfo.Serial;
  let _oldInfo = Object.assign(
    {},
    _USER_VEHICLES?.find((x) => x.SerialNumber == _newInfo.SerialNumber)
  );
  if (Object.keys(_oldInfo).length === 0) {
    return { locInfo: _newInfo, updated: false };
  }

  if (
    _oldInfo.Latitude > 0 &&
    _newInfo.RecordDateTime != null &&
    new Date(_newInfo.RecordDateTime) < new Date(_oldInfo.RecordDateTime)
  )
    return {
      locInfo: _oldInfo,
      updated: false,
    };

  _newInfo = aggregate(_newInfo, _oldInfo, _initial);

  _oldInfo = Object.assign(_oldInfo, _newInfo); //_oldInfo = { ..._oldInfo, ...locInfo }; //join fix and updated data
  return { locInfo: _oldInfo, updated: true };
};

export const syncMapWithTree = (myMap, treeData, VehFullData, vehChecked) => {
  const visibleNodes = [...treeData];
  const hiddenNodes = VehFullData?.filter(
    (full) =>
      !visibleNodes.find((visible) => visible.VehicleID == full.VehicleID)
  );

  visibleNodes.forEach((visVeh) => {
    const isChecked = vehChecked.find(
      (chckVeh) => chckVeh.VehicleID == visVeh.VehicleID
    );
    const pinned = myMap && myMap.isExist(visVeh?.VehicleID);
    if (!!isChecked && !pinned) {
      myMap && myMap.pin(visVeh);
    } else if (!isChecked && pinned) myMap && myMap.unpin(visVeh?.VehicleID);
  });

  hiddenNodes?.forEach((hiddenVeh) => {
    myMap.unpin(hiddenVeh?.VehicleID);
  });
};

export const filterByNames = (t, data, inputValue) => {
  // Create a dynamic regex expression object with ignore case sensitivity
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  // clone the original data deeply
  // as we need to modify the array while iterating it
  const clonedData = _.cloneDeep(data);
  const results = clonedData.filter((object) => {
    // use filter instead of some
    // to make sure all items are checked
    // first check object.list and then check object.name
    // to avoid skipping list iteration when name matches
    return (
      object.subTitle.filter((item) => {
        if (re.test(t(item.name))) {
          item["highlight"] = true;
          return t(item.name);
        } else {
          return false;
        }
      }).length > 0 || re.test(t(object.name))
    );
  });
  return results;
};

export const filterBySerialNumber = (data, inputValue) => {
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  const clonedData1 = _.cloneDeep(data);
  const clonedDataAlt1 = clonedData1[0].children;

  const results = clonedDataAlt1?.filter((object) => {
    return (
      object?.children?.filter((item) => {
        if (
          re.test(item.SerialNumber) &&
          item.SerialNumber.startsWith(inputValue)
        ) {
          // const matches = match(item.SerialNumber, inputValue);
          // item["subTitle"] = parse(item.SerialNumber, matches);
          // if (item.SerialNumber.startsWith(inputValue)) {
          // }

          item["highlight"] = true;
          return item.SerialNumber;
        } else {
          return;
        }
      }).length > 0 || re.test(object.SerialNumber)
    );
  });
  // clonedData1.children = results;
  // const results1 = clonedData?.map((itemUp) => itemUp.children)
  return results;
};

export const filterByAnyWordsTrak = (data, inputValue, nameKey) => {
  // const re = new RegExp(_.escapeRegExp(inputValue), "i");
  const clonedData1 = _.cloneDeep(data);
  const clonedDataAlt1 = clonedData1[0].children;

  // nameKey
  // SerialNumber

  // let EnteredNameKey = nameKey || "SerialNumber";

  const results = clonedDataAlt1?.filter((object) => {
    return (
      object?.children?.filter((item) => {
        if (nameKey === "Address") {
          let itemStr = String(item[nameKey]);
          if (itemStr.toLocaleLowerCase().includes(inputValue)) {
            item["highlight"] = true;

            return itemStr;
          } else {
            return;
          }
        } else if (nameKey === "Speed") {
          const { treeFilterFrom, treeFilterTo } = inputValue;
          if (
            (treeFilterFrom === 0 && treeFilterTo >= 0) ||
            (!isNaN(treeFilterFrom) && !isNaN(treeFilterTo))
          ) {
            if (
              item[nameKey] > treeFilterFrom &&
              item[nameKey] <= treeFilterTo
            ) {
              item["highlight"] = true;

              return item[nameKey];
            } else {
              return;
            }
          }
        } else {
          let itemStr = String(item[nameKey]);
          if (itemStr.toLocaleLowerCase().startsWith(inputValue)) {
            item["highlight"] = true;

            return itemStr;
          } else {
            return;
          }
        }
      }).length > 0
    );
  });

  // || re.test(object[nameKey])

  // clonedData1.children = results;
  // const results1 = clonedData?.map((itemUp) => itemUp.children)
  return results;
};
/**
  * @param data table data for getting headerName keys 
 * @param router   param for not deleting _id from total users table (optional)
 */
export function handlingRowDataColumn(data, router) {
  const rowData = data?.map((el) => {
    const keys = Object.keys(el);

    const handledObj = {};
    keys.forEach((key) => {
      if (key === "_id") {
        if (router === "total users") {
          handledObj[key] = el[key];
        } else {
          delete handledObj._id
        }

      } else if (key === "idNumber") {
        delete handledObj.idNumber;
      } else if (key === "custodyId") {
        delete handledObj.custodyId;
      } else if (key === "firstRecordDateTime") {
        delete handledObj.firstRecordDateTime;
      } else if (key === "phoneNumber") {
        delete handledObj.phoneNumber;
      } else if (key === "SerialNumber") {
        delete handledObj.SerialNumber;
      } else if (key === "PlateNumber") {
        delete handledObj.PlateNumber;
      } else if (key === "vid") {
        delete handledObj.vid;
      } else if (key === "VehicleID") {
        delete handledObj.VehicleID;
      } else if (key === "GroupID") {
        delete handledObj.GroupID;
      } else if (typeof el[key] !== "object" && el[key]) {
        handledObj[key] = el[key];
      } else if (el[key] === 0) {
        handledObj[key] = el[key];
      } else if (!el[key]) {
        handledObj[key] = "N/A";
      }
    });

    return handledObj;
  });
  return rowData;
}

// Transforms object key and returns a new array with the new Key
export const changeRowDataKeys = (data) => {
  const newArr = data.map((obj) => {
    const newObj = {};
    const allKeys = [
      "SPEED COUNT",
      "BRAKE COUNT",
      "ACCEL COUNT",
      "SEAT BCOUNT",
      "NIGHTDRIVE COUNT",
      "FATIG COUNT",
      "DRIFT COUNT",
      "TEMPR COUNT",
      "SPEED POINTS",
      "BRAKE POINTS",
      "ACCEL POINTS",
      "SEAT BPOINTS",
      "NIGHTDRIVE POINTS",
      "FATIG POINTS",
      "DRIFT POINTS",
      "TEMPR POINTS",
      "DATE",
      "START COORDINATES",
      "END COORDINATES",
      "VEHICLE ID",
      "MOBILE",
      "PARENT MOBILE",
      "MAX SPEED",
      "DURATION",
      "RISK LEVEL",
      "STUDENT TYPE",
      "TOTAL VIOLATION POINTS",
      "SERIAL NUMBER",
      "PLATE NUMBER"
    ];
    //You have to add a condition on the Object key name and perform your actions
    allKeys.forEach((key) => {
      if (obj[key] === null || !obj[key]) {
        newObj[key] = "N/A";
      } else {
        newObj[key] = obj[key];
      }
    });

    return { ...obj, ...newObj };
  });
  return newArr;
};
import fileSaver from "file-saver";
export function convertJsonToExcel(
  data = {},
  fileName = "",
  colorHeader = "246C66",
  colorRow = "babfc7",
  columnWidth = 200,
  rowHeight = 30
) {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();

  const columnWidths = new Array(Object?.keys(data[0] ?? {}).length).fill({
    wpx: columnWidth,
  });
  const rowHeights = new Array(data.length + 1).fill({ hpx: rowHeight });

  workSheet["!cols"] = columnWidths;
  workSheet["!rows"] = rowHeights;

  for (var i in workSheet) {
    if (typeof workSheet[i] != "object") continue;
    let cell = XLSX.utils.decode_cell(i);
    workSheet[i].s = {
      alignment: {
        vertical: "center",
        horizontal: "center",
        wrapText: false,
      },
      border: {
        top: { style: "thin", color: { rgb: "black" } },
        bottom: { style: "thin", color: { rgb: "black" } },
        left: { style: "thin", color: { rgb: "black" } },
        right: { style: "thin", color: { rgb: "black" } },
      },
    };

    if (cell.r == 0) {
      workSheet[i].s.fill = {
        patternType: "solid",
        fgColor: { rgb: colorHeader },
        bgColor: { rgb: colorHeader },
      };
      workSheet[i].s.font = {
        color: { rgb: "ffffff" },
        sz: "12",
        bold: true,
      };
    }

    if (cell.r != 0 && cell.r % 2 == 0) {
      workSheet[i].s.fill = {
        patternType: "solid",
        fgColor: { rgb: colorRow },
        bgColor: { rgb: colorRow },
      };
      workSheet[i].s.font = {
        color: { rgb: "ffffff" },
        sz: "12",
        bold: true,
      };
    }
  }

  XLSX.utils.book_append_sheet(workBook, workSheet, fileName);

  // Generate a Blob from the workbook
  const wbBlob = new Blob(
    [XLSX.write(workBook, { bookType: "xlsx", type: "array" })],
    {
      type: "application/octet-stream",
    }
  );

  // Save the file using file-saver
  fileSaver.saveAs(wbBlob, `${fileName}.xlsx`);
}
export function exportToCsv(
  filename,
  rows,
  colorHeader = "246C66",
  colorRow = "babfc7"
) {
  if (!rows || !rows.length) {
    return;
  }
  const separator = ",";
  const keys = Object.keys(rows[0]);
  const csvData =
    keys.join(separator) +
    "\n" +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell =
              cell instanceof Date
                ? cell.toLocaleString()
                : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join("\n");
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    // const link = document.querySelector("a");
    if (link.download !== undefined) {
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      // link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

export const fetchAllDrivers = async (token, setLoading, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/drivers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          const result = response.data;
          setData_table(result?.drivers);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const fetchAllMaintenance = async (token, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/management/maintenance`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then(({ data }) => {
      setData_table(data?.result);
    })
    .catch((err) => console.log(err));
};

export const fetchAllGeofence = async (token, setData_table) => {
  await axios
    .get(`geofences`)
    .then(({ data }) => {
      setData_table(data?.allGeoFences?.map((item) => item.handledData));
    })
    .catch((err) => console.log(err));
};

export const handleGroups = (groups) => {
  if (groups["null"]) {
    groups["Un Grouped"] = [...groups["null"]];
  }
  if (groups["default"]) {
    groups["Default"] = [...groups["Default"], ...groups["default"]];
  }
  delete groups["null"];
  delete groups["default"];
  if (groups["Ungrouped"]?.length) {
    const UnGrouped = groups["Ungrouped"];
    delete groups["Ungrouped"];
    groups = { "Un Grouped": UnGrouped, ...groups };
  }

  const result = [
    {
      title: "All",
      children: [groups],
    },
  ];
  for (let key in result[0]?.children[0]) {
    if (Object.hasOwn(result[0]?.children[0], key))
      result[0]?.children?.push({
        title: key,
        children: result[0]?.children[0][key],
      });
  }
  result[0]?.children?.splice(0, 1);
  return result;
};

export const handleCheckKey = (keys, key) =>
  Object.keys(keys).some((element) => element == key);

export const handleFilterVehs = (statusVeh, streamData) => {
  let flterData;

  if (statusVeh.active === 2) {
    flterData = streamData.VehFullData.filter(
      (item) => item.VehicleStatus !== 5
    );
  } else if (statusVeh.stopped === 1) {
    flterData = streamData.VehFullData.filter(
      (item) => item.VehicleStatus === 5
    );
  } else {
    flterData = streamData.VehFullData;
  }

  return flterData;
};

export const fetchLoginAction = async () => {
  try {
    const res = await axios.get(
      "http://dashcam.saferoad.net:9966/vss/user/apiLogin.action?username=admin&password=21232f297a57a5a743894a0e4a801fc3"
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    console.log("Failed to fetch loginAction", error);
  }
};

export const fetchData = async (token, setLoading, setData_table, api) => {
  let myToken = token.toString();
  setLoading(true);
  await axios
    .get(api, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        const result = response.data;
        setData_table(result?.result);
      }
    })
    .finally(() => {
      setLoading(false);
    })
    .catch((err) => console.log(err));
};

export const postData = async (
  token,
  data,
  toast,
  setLoading,
  // path,
  api
) => {
  let myToken = token.toString();
  setLoading(true);
  await axios
    .post(api, data, {
      // method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((res) => {
      if (res.status === 201) {
        toast.success("Driver Add Successfully.");
        return "add";
      }
    })
    .catch((error) => {
      toast.error(`Error: ${error?.message}`);
    })
    .finally(() => {
      setLoading(false);
    });
};

export const fetchAllSimCards = async (token, setLoading, setData_table) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/management/sim?provider=4`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          const result = response.data;
          setData_table(result?.result);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const fetchAllUnassignedSimCards = async (
  token,
  setLoading,
  setData_table
) => {
  let myToken = token.toString();
  await axios
    .get(`dashboard/management/sim/unassigned`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${myToken}`,
      },
    })
    .then((response) => {
      setLoading(true);
      setTimeout(() => {
        if (response.status === 200) {
          setLoading(false);
          const result = response.data;
          setData_table(result?.result);
        }
      }, 1000);
    })
    .catch((err) => console.log(err));
};

export const updateDriver = (setOpenUpdate, setDriverID, id) => {
  setOpenUpdate(true);
  setDriverID(id);
};

export const fetchAllIncentiveHistory = async (
  traineeID,
  token,
  setInsentiveHistoryData,
  setInsentiveLoading
) => {
  try {
    let myToken = token.toString();
    setInsentiveLoading(true)

    const res = await axios
      .get(`/incentive/getIncentiveHistory/${traineeID}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${myToken}`,
        },
      })
    const insetiveData = res?.data.history

    if (res.status === 200) {
      setInsentiveHistoryData(insetiveData)
      setInsentiveLoading(false)
    }

  } catch (error) {
    console.log(error);
  }
};





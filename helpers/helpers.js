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
  lastTrips: "",
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
  lastTrips: "",
};
export const validateEmail = (email) => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const result = regex.test(email);
  return result;
};
export const formatDurDates = (strDate, endDate, lvl = 6) => {
  const strD = moment(strDate);
  const endD = moment(endDate);

  return formatDuration(endD.diff(strD), lvl);
};
const getAvg = (vals, navalue, dev = 1) => {
  vals = vals.filter((x) => x && x != navalue && !isNaN(x));
  let avg = !vals.length
    ? navalue
    : vals.reduce((a, b) => a + b, 0) / vals.length;
  return avg == navalue ? navalue : avg / dev;
};
export const handleShowConfigItems = (x, item) => {
  switch (x) {
    case "Speed":
      return (
        <>
          {item["Speed"] ?? 0}{" "}
          <span style={{ fontSize: "0.438rem" }}>km/h</span>
        </>
      );
    case "Mileage":
      return (
        <>
          {item["Mileage"] / 1000 ?? 0}{" "}
          <span style={{ fontSize: "0.438rem" }}>km</span>
        </>
      );
    case "TotalWeight":
      if (item["WeightReading"] > 0) {
        return (
          <>
            {item["WeightReading"]}
            <span style={{ fontSize: "0.438rem" }}>kg</span>
          </>
        );
      } else {
        return null;
      }
    case "Temp":
      var listOfTemps = [item?.Temp1, item?.Temp2, item?.Temp3, item?.Temp4];
      var listOfFilteredTemps = listOfTemps.filter((item) => item !== 3000);

      if (listOfFilteredTemps.length > 0) {
        let AVGListOfFilteredTemps =
          listOfFilteredTemps.reduce((acc, item) => acc + item, 0) /
          listOfFilteredTemps.length;

        return (
          <>
            {AVGListOfFilteredTemps?.toFixed(1) ?? 0}{" "}
            <span style={{ fontSize: "0.438rem" }}>C</span>
          </>
        );
      } else {
        return "Disconnected";
      }
    case "Humidy":
      var listOfHums = [item["Hum1"], item["Hum2"], item["Hum3"], item["Hum4"]];
      if (getAvg(listOfHums, -1, 10) != -1) {
        return (
          <>
            {getAvg(listOfHums, -1, 10) ?? 0}{" "}
            <span style={{ fontSize: "0.438rem" }}>%</span>
          </>
        );
      } else {
        return "Not Available";
      }
    case "EngineStatus":
      return item["EngineStatus"] == true ? "On" : "Off";

    case "Direction":
      return item["Direction"] !== 0 ? item["Direction"] : "0";
    default:
      return item[x];
  }
};

// calculate group badge
export const calcGroupBadge = (root) => {
  if (!root?.children) return 1;
  let sum = 0;
  root?.children.forEach((group) => {
    if (group.children && Array.isArray(group.children)) {
      group.count += calcGroupBadge(group);
      sum += group.count;
    } else {
      sum += 1;
    }
  });

  return sum;
};

// create the tree format that we needed in the rc-tree
export const convertTreeFormat = (group) => {
  if (!group?.children) return group;

  const treeFormat = {
    title: group.Name,
    ID: group.ID,
    children: [],
  };

  for (let childGroup of group.children) {
    if (childGroup?.children?.length > 0 || !childGroup.children) {
      treeFormat.children.push(convertTreeFormat(childGroup));
    }
  }

  return treeFormat;
};

// remove empty subgroups in case filter
export const removeEmptySubgroups = (array) => {
  return array.filter((obj) => {
    if (obj.children && Array.isArray(obj.children)) {
      obj.children = removeEmptySubgroups(obj.children);
      if (obj.children.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
};

export const formatDuration = (ms, lvl = 6) => {
  const pd = (n) => n.toString().padStart(2, "0");
  const mms = 6e4;
  const hh = 60 * mms;
  const dd = 24 * hh;
  const mm = 30 * dd;
  const yy = 365 * dd;
  const yrs = lvl < 6 ? 0 : Math.floor(ms / yy);
  const mths = lvl < 5 ? 0 : Math.floor((lvl <= 5 ? ms : ms % yy) / mm);
  const days = lvl < 4 ? 0 : Math.floor((lvl <= 4 ? ms : ms % mm) / dd);
  const hs = lvl < 3 ? 0 : Math.floor((lvl <= 3 ? ms : ms % dd) / hh);
  const mins = lvl < 2 ? 0 : Math.floor((lvl <= 2 ? ms : ms % hh) / mms);
  const ss = Math.floor((lvl <= 1 ? ms : ms % mms) / 1e3);

  return `${yrs ? `${pd(yrs)}y-` : ""}${mths || yrs ? `${pd(mths)}m-` : ""}${
    days || mths || yrs ? `${pd(days)}d ` : ""
  }${hs || days || mths || yrs ? `${pd(hs)}:` : ""}${pd(mins)}:${pd(ss)}`;
};

export const formatDurationV2 = (seconds) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;

  let formattedDuration = "";

  if (seconds < 60) {
    formattedDuration += `00:00:${
      remainingSeconds > 9 ? remainingSeconds : `0${remainingSeconds}`
    }`;
  } else if (seconds < 3600) {
    formattedDuration += `00:${minutes > 9 ? minutes : `0${minutes}`}:${
      remainingSeconds > 9 ? remainingSeconds : `0${remainingSeconds}`
    }`;
  } else {
    formattedDuration += `${hours > 9 ? hours : `0${hours}`}:${
      minutes > 9 ? minutes : `0${minutes}`
    }:${remainingSeconds > 9 ? remainingSeconds : `0${remainingSeconds}`}`;
  }
  return formattedDuration;
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
    case 500:
      return "Not connected";
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

export const isValidAddress = (_address) =>
  !(
    _address == null ||
    _address == "Address not found" ||
    _address.includes("(")
  );

export const WeightVoltToKG = (_locInfo, _settings) => {
  if (_locInfo.WeightVolt < _settings.MinVolt) {
    return _settings.HeadWeight;
  }
  if (_locInfo.WeightVolt > _settings.MaxVolt) {
    return _settings.TotalWeight;
  }
  if (_locInfo.WeightVolt < 0) return _settings.WeightReading;
  if (
    _locInfo.WeightVolt < _settings.MinVolt ||
    _settings.MinVolt == _settings.MaxVolt
  )
    return "Not Available";

  let weight =
    _settings.MaxVolt == _settings.MinVolt
      ? 0
      : ((_locInfo.WeightVolt - _settings.MinVolt) * _settings.TotalWeight) /
        (_settings.MaxVolt - _settings.MinVolt);
  weight += _settings.HeadWeight;
  weight = weight.toFixed(1);
  return weight;
};

export const iconUrl = (config, iconUrlLocal, VehicleStatus) => {
  let iconUrlPass;
  const iconsWithNames = {
    sedan1: "/assets/images/cars/car0/",
    minivan: "/assets/images/cars/car1/",
    sedan2: "/assets/images/cars/car2/",
    pickup: "/assets/images/cars/car3/",
    truck_head: "/assets/images/cars/car4/",
    reefer_truck: "/assets/images/cars/car5/",
    jeep: "/assets/images/cars/car6/",
    bus: "/assets/images/cars/car7/",
    truck: "/assets/images/cars/car8/",
    forklift: "/assets/images/cars/car9/",
    generator: "/assets/images/cars/car10/",
  };

  if (config == null || config == "null" || config == undefined) {
    if (iconUrlLocal != undefined) {
      iconUrlPass = iconUrlLocal;
    } else {
      iconUrlPass = iconsWithNames["sedan1"];
    }
  } else {
    iconUrlPass =
      iconsWithNames[
        typeof config == "string" && config.includes("icon")
          ? JSON.parse(config).icon
          : config.icon
      ] ??
      iconUrlLocal ??
      iconsWithNames["sedan1"];
  }

  switch (VehicleStatus) {
    case 0:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 1:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 2:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 5:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 204:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 100:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 101:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 600:
      iconUrlPass += VehicleStatus + ".png";
      break;
    case 500:
      iconUrlPass += VehicleStatus + ".png";
      break;
    default:
      iconUrlPass += "201.png";
  }
  return iconUrlPass;
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
      img: "/assets/images/cars/car7/1.png",
    },
    {
      label: t ? `${t("truck_key")}` : "",
      name: "truck",
      value: "/assets/images/cars/car8/",
      img: "/assets/images/cars/car8/1.png",
    },
    {
      label: t ? `${t("forklift_key")}` : "",
      name: "forklift",
      value: "/assets/images/cars/car9/",
      img: "/assets/images/cars/car9/1.png",
    },
    {
      label: t ? `${t("generator_key")}` : "",
      name: "generator",
      value: "/assets/images/cars/car10/",
      img: "/assets/images/cars/car10/1.png",
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
      return "offline";
    case 600:
      return "offline";
    case 100:
      return "over_street_speed";
    case 101:
      return "over_speed";
    case 204:
      return "Sleeping_Mode";
    case 500:
      return "Not_Connected";
    default:
      return "invalid_location";
  }
};

// export const syncMapWithTree = (myMap, treeData, vehChecked, VehFullData) => {
//   const visibleNodes = [...treeData];
//   const hiddenNodes = VehFullData?.filter(
//     (full) =>
//       !visibleNodes.find((visible) => visible.VehicleID == full.VehicleID)
//   );

//   visibleNodes.forEach((visVeh) => {
//     const isChecked = vehChecked.find(
//       (chckVeh) => chckVeh.VehicleID == visVeh.VehicleID
//     );

//     const pinned = myMap && myMap.isExist(visVeh?.VehicleID);
//     if (!!isChecked && !pinned) {
//       myMap && myMap.pin(visVeh);
//     } else if ((!isChecked && pinned) || !isChecked) {
//       myMap && myMap.unpin(visVeh?.VehicleID);
//     }
//   });

//   hiddenNodes?.forEach((hiddenVeh) => {
//     myMap.unpin(hiddenVeh?.VehicleID);
//   });
// };

export const filterByNames = (t, data, inputValue) => {
  // Create a dynamic regex expression object with ignore case sensitivity
  const re = new RegExp(_.escapeRegExp(inputValue), "i");
  // clone the original data deeply
  // as we need to modify the array while iterating it
  const clonedData = _.cloneDeep(data);
  const filteredMain = clonedData.filter((object) => {
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
  // filter subTitle reports to return only searched reports
  const result = filteredMain.map((object) => {
    const newObj = object.subTitle.filter((item) => {
      return re.test(t(item.name));
    });
    return { ...object, subTitle: newObj };
  });
  return result;
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

// Transforms object key and returns a new array with the new Key
export const changeRowDataKeys = (data) => {
  const newArr = data.map((obj) => {
    const newObj = {};
    //You have to add a condition on the Object key name and perform your actions
    Object.keys(obj).forEach((key) => {
      if (key === "RecordDateTime") {
        delete newObj.RecordDateTime;
      } else if (key === "SyncAdd") {
        delete newObj.SyncAdd;
      } else if (key === "Speed") {
        newObj[key] = obj[key].toString();
      } else if (key === "EngineStatus") {
        newObj[key] = obj[key] ? "On" : "Off";
      } else if (key === "VehicleStatus") {
        newObj[key] = GetStatusString(obj[key]);
      } else if (obj[key] === null || !obj[key]) {
        newObj[key] = "N/A";
      } else {
        newObj[key] = obj[key];
      }
    });
    let keys = [];
    Object.keys(newObj).forEach((key) => {
      keys.push(key);
    });

    return newObj;
  });
  return newArr;
};

import fileSaver from "file-saver";
import { object } from "yup";

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
  rows
  // colorHeader = "246C66",
  // colorRow = "babfc7"
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

export const fetchData = async (setLoading, setData_table, api) => {
  setLoading(true);
  await axios
    .get(api)
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
  data,
  toast,
  setLoading,
  // path,
  api
) => {
  setLoading(true);
  await axios
    .post(api, data)
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

// unused for now
export const handleStorageData = (item) => {
  return {
    AccountID: item.AccountID,
    VehicleID: item.VehicleID,
    SerialNumber: item.SerialNumber,
    Serial: item.Serial,
    WorkingHours: item.WorkingHours,
    HeadWeight: item.HeadWeight,
    TailWeight: item.TailWeight,
    TotalWeight: item.TotalWeight,
    MinVolt: item.MinVolt,
    MaxVolt: item.MaxVolt,
    HasSensor: item.HasSensor,
    Duration: item.Duration,
    WeightReading: item.WeightReading,
    Address: item.Address,
    RecordDateTime: item.RecordDateTime,
    Latitude: item.Latitude,
    Longitude: item.Longitude,
    Direction: item.Direction,
    Speed: item.Speed,
    EngineStatus: item.EngineStatus,
    IgnitionStatus: item.IgnitionStatus,
    VehicleStatus: item.VehicleStatus,
    Mileage: item.Mileage,
    DoorStatus: item.DoorStatus,
    IsValidRecord: item.IsValidRecord,
    RemainingFuel: item.RemainingFuel,
    StoppedTime: item.StoppedTime,
    StreetSpeed: item.StreetSpeed,
    WeightVolt: item.WeightVolt,
    EngineTotalRunTime: item.EngineTotalRunTime,
    RPM: item.RPM,
    AccelPedalPosition: item.AccelPedalPosition,
    MileageMeter: item.MileageMeter,
    TotalMileage: item.TotalMileage,
    FuelLevelPer: item.FuelLevelPer,
    InstantFuelConsum: item.InstantFuelConsum,
    TotalFuelConsum: item.TotalFuelConsum,
    CoolantTemp: item.CoolantTemp,
    Battery1: item.Battery1,
    Battery2: item.Battery2,
    Battery3: item.Battery3,
    Battery4: item.Battery4,
    Hum1: item.Hum1,
    Hum2: item.Hum2,
    Hum3: item.Hum3,
    Hum4: item.Hum4,
    Temp1: item.Temp1,
    Temp2: item.Temp2,
    Temp3: item.Temp3,
    Temp4: item.Temp4,
    imei: item.imei,
    SimSerialNumber: item.SimSerialNumber,
    DeviceTypeID: item.DeviceTypeID,
    PlateNumber: item.PlateNumber,
    DisplayName: item.DisplayName,
    SpeedLimit: item.SpeedLimit,
    FireBaseLiveDB: item.FireBaseLiveDB,
    DriverID: item.DriverID,
    // DriverName: item.DriverName,
    // GroupID: item.GroupID,
    // GroupName: item.GroupName,
    // configJson: item.configJson,
    // _id: item._id,
    // StatusCode: item.StatusCode,
    // AlarmCode: item.AlarmCode,
    // Distance: item.Distance,
    // UpdateSetting: item.UpdateSetting,
    // TripStatus: item.TripStatus,
    // IdleStatus: item.IdleStatus,
    // IngestionDate: item.IngestionDate,
    // HarshAcceleration: item.HarshAcceleration,
    // HarshBreaking: item.HarshBreaking,
    // IsOverSpeed: item.IsOverSpeed,
    // IsFuelCutOff: item.IsFuelCutOff,
    // IsPowerCutOff: item.IsPowerCutOff,
    // IsLowPower: item.IsLowPower,
    // IsPowerFromBettary: item.IsPowerFromBettary,
    // IsSOSHighJack: item.IsSOSHighJack,
    // EventType: item.EventType,
    // IdleTime: item.IdleTime,
    // BatteryVoltage: item.BatteryVoltage,
    // SeatBeltStatus: item.SeatBeltStatus,
    // SeatBelt: item.SeatBelt,
    // SleepStatus: item.SleepStatus,
    // Temp: item.Temp,
    // IsCrash: item.IsCrash,
    // WeightSensorReading: item.WeightSensorReading,
    // ActualWeight: item.ActualWeight,
    // CargoWeight: item.CargoWeight,
  };
};
/**
 * @param data[]
 * @desc to get all vehs if it has children || nested children
 */
export const getAllVehs = (data) => {
  let vehs = [];
  data.forEach((obj) => {
    if (obj.VehicleID !== undefined) {
      vehs.push(obj);
    } else {
      vehs = [...vehs, ...getAllVehs(obj.children)];
    }
  });
  return vehs;
};
/**
 * @param event file which uploaded
 * @param setErrorState to handle error message
 * @param t  translation key
 * @desc this function to handle image size and extension
 */
export const FileImageDimensionsHandler = (event, setErrorState, t) => {
  const file = event.target.files[0];
  const imgExtensions = ["png", "jpg", "jpeg"];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
        if (!imgExtensions.includes(fileExtension)) {
          setErrorState(t("image extension must be Jpg or jpeg or png"));
        } else if (fileSizeInMB > 5) {
          setErrorState(
            t("Please make sure that the image size is not larger than 5 MB.")
          );
        } else {
          setErrorState(null);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

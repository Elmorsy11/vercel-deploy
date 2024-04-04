import moment from "moment";
export const changeRowDataKeys = (data) => {
  const filteredData = data.filter((obj) => obj.ID !== "DummyStep");
  const newArr = filteredData.map((obj) => {
    const newObj = {};
    //You have to add a condition on the Object key name and perform your actions
    Object.keys(obj).forEach((key) => {
      if (
        key === "Address" &&
        typeof obj[key] !== "string" &&
        typeof obj[key] !== "undefined"
      ) {
        delete newObj.Address;
        newObj["Start Address"] = obj[key][0];
        newObj["End Address"] = obj[key][1];
      } else if (key === "ID") {
        delete newObj.ID;
      } else if (key === "Coord") {
      } else if (key === "configJson") {
        delete newObj.configJson;
      } else if (key === "Coord") {
      } else if (key === "Endvent") {
        delete newObj.Endvent;
        newObj["EndEvent"] = obj[key];
      } else if (key === "Coord") {
        delete newObj.Coord;
        newObj["Start Coord"] = `(${(obj[key][0], obj[key][1])})`;
        newObj["End Coord"] = `(${(obj[key][2], obj[key][3])})`;
      } else if (key === "EndAdd") {
        delete newObj.EndAdd;
      } else if (
        key === "StrDate" ||
        key === "EndDate" ||
        key === "RecordDateTime" ||
        (key === "IdleStart" && obj[key])
      ) {
        newObj[key] = moment(obj[key])
          .utc()
          .local()
          .format("YYYY-MM-DD HH:mm:ss A");
      } else if (key === "Guide") {
        delete newObj.Guide;
      } else if (
        obj[key] === "null" ||
        !obj[key] ||
        obj[key].toString().trim() === "null" ||
        obj[key] === ""
      ) {
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

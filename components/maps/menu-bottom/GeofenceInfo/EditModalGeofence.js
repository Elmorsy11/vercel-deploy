import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { CustomInput } from "../../../CustomInput";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const EditModalGeofence = ({
  ID,
  setData_table,
  Data_table,
  showEditFencModal,
  setShowEditFencModal,
  setShowViewFencModal,
}) => {
  const { t } = useTranslation("Table");
  const [EditModalData, setEditModalData] = useState({
    GeofenceName: "",
    Speed: "",
    // Email: "",
  });
  const L = require("leaflet");
  const { myMap } = useSelector((state) => state.mainMap);
  const [speedErrorMsg, setSpeedErrorMsg] = useState("");

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [speedMsg, setSpeedMsg] = useState("");
  const { darkMode } = useSelector((state) => state.config);

  useEffect(() => {
    if (showEditFencModal) {
      let Data_tableFiltered = Data_table.filter((item) => item.ID === ID)[0];
      setEditModalData(Data_tableFiltered);
      switch (Data_tableFiltered.GeoFenceType) {
        case 1:
          L.circle(
            [
              Data_tableFiltered.GeofenceCenterPoint.lat,
              Data_tableFiltered.GeofenceCenterPoint.lng,
            ],
            {
              color: "red",
              radius: +Data_tableFiltered.GeofenceRadius,
            }
          ).addTo(myMap.groups.drawGroup);
          break;
        case 2:
          L.polygon(Data_tableFiltered?.GeofencePath, { color: "red" }).addTo(
            myMap.groups.drawGroup
          );
          break;
        case 3:
          const GeofenceBoundsLat1 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[0]
            .split(",")[0]
            .slice(1);
          const GeofenceBoundsLng1 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[0]
            .split(",")[1]
            .slice(0, -1);

          const GeofenceBoundsLat2 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[1]
            .split(",")[0]
            .slice(1);
          const GeofenceBoundsLng2 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[1]
            .split(",")[1]
            .slice(0, -1);

          const GeofenceBoundsLat3 = +Data_tableFiltered.GeofenceBounds?.split(
            "|"
          )[2]
            ?.split(",")[0]
            ?.slice(1);
          const GeofenceBoundsLng3 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[2]
            ?.split(",")[1]
            ?.slice(0, -1);

          const GeofenceBoundsLat4 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[3]
            ?.split(",")[0]
            ?.slice(1);
          const GeofenceBoundsLng4 = +Data_tableFiltered.GeofenceBounds.split(
            "|"
          )[3]
            ?.split(",")[1]
            ?.slice(0, -1);

          const GeoBounds = [
            [GeofenceBoundsLat1, GeofenceBoundsLng1],
            [GeofenceBoundsLat2, GeofenceBoundsLng2],
            [GeofenceBoundsLat3, GeofenceBoundsLng3],
            [GeofenceBoundsLat4, GeofenceBoundsLng4],
          ];
          if (!GeofenceBoundsLat3 || !GeofenceBoundsLng3) {
            return toast.warning(
              "There is Something wrong with this geofence Please remove it."
            );
          }

          L.rectangle(GeoBounds, {
            color: "red",
          }).addTo(myMap.groups.drawGroup);
          break;
      }
    }
  }, [ID, showEditFencModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoading(true);

    try {
      await axios.put(`geofences/${ID}`, { ...EditModalData });
      Data_table?.map((item) => {
        if (item.ID === ID) {
          item.GeofenceName = EditModalData.GeofenceName;
          item.Speed = EditModalData.Speed;
        }
      });
      setData_table([...Data_table]);
      myMap.groups.drawGroup.clearLayers();
    } catch (e) {
      toast.error(e?.response?.data?.message);
    }

    if (myMap.groups.drawGroup.getLayers().length == 0) {
      setTimeout(() => {
        toast.success("Geofence Updated Successfully.");
        setValidated(false);
        setShowEditFencModal(false);
        setShowViewFencModal(true);
        setLoading(false);
      }, 500);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Speed") {
      if (+value <= 300) {
        setSpeedMsg("");
      } else {
        setSpeedMsg("Speed Must Be Less Than 300");
        return;
      }
    }

    setEditModalData({
      ...EditModalData,
      [name]: value,
    });
  };

  const checkIfNumber = (e) => {
    return !/[0-9]/.test(e.key) ? true : false;
  };

  const handleSpeedOnKeyPress = (e) => {
    if (checkIfNumber(e)) {
      e.preventDefault();

      setSpeedMsg("Please_Enter_Number_Only!");
    } else {
      setSpeedMsg("");
    }
  };

  return (
    <div
      className={` p-3 rounded shadow `}
      style={{
        background: darkMode ? "#222738" : "#FFFFFF",
      }}
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <CustomInput
            required={true}
            value={EditModalData.GeofenceName}
            handleChange={handleChange}
            Name="GeofenceName"
            Label={t("Geofence_Name")}
          />

          <div className="col-12 col-md-4  positon-relative ">
            <CustomInput
              ClassN="col-12"
              required={true}
              value={EditModalData.Speed}
              handleChange={handleChange}
              Name="Speed"
              Label={t("Geofence_Speed")}
              Type="number"
            />
            {speedMsg && (
              <span
                style={{ color: "red", marginTop: "-10px" }}
                className=" d-block"
              >
                {speedMsg}
              </span>
            )}
          </div>
        </Row>
        <div className="w-50">
          <Button
            className="me-2 px-2 py-1 w-25 bg-primary d-inline-flex justify-content-center align-items-center"
            type="submit"
            disabled={loading || speedMsg}
          >
            {!loading ? (
              <FontAwesomeIcon className="mx-2" icon={faCheck} size="sm" />
            ) : (
              <FontAwesomeIcon
                className="mx-2 fa-spin"
                icon={faSpinner}
                size="sm"
              />
            )}
            <span>{t("Save")}</span>
          </Button>
          <Button
            className="px-2 py-1 w-25 bg-primary d-inline-flex justify-content-center align-items-center"
            type="button"
            onClick={() => {
              setShowEditFencModal(false);
              setShowViewFencModal(true);
              setValidated(false);
              setLoading(false);

              myMap.groups.drawGroup.clearLayers();
            }}
          >
            <FontAwesomeIcon className="mx-2" icon={faTimes} size="sm" />
            <span>{t("Cancel")}</span>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditModalGeofence;

import dynamic from "next/dynamic";
import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MapIcon from "@mui/icons-material/Map";
import SpeedIcon from "@mui/icons-material/Speed";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const ViolationsPopup = React.memo(({ user, mainDashboard = false }) => {
  return (
    <Popup
      style={mainDashboard ? { width: "320px" } : null}
      position={[user?.data?.Latitude, user?.data?.Longitude]}
      closeButton={false}
    >
      <div className="popup p-4">
        <div className="popup-profile mb-4">
          <div className="popup__image">
            <img src={user.user.image?.url} alt="" />
          </div>
          <div className="popup__info">
            <div>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  lineHeight: "12px",
                }}
              >
                {user.user.username}
              </h3>
              <p>{mainDashboard ? user.user.idNumber : user.user.email}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {user?.data?.IsOverSpeed ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Over Speed</span>
            </div>
          ) : null}
          {user?.data?.IsPowerCutOff ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Power Cut off</span>
            </div>
          ) : null}
          {user?.user?.AccelCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Harsh Acceleration</span>
            </div>
          ) : null}
          {user?.user?.SeatBCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Seat Belt</span>
            </div>
          ) : null}
          {user?.user?.BrakeCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Harsh Brake</span>
            </div>
          ) : null}
          {user?.user?.NightDriveCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Night Drive</span>
            </div>
          ) : null}
          {user?.user?.FatigCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Fatigue </span>
            </div>
          ) : null}
          {user?.user?.DriftCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Swerving </span>
            </div>
          ) : null}
          {user?.user?.TemprCount ? (
            <div
              className="popup__info__Role"
              style={{ backgroundColor: "#FBE9E9", color: "#DB2323" }}
            >
              <span>Tampering </span>
            </div>
          ) : null}
        </div>
        <div className="popup_data">
          {!mainDashboard && (
            <div className="popup__data__item">
              <PersonOutlineIcon
                style={{ fontSize: "30px", color: "#5E86ED" }}
              />
              <span>
                {" "}
                <span className="text-black-50">ID Number :</span>{" "}
                {user.user.idNumber}
              </span>
            </div>
          )}
          {!mainDashboard && (
            <div className="popup__data__item">
              <MailOutlineIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
              <span>
                {" "}
                <span className="text-black-50">Email :</span> {user.user.email}
              </span>
            </div>
          )}{" "}
          <div className="popup__data__item">
            <MapIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
            <span>
              {" "}
              <span className="text-black-50">Total Millage :</span>{" "}
              {user.data?.Mileage}
            </span>
          </div>
          {!mainDashboard && (
            <div className="popup__data__item">
              <Battery0BarIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
              <span>
                {" "}
                <span className="text-black-50">Battery :</span>
                Battery : {user.data?.IsPowerCutOff ? "OFF" : "ON"}
              </span>
            </div>
          )}
          <div className="popup__data__item">
            <SpeedIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
            <span>
              {" "}
              <span className="text-black-50"> Speed :</span>
              {user.data?.Speed}
            </span>
          </div>
          <div className="popup__data__item Adress">
            <FmdGoodOutlinedIcon
              style={{ fontSize: "30px", color: "#5E86ED" }}
            />
            <span>
              {" "}
              <span className="text-black-50"> Address :</span>{" "}
              {user.data?.Address}
            </span>
          </div>
        </div>
      </div>
    </Popup>
  );
});
export default ViolationsPopup;

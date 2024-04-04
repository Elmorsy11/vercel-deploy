import { Card } from "react-bootstrap";
import SkeletonLoader from "./skeleton-loader";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalUsersBox = ({ loading }) => {
  const series = [80];
  const series2 = [20];
  const usersNum = useSelector((state) => state.dashboard.TotalUsers);
  var options = {
    borderRadius: "10px",
    fill: {
      colors: ["#90D14F"],
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientfromColors: ["#0D6D67"],
        gradientToColors: ["#0D6D67"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    chart: {
      height: 100,
      width: 100,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        borderRadius: "10px",
        hollow: {
          size: "50%",
        },
        track: {
          show: true,
          startAngle: undefined,
          endAngle: undefined,
          background: "#D1E6D7",
          strokeWidth: "97%",
          opacity: 1,
          margin: 5,
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
          },
        },
      },
      dataLabels: {
        show: true,
        style: {
          colors: ["#000000"],
        },
        name: {
          show: false,
          fontSize: "16px",
          fontFamily: undefined,
          fontWeight: 600,
          color: undefined,
          offsetY: -10,
        },
        value: {
          show: false,
        },
      },
    },
    labels: [`${Math.round((usersNum?.online / (usersNum?.online + usersNum?.offline)) * 100) || 0}%`,],
  };
  var options2 = {
    borderRadius: "10px",
    fill: {
      colors: ["#FD0200"],
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientfromColors: ["#1E1E1E"],
        gradientToColors: ["#1E1E1E"],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    chart: {
      height: 100,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        borderRadius: "10px",
        hollow: {
          size: "50%",
        },
        track: {
          show: true,
          startAngle: undefined,
          endAngle: undefined,
          background: "#DDD6D5",
          strokeWidth: "97%",
          opacity: 1,
          margin: 5,
          dropShadow: {
            enabled: false,
            top: 0,
            left: 0,
            blur: 3,
            opacity: 0.5,
          },
        },
      },
      dataLabels: {
        show: true,
        style: {
          colors: ["#000000"],
        },
        name: {
          show: false,
          fontSize: "16px",
          fontFamily: undefined,
          fontWeight: 600,
          color: undefined,
          offsetY: -10,
        },
        value: {
          show: false,
        },
      },
    },
    labels: [`${Math.round((usersNum?.offline / (usersNum?.online + usersNum?.offline)) * 100) || 0}%`,],
  };
  return (
    <Card
      bg="light-blue"
      key={"Dark"}
      text={"Dark"}
      style={{
        background: "#EAEEF3",
        border: "none",
        height: "100%",
        overflow: "auto",
      }}
      className=" min-box"
    >
      <Card.Header>
        <h1
          className="total-number-title fw-bold mb-1 "
          style={{ fontSize: "15px", lineHeight: "0" }}
        >
          Total number of (DMD)
        </h1>
      </Card.Header>
      <Card.Body
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
        className="p-2"
      >
        {loading ? (
          <SkeletonLoader card />
        ) : usersNum
          == null ? <div className="warning-badReq w-100">
          <SkeletonLoader card />

        </div> : (
          <>
            <div
              className="d-flex align-items-center  justify-content-around "
              style={{ marginInlineEnd: "10px", width: "100%" }}
            >
              <div
                className="d-flex flex-column justify-content-between align-items-center"
                style={{ gap: "0px" }}
              >
                {/* Total Millage */}
                <div>
                  <a href={`/export/Millage`} target="_blank" style={{ color: "inherit" }}
                    className="d-flex flex-column justify-content-between align-items-center">
                    <h5 className=" text-capitalize" style={{ fontSize: "14px" }}>
                      Total Millage

                    </h5>
                    <span
                      className="min-box-count min-box-count-font "
                      style={{ fontSize: "13px" }}
                    >
                      {Math.round(usersNum?.mileage / 1000)}{" "}
                      <span style={{ fontSize: "13px" }}>Km</span>
                    </span>
                  </a>
                </div>

                {/* Total Users */}
                <div style={{ marginTop: "33px" }}>
                  <a href={`/export/Users`} target="_blank" style={{ color: "inherit" }}
                    className="d-flex flex-column justify-content-between align-items-center"
                  >
                    <h3 className=" text-capitalize" style={{ fontSize: "14px" }}>
                      Total users
                    </h3>
                    <span
                      className="min-box-count min-box-count-font "
                      style={{ fontSize: "13px", color: "black" }}
                    >
                      {usersNum?.offline + usersNum?.online}
                    </span>
                  </a>
                </div>
              </div>

              {/* Online & Offline Users */}
              <div className="d-flex   justify-content-between align-items-center gap-1">
                {/* Online Users */}
                <div>
                  <a href={`/export/online`} target="_blank" style={{ color: "inherit" }}
                    className="d-flex flex-column justify-content-between align-items-center"
                  >
                    <Chart
                      options={options}
                      series={series}
                      type="radialBar"
                      height={100}
                      width={100}
                    />
                    <h3
                      style={{
                        color: "#696A6F",
                        fontSize: "14px",
                        textAlign: "center",
                        marginTop: "",
                      }}
                    >
                      Online
                    </h3>
                    <p
                      style={{
                        color: "black",
                        fontSize: "13px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {usersNum?.online}
                    </p>
                  </a>
                </div>

                {/* Offline Users */}
                <div>
                  <a href={`/export/offline`} target="_blank" style={{ color: "inherit" }}
                    className="d-flex flex-column justify-content-between align-items-center">

                    <Chart
                      options={options2}
                      series={series2}
                      type="radialBar"
                      height={100}
                      width={100}
                    />
                    <h3
                      style={{
                        color: "#696A6F",
                        fontSize: "14px",
                        textAlign: "center",
                        marginTop: "",
                      }}
                    >
                      Offline{" "}
                    </h3>
                    <p
                      style={{
                        color: "black",
                        fontSize: "13px",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {usersNum?.offline}
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default TotalUsersBox;

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import Chart from "react-apexcharts";
/*___________ Components _____________*/
import Skeleton from "../../skeleton-loader";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ViolationsOverSpeed = ({ data, loading, height, name }) => {
  const series = [
    {
      name: "violations-over-speeding",
      data: data,
    },
  ];

  const categories = ["High - Risk", "Medium - Risk", "Low - Risk"];

  const options = {
    chart: {
      type: "bar",
      id: "violations-over-speeding",
    },
    xaxis: {
      categories: categories,
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: "#000",
      }, // Set the data labels to not be displayed
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        distributed: true,
        columnWidth: "25%",
        endingShape: "rounded",
        borderRadius: 4,
      },
    },
    fill: {
      colors: ["#FD0200", "#FFBF00", "#F8E118"],
      // type: "gradient",
      // gradient: {
      //   shade: "light",
      //   type: "vertical",
      //   shadeIntensity: 0.5,
      //   gradientfromColors: ["#FD0200", "#FEC005", "#90D14F"],
      //   gradientToColors: ["#1E1E1E", "#1E1E1E", "#1E1E1E"],
      //   inverseColors: false,
      //   opacityFrom: 1,
      //   opacityTo: 1,
      //   stops: [0, 100],
      // },
    },
  };

  return (
    <>
      <div
        className="card mb-0"
        style={{
          background: "#EAEEF3",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)",
          flex: "auto",
        }}
      >
        <div
          className="card-header d-flex justify-content-between flex-wrap"
        >
          <div className="">
            <h5
              className={"chart-header-title fw-bold text-black-50 mb-0 pb-0"}
              style={{ fontSize: "15px" }}
            >
              {`YTD- Violations ${name}`}
            </h5>
          </div>
        </div>

        <div
          style={{ direction: "ltr", flex: "auto", padding: "1rem" }}
          className="card-body"
        >
          {loading ? (
            <Skeleton chart />
          ) : (
            <Chart
              className="d-activity"
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViolationsOverSpeed;

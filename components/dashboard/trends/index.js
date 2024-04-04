import SkeletonLoader from "components/skeleton-loader";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const WeeklyTrends = ({ loading, categories, data, total }) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries(
      data?.map((po) => {
        const points = po?.data?.map((p) => (p / 2.5).toFixed(1));
        return {
          ...po,
          data: points,
        };
      })
    );
  }, [total, data]);

  // const series = useMemo(() => {
  //   data?.map((po) => {
  //     const points = po?.data?.map((p) => ((7.5 * p) / total).toFixed(1));
  //     return {
  //       ...po,
  //       data: points,
  //     };
  //   });
  // }, []);

  // const options = {
  //   chart: {
  //     type: "line",
  //     animations: {
  //       speed: 200,
  //     },
  //   },
  //   colors: [
  //     "#008FFB",
  //     "#00E396",
  //     "#FEB019",
  //     "#FF4560",
  //     "#775DD0",
  //     "#546E7A",
  //     "#66B9DC",
  //     "#D10CE8",
  //   ],

  //   dataLabels: {
  //     enabled: true,
  //   },
  //   // stroke: {
  //   //   curve: "smooth",
  //   // },
  //   title: {
  //     text: "Weekly Trends  ",
  //     align: "left",
  //   },
  //   annotations: {
  //     yaxis: [
  //       {
  //         y: 2 * (total / 3).toFixed(0),
  //         y2: total,
  //         borderColor: "#000",
  //         fillColor: "#CA0000",
  //         opacity: 0.2,
  //         label: {
  //           borderColor: "#333",
  //           style: {
  //             fontSize: "10px",
  //             color: "#333",
  //             background: "#FEB019",
  //           },
  //         },
  //       },
  //       {
  //         y: (total / 3).toFixed(0),
  //         y2: 2 * (total / 3).toFixed(0),
  //         borderColor: "#000",
  //         fillColor: "#cfa52599",
  //         opacity: 0.2,
  //         label: {
  //           borderColor: "#333",
  //           style: {
  //             fontSize: "10px",
  //             color: "#333",
  //             background: "#FEB019",
  //           },
  //         },
  //       },
  //       {
  //         y: 0,
  //         y2: (total / 3).toFixed(0),
  //         borderColor: "#000",
  //         fillColor: "#4d9f15cc",
  //         opacity: 0.2,
  //         label: {
  //           borderColor: "#4d9f15cc",
  //           style: {
  //             fontSize: "10px",
  //             color: "#4d9f15cc",
  //             background: "#FEB019",
  //           },
  //         },
  //       },
  //     ],
  //   },
  // };

  const options = {
    chart: {
      type: "line",
      animations: {
        speed: 200,
      },
    },

    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#546E7A",
      "#66B9DC",
      "#D10CE8",
    ],
    dataLabels: {
      enabled: true,
    },

    // stroke: {
    //   curve: "smooth",
    // },
    title: {
      text: "Weekly Trends  ",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#CA0000", "#FEB019", "#4d9f15cc"], // takes an array which will be repeated on columns
        opacity: 0.27,
      },
    },
    markers: {
      size: 1,
    },
    annotations: {
      yaxis: [
        {
          y: 2 * (total / 2.5).toFixed(0),
          y2: total,
          borderColor: "#000",
          fillColor: "#CA0000",
          opacity: 0.2,
          label: {
            borderColor: "#333",
            style: {
              fontSize: "10px",
              color: "#333",
              background: "#FEB019",
            },
          },
        },
        {
          y: (total / 2.5).toFixed(0),
          y2: 2 * (total / 2.5).toFixed(0),
          borderColor: "#000",
          fillColor: "#cfa52599",
          opacity: 0.2,
          label: {
            borderColor: "#333",
            style: {
              fontSize: "10px",
              color: "#333",
              background: "#FEB019",
            },
          },
        },
        {
          y: 0,
          y2: (total / 2.5).toFixed(0),
          borderColor: "#000",
          fillColor: "#4d9f15cc",
          opacity: 0.2,
          label: {
            borderColor: "#4d9f15cc",
            style: {
              fontSize: "10px",
              color: "#4d9f15cc",
              background: "#FEB019",
            },
          },
        },
      ],
    },

    xaxis: {
      categories: categories,
      title: {
        text: "Weeks",
        offsetY: 95,
      },
    },
    // yaxis: {
    //   title: {
    //     text: "Violations",
    //   },
    //   min: 0,
    //   max: 35,
    // },
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="" style={{ marginTop: "55px" }}>
          <div
            style={{
              backgroundColor: "#CA0000",
              color: "white",
              padding: "10px 12px",
              textAlign: "center",
              borderRadius: "8px",
              marginBottom: "2px",
            }}
          >
            H
          </div>
          <div
            style={{
              backgroundColor: "#CFA525",
              color: "black",
              padding: "10px 12px",
              borderRadius: "8px",
              margin: "10px 0",
            }}
          >
            M
          </div>
          <div
            style={{
              backgroundColor: "#4D9F15",
              color: "white",
              padding: "10px 12px",
              borderRadius: "8px",
            }}
          >
            L
          </div>
        </div>
        <div id="chart" className=" ms-2 " style={{ width: "100%" }}>
          {loading ? (
            <SkeletonLoader chart height={270} />
          ) : (
            <div className="" style={{ position: "relative" }}>
              <Chart
                width={"100%"}
                options={options}
                series={series}
                type="line"
                height={270}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WeeklyTrends;

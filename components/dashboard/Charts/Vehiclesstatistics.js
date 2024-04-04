import React from "react";
import dynamic from "next/dynamic";
import { Card, Col } from "react-bootstrap";
import Pageloading from "../../Pageloading";
import { useTranslation } from "next-i18next";
// import { useTranslation } from 'next-i18next';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Vehiclesstatistics({ data, loading }) {
  const { t } = useTranslation("dashboard");
  let vhiclesCount = data?.allVehiclesCount  || 0;
  let runningVhiclesCount = data?.runningVehiclesCount || 0;
  let readyVhiclesCount = data?.availableVehiclesCount || 0;


  const chart = {
    series: [runningVhiclesCount, readyVhiclesCount],
    options: {
      chart: {
        type: "donut",
        redrawOnParentResize: true,
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 360,
          track: {
            show: true,
            startAngle: undefined,
            endAngle: undefined,
            background: "#fdfdfd",
            strokeWidth: "97%",
            opacity: 0.2,
            margin: 5,
            dropShadow: {
              enabled: false,
            },
          },

          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            colors: ["#585858"],
            name: {
              show: false,
            },
            value: {
              fontSize: "1.5rem",
              show: true,
              offsetY: 9,
              color: "#585858",
            },
          },
        },
      },
      colors: ["#076F73", "#3DAAB0", "#F16C20"],
      labels: ["Running", "Ready"],
      legend: {
        show: true,
        floating: false,
        fontSize: "13rem",
        position: "right",
        labels: {
          useSeriesColors: false,
          colors: ["#203039"],
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        markers: {
          size: 0,
        },
        itemMargin: {
          vertical: 5,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <>
      <Col md="6">
        <Card style={{ height: "calc(100% - 2rem)" }}>
          <Card.Body>
            <h4 className="text-secondary mb-3 fw-normal">
              {t("Vehicles statistics")}
            </h4>

            {loading ? (
              <Pageloading />
            ) : (
              <Chart
                //  series: [3000, 1484, 1316, 16],
                options={chart.options}
                series={chart.series}
                type="donut"
                height={300}
              />
            )}
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

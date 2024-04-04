import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

function DoughnutChart({
  total = 3,
  value = 0,
  style,
  greenColor,
  trainee,
  totalViolation,
}) {
  //
  const data = {
    labels: trainee ? ["Safe", "Low", "Mid", "High"] : ["Safe", "Mid", "High"],
    datasets: [
      {
        data: trainee
          ? [200 / 4, 200 / 4, 200 / 4, 200 / 4]
          : totalViolation
            ? [100]
            : [3 / 3, 3 / 3, 3 / 3],
        backgroundColor: trainee
          ? ["#4D9F15", "#F8E118", "#FEC005", "#dc3545"]
          : totalViolation
            ? value <= 25
              ? ["#4D9F15"]
              : value <= 50
                ? ["#F8E118"]
                : value <= 75
                  ? ["#FEC005"]
                  : ["#dc3545"]
            : ["#4D9F15", "#FEC005", "#dc3545"],
        borderWidth: 1,
        needleValue:
          trainee || totalViolation
            ? value
            : !value
              ? 0
              : (value / 2.5).toFixed(2),
        // ? Math.floor(((100 * value) / total).toFixed(1))
        // : ((5 * value) / total).toFixed(1),
      },
    ],
  };
  const options = {
    circumference: 180,
    rotation: 270,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const gugeNeedle = {
    id: "gugeNeedle",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const { ctx, data } = chart;

      chart.tooltip = null;

      ctx.save();
      const needleValue =
        data.datasets[0].needleValue > 200 ? 200 : data.datasets[0].needleValue;

      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;
      const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
      const angle = Math.PI;
      const tempValue = value > 100 ? 100 : value;
      const traineeValue = value > 200 ? 200 : value;
      const mainValue = (value / 2.5).toFixed(1) > 3 ? 3 : (value / 2.5).toFixed(1);

      const dataTotal = data.datasets[0].data.reduce((a, b) => a + b, 0);

      let circumfernce =
        (chart.getDatasetMeta(0).data[0].circumference /
          Math.PI /
          data.datasets[0].data[0]) *
        (trainee
          ? Math.floor(((200 * traineeValue) / total).toFixed(1))
          : totalViolation
            ? tempValue
            : !value
              ? 0
              : mainValue);

      const needleValueAngle = circumfernce + 1.5;

      ctx.translate(xCenter, yCenter);
      ctx.rotate(angle * needleValueAngle);
      ctx.translate(-xCenter, -yCenter);

      // Needle
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.moveTo(xCenter, outerRadius);
      ctx.lineTo(xCenter, yCenter - outerRadius);
      ctx.stroke();

      ctx.restore();
    },
  };

  const gugeText = {
    id: "gugeText",
    afterDatasetsDraw(chart, args, pluginOptions) {
      const {
        ctx,
        chartArea: { top, bottom, left, right, width, height },
        data,
      } = chart;

      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;

      const needleValue = data.datasets[0].needleValue;

      ctx.save();
      ctx.fillStyle = "black";
      ctx.font = "bold 1rem sans-serif";
      ctx.textAlign = "center";
      // if (!greenColor) {
      ctx.fillText(`${needleValue}`, xCenter, yCenter - 10);
      // }
    },
  };

  const gugeLables = {
    id: "gugeLables",
    beforeDatasetsDraw(chart, args, pluginOptions) {
      const { ctx } = chart;

      ctx.save();

      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;
      const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;

      ctx.font = "bold 1rem sans-serif";
      ctx.fillStyle = "black";
      ctx.textBaseline = "top";
      if (!greenColor) {
        ctx.fillText("0", (xCenter - innerRadius) / 2, yCenter + 10);
        ctx.fillText(
          trainee ? 200 : totalViolation ? 100 : 3,
          xCenter * 2 - innerRadius / 2,
          yCenter + 10
        );
      }
    },
  };

  return (
    <>
      {style ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "130px",
          }}
        // className={style ? "chartParent" : ""}
        >
          <Doughnut
            data={data}
            options={options}
            plugins={[gugeNeedle, gugeText, gugeLables]}
          />
        </div>
      ) : (
        <div
          style={{
            width: "130px",
          }}
        >
          <Doughnut
            data={data}
            options={options}
            plugins={[gugeNeedle, gugeText, gugeLables]}
          />
        </div>
      )}
    </>
  );
}

export default DoughnutChart;

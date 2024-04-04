import { Skeleton } from "@mui/material";

const NotificationCircle = ({ data }) => {
  const HandlingColor = (value) => {
    const total = data?.online + data?.offline;
    if ((value / total) * 180 < 60) return "#90D14F";
    if ((value / total) * 180 > 60 && (value / total) * 180 < 120) {
      return "#ECBD2E";
    }
    if ((value / total) * 180 > 120) return "#FD0200";
  };
  const vaiolations = [
    {
      id: 1,
      title: "O.S",
      value: data?.overSpeed || 0,
      backgroundColor: HandlingColor(data?.overSpeed || 0),
    },
    {
      id: 2,
      title: "H.B",
      value: data?.harshBrake || 0,
      backgroundColor: HandlingColor(data?.harshBrake || 0),
    },
    {
      id: 3,
      title: "H.A",
      value: data?.harshAcceleration || 0,
      backgroundColor: HandlingColor(data?.harshAcceleration || 0),
    },
    {
      id: 4,
      title: "S.B",
      value: data?.seatBelt || 0,
      backgroundColor: HandlingColor(data?.seatBelt || 0),
    },
    {
      id: 5,
      title: "N.D",
      value: data?.nightDrive || 0,
      backgroundColor: HandlingColor(data?.nightDrive || 0),
    },
    {
      id: 6,
      title: "L.D",
      value: data?.longDistance || 0,
      backgroundColor: HandlingColor(data?.longDistance || 0),
    },
    {
      id: 7,
      title: "F",
      value: data?.fatigue || 0,
      backgroundColor: HandlingColor(data?.fatigue || 0),
    },
    {
      id: 8,
      title: "S.T",
      count: data?.sharpTurns || 0,
      backgroundColor: HandlingColor(data?.sharpTurns || 0),
    },
  ];

  return (
    <>
      {vaiolations.map((el) => {
        return (
          <div className="d-flex flex-column align-items-center">
            <Skeleton
              animation="pulse"
              variant="circular"
              width={25}
              height={25}
              style={{ backgroundColor: el.backgroundColor }}
            />
            <span className="fs-6">{el.title}</span>
          </div>
        );
      })}
    </>
  );
};

export default NotificationCircle;

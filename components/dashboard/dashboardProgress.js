import React from "react";
import { CountUp } from "use-count-up";
import { Card, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
const DashboardProgress = ({
  loading,
  name = "one",
  countStart = 0,
  countEnd = 0,
  duration = 2,
  iconPath,
  color,

}) => {
  const { darkMode } = useSelector((state) => state.config);
  const { t } = useTranslation("dashboard")

  return (
    <>

      <Col lg="6">
        <Card className={`bg-soft-${color}`}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div className={`bg-soft-${color} rounded p-1 d-flex align-items-center justify-content-center`} style={{ width: "60px", height: "60px" }}>
                <svg width="36px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" >
                  <path fill={darkMode ? "white" : "currentColor"} d={iconPath} />
                </svg>
              </div>
              <div className="text-end">
                <h2 className={darkMode ? "text-white" : `counter text-${color}`}>
                  {/* {countEnd} */}
                  {!loading ? (
                    <CountUp
                      isCounting
                      start={countStart}
                      end={countEnd}
                      duration={duration}
                    />
                  ) : (0)}
                </h2>
                <span className={darkMode ? "text-white" : ""}>{t(`${name}`)}</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

    </>
  );
};
export default DashboardProgress;

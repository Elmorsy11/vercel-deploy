import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";

/*___________ Components _____________*/
import { Col, Row } from "react-bootstrap";
import ViolationsOverSpeed from "components/dashboard/Charts/ViolationsOverSpeed";
import LargeBox from "components/LargeBox";
import MinBox from "components/MinBox";

/*___________ Images _____________*/
import Totalviolation from "public/assets/Graph lines (1).svg";
import online from "public/assets/carbon_user-online.svg";
import offline from "public/assets/carbon_user-online (1).svg";
import grapgline from "public/assets/Graph lines.svg";

/*___________ Icons _____________*/
import totalMillage from "public/assets/newIcons/Distance.svg";
import Harshacceleration from "public/assets/newIcons/Layer_x0020_1.svg";
import overspeeding from "public/assets/newIcons/high-speed 1.svg";
import Harshbrake from "public/assets/newIcons/029---Accelerate.svg";
import Seatbelt from "public/assets/newIcons/seatbelt 1.svg";
import NightDriving from "public/assets/newIcons/car 1.svg";

/*___________ Actions _____________*/
import { custodyStatistics } from "../../../lib/slices/custodies";

const CustodyDetailsData = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState([0]);

  // Select custody Data
  const custodyData = useSelector(
    (state) => state.custodies.custodyStatistics?.data?.totalViolation
  );

  // Select custody Data Load state to handle loading
  const custodyDataLoading = useSelector(
    (state) => state.custodies.custodyLoading
  );

  // Data to send
  const custodyId = router?.query?.custodyId;

  useEffect(() => {
    dispatch(custodyStatistics(custodyId));
  }, [custodyId]);

  useEffect(() => {
    if (custodyData) {
      const high = custodyData?.highSpeed;
      const medium = custodyData?.mediumSpeed;
      const low = custodyData?.lowSpeed;
      setSeriesData([high, medium, low]);
    }
  }, [custodyData]);

  // Boxes Data
  const firstSectionBoxs = [
    {
      id: 1,
      title: "Total",
      count: custodyData?.online + custodyData?.offline,
      imgSrc: grapgline,
      backgroundColor: "#DBE3ED",
      iconWidth: 136,
      iconHieght: 60,
    },
    {
      id: 2,
      title: "Millage",
      count: Math.floor(custodyData?.Mileage / 1000).toLocaleString(),
      imgSrc: totalMillage,
      backgroundColor: "#DBE3ED",
    },
    {
      id: 3,
      title: "online",
      count: custodyData?.online,
      imgSrc: online,
      backgroundColor: "#DBE3ED",
    },
    {
      id: 4,
      title: "Offline",
      count: custodyData?.offline,
      imgSrc: offline,
      backgroundColor: "#DBE3ED",
    },
  ];

  // Boxes Data
  const secondSectionBoxs = [
    {
      id: 1,
      title: "Over Speeding",
      count: custodyData?.OverSpeed?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },
    {
      id: 2,
      title: "Harsh Brake",
      count: custodyData?.harshBrake?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },
    {
      id: 3,
      title: "High Acceleration",
      count: custodyData?.harshAcceleration?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },
    {
      id: 4,
      title: "Seatbelt",
      count: custodyData?.SeatBelt?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },
    {
      id: 5,
      title: "Night Driving",
      count: custodyData?.nightDrive?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },
    {
      id: 6,
      title: "Tampering",
      count: custodyData?.longDistance?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },

    {
      id: 7,
      title: "Fatigue (Long Distance)",
      count: custodyData?.fatigue?.toLocaleString(),
      backgroundColor: "#DBE3ED",
    },

    {
      id: 8,
      title: "Sharp Turns",
      count: custodyData?.sharpTurns?.toLocaleString() || 0,
      backgroundColor: "#DBE3ED",
    },
  ];

  return (
    <div
      className="p-2"
      style={{
        marginTop: "60px",
      }}
    >
      <section className="d-flex  px-4 mb-5 ">
        <span className="header-text me-2">Department</span>
        <span className="fw-bold text-black ">/ Department Details</span>
      </section>

      <section className="px-4">
        <h1 className="total-number-title fw-bold">Total number of (DMD)</h1>
        <Row className="pt-2">
          {firstSectionBoxs.map((box) => (
            <Col xl={3} lg={6} md={6} sm={12} key={box.id}>
              <MinBox
                title={box.title}
                count={box.count}
                imgSrc={box.imgSrc}
                backgroundColor={box.backgroundColor}
                iconWidth
                iconHieght
                loading={custodyDataLoading}
              />
            </Col>
          ))}
        </Row>
      </section>

      <section>
        <h1 className="px-4 my-4 total-number-title fw-bold">Violations</h1>
        <div className="row">
          <div className="col-lg-7 col-12">
            <Row
              className="px-4 py-2 ms-2 mt-2"
              style={{
                background: "#DBE3ED",
                borderRadius: "16px",
              }}
            >
              {secondSectionBoxs.map((box) => (
                <Col
                  xl={3}
                  lg={4}
                  md={6}
                  sm={12}
                  className="mb-4 "
                  key={box.id + box.title}
                >
                  <LargeBox
                    title={box.title}
                    count={box.count}
                    imgSrc={box.imgSrc}
                    Total={custodyData?.online + custodyData?.offline}
                    backgroundColor={box.backgroundColor}
                    iconWidth
                    iconHieght
                    loading={custodyDataLoading}
                  />
                </Col>
              ))}
            </Row>
          </div>
          <div className="col-lg-5 col-md-12">
            <div
              className="mt-2 rounded"
              style={{
                background: "#DFEDEC",
              }}
            >
              <ViolationsOverSpeed
                loading={custodyDataLoading}
                height={610}
                data={seriesData}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustodyDetailsData;

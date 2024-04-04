import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
/*___________ Components _____________*/
import ViolationsOverSpeed from "components/dashboard/Charts/ViolationsOverSpeed";
import { Col, Row } from "react-bootstrap";
import LargeBox from "components/LargeBox";

/*___________ Images _____________*/
import TotalviolatIonImage from "public/assets/Graph lines (1).svg";
/*___________ Icons _____________*/
import HarshaccelerationIonImage from "public/assets/newIcons/Layer_x0020_1.svg";
import HarshbrakeIonImage from "public/assets/newIcons/029---Accelerate.svg";
import overspeedingIonImage from "public/assets/newIcons/high-speed 1.svg";
import SeatbeltIonImage from "public/assets/newIcons/seatbelt 1.svg";
import NightDrivingIonImage from "public/assets/newIcons/car 1.svg";
/*___________ Functions _____________*/
import {
  convertJsonToExcel,
  handlingRowDataColumn,
} from "../../helpers/helpers";

import SelectTheArea from "components/selectTheArea";
import {
  TotalUsers,
  changeItdItc,
  dashboardInfo,
  topDrivers,
  violationsReport,
  weeklyTrendsChart,
} from "lib/slices/dashboardSlice";
import { allTrainees } from "lib/slices/custodies";
import moment from "moment";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";

function DashboardViolations({ selectedLabel, setSelectedLabel }) {
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState([0]);
  const [violationName, setViolationName] = useState("Over Speeding");
  const [itd, setItd] = useState([]);
  // Selecting Data
  const violationsData = useSelector((state) => state.dashboard.dashboardInfo);
  // Selecting Loader to handle loading
  const violationsLoading = useSelector(
    (state) => state.dashboard.dashboardInfoLoading
  );
  const usersLoading = useSelector(
    (state) => state.dashboard.TotalUsersLoading
  );
  // violations sheets
  const { sheets } = useSelector((state) => state.dashboardSheets)
  const dashboardData = useSelector((state) => state.dashboard);
  useEffect(() => {
    if (violationsData) {
      const high = violationsData?.ranges?.overSpeed.high;
      const medium = violationsData?.ranges?.overSpeed.medium;
      const low = violationsData?.ranges?.overSpeed.low;

      setSeriesData([high, medium, low]);
    }
  }, [violationsData]);

  useEffect(() => {
    let tempITD = [];
    // if (dashboardData.label === "All ITD") {
    dashboardData.divisonData.map((item) => {
      tempITD.push(item.label);
    });
    setItd(tempITD);
    // }
    const tempItc = [];
    dashboardData.divisonData?.forEach((element) => {
      if (element.children) {
        element.children.forEach((item) => {
          tempItc.push(item.label);
        });
      }
    });
  }, [dashboardData.label, dashboardData.divisonData]);


  function onViolationCLick(name, rangeName) {
    setViolationName(name);
    setSeriesData([
      violationsData?.ranges[rangeName]?.high,
      violationsData?.ranges[rangeName]?.medium,
      violationsData?.ranges[rangeName]?.low,
    ]);
  }

  const exportExcelSheet = (fileName, fileData) => {
    convertJsonToExcel(handlingRowDataColumn(fileData), fileName);
  };

  // Boxes Data
  const secondSectionBoxs = [
    {
      id: 1,
      title: "Over Speeding",
      rangeName: "overSpeed",
      count: violationsData?.overSpeedScore || 0,
      imgSrc: TotalviolatIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("OverSpeeding", sheets?.overSpeed),
    },
    {
      id: 2,
      title: "Harsh Brake",
      rangeName: "harshBrake",
      count: violationsData?.harshBrakeScore || 0,
      imgSrc: HarshaccelerationIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("Harsh Brake", sheets?.harshBrake),
    },
    {
      id: 3,
      title: "High Acceleration",
      rangeName: "harshAcceleration",
      count: violationsData?.harshAccelerationScore || 0,
      imgSrc: overspeedingIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("High Acceleration", sheets?.harshAcceleration),
    },
    {
      id: 4,
      title: "Seatbelt",
      count: violationsData?.seatBeltScore || 0,
      rangeName: "seatBelt",
      imgSrc: HarshbrakeIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("Seatbelt", sheets?.seatBelt),
    },
    {
      id: 5,
      title: "Night Driving",
      count: violationsData?.nightDriveScore || 0,
      rangeName: "nightDrive",
      imgSrc: SeatbeltIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("Night Driving", sheets?.nightDrive),
    },
    {
      id: 6,
      title: "Tampering",
      count: violationsData?.tamperingScore || 0,
      rangeName: "tampering",
      imgSrc: NightDrivingIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("Tampering", sheets?.tampering),
    },
    {
      id: 7,
      title: "Fatigue (Long Distance)",
      count: violationsData?.fatigueScore || 0,
      rangeName: "fatigue",
      imgSrc: NightDrivingIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("Fatigue", sheets?.fatigue),
    },
    {
      id: 8,
      title: "Swerving (Drift)",
      count: violationsData?.swervingScore || 0,
      rangeName: "swerving",
      imgSrc: NightDrivingIonImage,
      backgroundColor: "#DBE3ED",
      excelSheet: () => exportExcelSheet("swerving", sheets?.swerving),
    },
  ];

  const [allItd, setAllItd] = useState([]);
  const { filteredDate, isFilteredDateChanged } = useSelector((state) => state.filterMaindashboard)

  useEffect(() => {
    let tempITD = [];

    dashboardData.divisonData.map((item) => {
      tempITD.push({ value: item.value, title: item.label });
    });
    setAllItd(tempITD);
  }, [dashboardData.label]);
  // all itd card 
  const violationBox = () => {
    if (!selectedLabel) {
      if (dashboardData.label === "All ITD") {
        return allItd.map((box) => {
          return (
            <Col
              xxl={3}
              xl={4}
              lg={6}
              md={6}
              sm={12}
              className="mb-4"
              key={box.value}
              onClick={() => {
                const payloadData = {
                  itd: box.value,
                  startDate: isFilteredDateChanged ? moment(filteredDate[0].startDate).format("YYYY-MM-DDTHH:mm:ss") : null,
                  endDate: isFilteredDateChanged ? moment(filteredDate[0].endDate).format("YYYY-MM-DDTHH:mm:ss") : null,
                }
                localStorage.setItem("Itd", JSON.stringify(box))
                dispatch(violationsReport(payloadData))
                dispatch(dashboardInfo(payloadData));
                dispatch(TotalUsers(payloadData));
                dispatch(topDrivers(payloadData));
                dispatch(weeklyTrendsChart(payloadData));
                dispatch(allTrainees(payloadData))
                dispatch(cancelledViolations(payloadData))
                dispatch(changeItdItc({ itd: box.value, label: box.title, itc: "null" }));
              }
              }
            >
              <SelectTheArea
                title={box.title}
                setSelectedLabel={setSelectedLabel}
                backgroundColor={"#DBE3ED"}
                label={box.title}
                itdID={box.value}
                iconWidth
                iconHieght
                loading={violationsLoading}
                excelSheet={box.excelSheet}
              // isDateNotFiltered={isDateNotFiltered}
              />
            </Col >
          );
        });
      } else {
        return secondSectionBoxs.map((box) => (
          <Col
            xxl={3}
            xl={4}
            lg={6}
            md={6}
            sm={12}
            className="mb-4"
            key={box.id}
          >
            <LargeBox
              click={() => onViolationCLick(box.title, box.rangeName)}
              key={box.id}
              title={box.title}
              count={box.count}
              backgroundColor={box.backgroundColor}
              iconWidth
              iconHieght
              loading={violationsLoading}
              excelSheet={box.excelSheet}
            />
          </Col>
        ));
      }
    } else {
      if (itd.includes(selectedLabel)) {
        let itc = dashboardData.divisonData.filter(
          (item) => item.label === selectedLabel
        )[0]?.children;

        return itc?.map((box) => (
          <Col
            xxl={3}
            xl={4}
            lg={6}
            md={6}
            sm={12}
            className="mb-4"
            key={box.label}
            onClick={() => {
              dispatch(topDrivers({ itc: box?.value }));
            }}
          >
            <SelectTheArea
              key={box.label}
              title={box.label}
              itcID={box.value}
              backgroundColor={"#DBE3ED"}
              setSelectedLabel={setSelectedLabel}
              label={box.label}
              iconWidth
              iconHieght
              loading={violationsLoading || usersLoading}
              excelSheet={box.excelSheet}
            />
          </Col>
        ));
      } else {
        return secondSectionBoxs.map((box) => (
          <Col
            xxl={3}
            xl={4}
            lg={6}
            md={6}
            sm={12}
            className="mb-4"
            key={box.id}
          >
            <LargeBox
              click={() => onViolationCLick(box.title, box.rangeName)}
              key={box.id}
              title={box.title}
              count={box.count}
              backgroundColor={box.backgroundColor}
              iconWidth
              iconHieght
              loading={violationsLoading}
              excelSheet={box.excelSheet}
            />
          </Col>
        ));
      }
    }
  };

  return (
    <section className="px-4 mt-4 ">
      <Row>
        <Col
          sm={12}
          lg={8}
          style={{
            // background: "#fff",
            borderRadius: "16px",
            padding: " 0px 20px 0",
          }}
        >
          <Row>{violationBox()}</Row>
        </Col>

        <Col sm={12} lg={4} className="d-flex flex-column" style={{ marginBottom: "20px" }}>
          <ViolationsOverSpeed
            name={violationName}
            loading={violationsLoading}
            height={400}
            data={seriesData}
          />
        </Col>
      </Row>
    </section>
  );
}

export default DashboardViolations;

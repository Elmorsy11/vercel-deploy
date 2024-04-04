import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import iconGift from "/public/gift 1.svg";
import ArrowIcon from "/public/arrow-up.svg";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { SlCalender } from "react-icons/sl";
/*___________ Components _____________*/
// import ViolationsOverSpeed from "components/dashboard/Charts/ViolationsOverSpeed";
import SkeletonLoader from "components/skeleton-loader";
import LargeBox from "components/LargeBox";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";

/*___________ Images _____________*/
import userProfile from "public/assets/images/profile.jpg";

/*___________ Actions _____________*/
import { custodyTranieeStatistcs } from "../../../lib/slices/custodies";
import Markers from "components/dashboard/Markers";
import {
  convertJsonToExcel,
  fetchAllIncentiveHistory,
  handlingRowDataColumn,
} from "helpers/helpers";
import { DateRangePicker } from "react-date-range";
import moment from "moment";
import { MdKeyboardArrowDown, MdOutlineFilterAlt } from "react-icons/md";
import DoughnutChart from "components/dashboard/Charts/DoughnutChart";
import IncentiveHistory from "./IncentiveHistory";
import { useSession } from "next-auth/client";
import AddPointsForm from "./AddPointsForm";
import ModifyLvlForm from "./ModifyLvlForm";
import TraineeModal from "./TraineeModal";
import Link from "next/link";
import { TbFilterCancel } from "react-icons/tb";
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);

const TraineeDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const position = [25.278229, 48.488376];
  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  // Select custody Traniee Data
  const tranieeInfo = useSelector(
    (state) => state.custodies.custodyTranieeStatistcs?.data?.users[0]
  );
  // Select custody Traniee Data
  const departmentName = useSelector(
    (state) => state.custodies.custodyTranieeStatistcs?.data?.custodyName
  );
  const itdName = useSelector(
    (state) => state.custodies.custodyTranieeStatistcs?.data?.itdName
  );

  // Select Traniee Millge
  const tranieeMillge = useSelector(
    (state) =>
      state.custodies.custodyTranieeStatistcs?.data?.totalViolations
        ?.incentivePoints
  );
  // Select custody Traniee Data
  const tranieeData = useSelector(
    (state) => state.custodies.custodyTranieeStatistcs?.data?.totalViolations
  );

  const tranieeforImage = useSelector(
    (state) => state.custodies.custodyTranieeStatistcs?.data
  );
  // Select custody Traniee Data Load state to handle loading
  const custodyTranieeLoading = useSelector(
    (state) => state.custodies.custodyTranieeLoading
  );

  const traineeID = router?.query?.traineeId;
  const session = useSession();
  const token = session[0]?.user.token;

  const [changed, setChanged] = useState(false);
  const [showPicker, setShowPicker] = useState();

  // Show and close addPoints and ModifyLvl Modals
  const [showAddPointsModal, setShowAddPointsModal] = useState(false);
  const handleCloseAddPointsModal = () => setShowAddPointsModal(false);
  const handleShowAddPointsModal = () => setShowAddPointsModal(true);
  const [showModifyLvlModal, setShowModifyLvlModal] = useState(false);
  const handleCloseModifyLvlModal = () => setShowModifyLvlModal(false);
  const handleShowModifyLvlModal = () => setShowModifyLvlModal(true);

  // showing history table
  const [showInsentiveHistoryTable, setShowInsentiveHistoryTable] =
    useState(false);

  useEffect(() => {
    dispatch(custodyTranieeStatistcs({ traineeID }));
  }, []);

  const [date, setDate] = useState([
    {
      startDate: moment().subtract(24, "hours").toDate(),
      endDate: moment().toDate(),
      key: "dashboardInfo",
    },
  ]);
  const handelDateChange = (item) => {
    setDate([{ ...item.dashboardInfo }]);
  };
  const handleClearSearch = () => {
    setChanged(false);
    setShowInsentiveHistoryTable(false)
    setDate([
      {
        startDate: moment().subtract(24, "hours").toDate(),
        endDate: moment().toDate(),
        key: "dashboardInfo",
      },
    ]);
    setShowPicker(false);
    dispatch(
      custodyTranieeStatistcs({
        traineeID: traineeID
      })
    );
  };

  const firstSectionBoxs = {
    id: 1,
    title: "Total Millage",
    count: tranieeMillge || 0,
    backgroundColor: "#DBE3ED",
    bottomTitle: "KM",
  };

  const exportExcelSheet = (fileName, fileData) => {
    convertJsonToExcel(handlingRowDataColumn(fileData), fileName);
  };
  const secondSectionBoxs = [
    {
      id: 1,
      title: "Over Speeding",
      count: tranieeData?.overSpeed || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Over Speeding", tranieeData?.sheets?.overSpeed),
    },
    {
      id: 2,
      title: "Harsh Brake",
      count: tranieeData?.harshBrake || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Harsh Brake", tranieeData?.sheets?.harshBrake),
    },
    {
      id: 3,
      title: "High Acceleration",
      count: tranieeData?.harshAcceleration || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet(
          "High Acceleration",
          tranieeData?.sheets?.harshAcceleration
        ),
    },
    {
      id: 4,
      title: "Seatbelt",
      count: tranieeData?.seatBelt || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Seatbelt", tranieeData?.sheets?.seatBelt),
    },
    {
      id: 5,
      title: "Night Driving",
      count: tranieeData?.nightDrive || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Night Driving", tranieeData?.sheets?.nightDrive),
    },
    {
      id: 6,
      title: "Tampering",
      count: tranieeData?.tampering || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Tampering", tranieeData?.sheets?.tampering),
    },
    {
      id: 7,
      title: "Fatigue (Long Distance)",
      count: tranieeData?.fatigue || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Fatigue", tranieeData?.sheets?.fatigue),
    },

    {
      id: 8,
      title: "Swerving",
      count: tranieeData?.swerving || 0,
      backgroundColor: "#DBE3ED",
      excelSheet: () =>
        exportExcelSheet("Sharp Turns", tranieeData?.sheets?.swerving),
    },
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};

    data.startDate = moment(date[0].startDate).format("YYYY-MM-DDTHH:mm:ss");
    data.endDate = moment(date[0].endDate).format("YYYY-MM-DDTHH:mm:ss");

    setShowPicker(false);

    dispatch(
      custodyTranieeStatistcs({
        traineeID: traineeID,
        startDate: data.startDate,
        endDate: data.endDate,
      })
    );
    setChanged(true);
  };
  const [insentiveHistoryData, setInsentiveHistoryData] = useState([]);
  const [insentiveLoading, setInsentiveLoading] = useState(false);

  const incentiveHistoryHandler = async () => {
    fetchAllIncentiveHistory(
      traineeID,
      token,
      setInsentiveHistoryData,
      setInsentiveLoading
    );
    setShowInsentiveHistoryTable(true);
  };
  return (
    <div
      className="px-4 py-2 row trainee-details"
      style={{
        marginTop: "60px",
      }}
    >
      {showAddPointsModal && (
        <TraineeModal
          handleClose={handleCloseAddPointsModal}
          handleShow={showAddPointsModal}
          title="Add Your Points"
        >
          <AddPointsForm
            showInsentiveHistoryTable={showInsentiveHistoryTable}
            handleClose={handleCloseAddPointsModal}
            setInsentiveHistoryData={setInsentiveHistoryData}
            setInsentiveLoading={setInsentiveLoading}
          />
        </TraineeModal>
      )}

      {showModifyLvlModal && (
        <TraineeModal
          handleClose={handleCloseModifyLvlModal}
          handleShow={showModifyLvlModal}
          title="Modify Level "
        >
          <ModifyLvlForm
            showInsentiveHistoryTable={showInsentiveHistoryTable}
            handleClose={handleCloseModifyLvlModal}
            setInsentiveHistoryData={setInsentiveHistoryData}
            setInsentiveLoading={setInsentiveLoading}
          />
        </TraineeModal>
      )}

      {/* BreadCrumbs */}
      <section className="d-flex  px-4 mb-2 ">
        <span className="header-text me-2">department</span>
        <span className="header-text me-2 ">/ department Details</span>
        <span className="fw-bold text-black ">/ Trainee Details</span>
      </section>

      {/* Filteration */}
      <div className="d-flex flex-sm-column flex-md-row align-items-center justify-content-between mb-3 flex-wrap px-4 ">
        <h1 className="total-number-title fw-bold m-0">
          Total number of (DMD)
        </h1>

        <div className="d-flex flex-column justify-content-center flex-md-row  align-items-center gap-2 ga-md-0">
          <div className="position-relative d-flex justify-content-end">
            {/* points and lvl buttons */}
            <div className="d-flex gap-2 mx-2 align-items-center me-2   pe-3 " style={{
              borderRight: "3px solid #57575780"
            }}>
              <button className=" main__button z-3 ">
                <Link href={`/User-Violations/${tranieeInfo?.vid}`}>
                  <span  >Violations</span>
                </Link>
              </button>
              <button
                className=" main__button z-3 "
                onClick={handleShowModifyLvlModal}
              >
                Modify Level
              </button>
              <button
                className=" main__button z-3 "
                onClick={handleShowAddPointsModal}
              >

                Add Points
              </button>
            </div>

            <Form
              onSubmit={handleSubmit}
              className="d-flex gap-2 align-items-center flex-column flex-md-row  ps-1"
            >
              <div className="position-relative">
                <button
                  className=" main__button z-3 px-2 ps-3 d-flex gap-1"
                  type="button"
                  onClick={() => setShowPicker(!showPicker)}
                >
                  {changed
                    ? `${moment(date[0].startDate).format(
                      "YYYY-MM-DD"
                    )} to ${moment(date[0].endDate).format("YYYY-MM-DD")}`
                    : <SlCalender fontSize={18} />
                  }
                  <MdKeyboardArrowDown fontSize={18} />
                </button>
                {showPicker ? (
                  <DateRangePicker
                    className="datePicker"
                    onChange={handelDateChange}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={date}
                    maxDate={moment().toDate()}
                    direction="vertical"
                  />
                ) : null}
              </div>
              <Button
                type="Submit"
                className="px-3 py-2 d-block    text-white filter-btn ">
                Filter <MdOutlineFilterAlt style={{ fontSize: "16px" }} />
              </Button>
              <Button
                type="button"
                onClick={handleClearSearch}
                variant="none"
                className="px-2 py-2 d-block clear_filter-btn "
                style={{ height: "35px" }}
              >
                Clear  <TbFilterCancel style={{ fontSize: "14px" }} />
              </Button>
            </Form>
          </div>
        </div>
      </div>

      {/* First section */}
      <section className="ps-2 ">
        <Row className="pt-2 px-3">
          <Col xl={6} lg={6} md={12}>
            <Card
              bg="light-blue"
              key={"Dark"}
              text={"Dark"}
              style={{
                background: "#EAEEF3",
                border: "none",
                height: "230px",
                overflow: "auto",
              }}
              className="mb-4 min-box "
            >
              <Card.Body className="px-3 d-flex align-items-center justify-content-center">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  {custodyTranieeLoading ? (
                    <SkeletonLoader traineeCard />
                  ) : (
                    <>
                      <div className="mx-3 d-flex align-items-center gap-3 ">
                        <img
                          src={
                            tranieeforImage?.users[0]?.image?.url ||
                            userProfile.src
                          }
                          alt="userProfile"
                          width={100}
                          height={100}
                          style={{
                            borderRadius: "50%",
                          }}
                          className="mb-lg-2 mb-md-3"
                        />
                        <div>
                          <h5
                            className=" mb-3 fw-bold"
                            style={{ fontSize: "16px" }}
                          >
                            {tranieeInfo?.username || "User Name"}
                          </h5>
                          <span
                            className="text-black"
                            style={{ fontSize: "14px" }}
                          >
                            ID: {tranieeInfo?.idNumber || "Id Num"}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex gap-2 align-items-end justify-content-end w-100">
                        <div
                          style={{
                            backgroundColor: "#D9E3F3",
                            color: "#3668E9",
                            fontSize: "15px",
                          }}
                          className="px-3 py-3 rounded fw-bold"
                        >
                          {itdName || "Not Asigned"}
                        </div>
                        <div
                          style={{
                            backgroundColor: "#D9E3F3",
                            color: "#3668E9",
                            fontSize: "15px",
                          }}
                          className="px-3 py-3 rounded fw-bold"
                        >
                          {departmentName || "Not Asigned"}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={3} md={12}>
            <Card
              bg="light-blue"
              key={"Dark"}
              text={"Dark"}
              style={{
                background: "#EAEEF3",
                border: "none",
                height: "230px",
                cursor: "pointer",
              }}
              className="mb-2 min-box"
              onClick={incentiveHistoryHandler}
            >
              <Card.Body className="px-4 d-flex align-items-center justify-content-center">
                {custodyTranieeLoading ? (
                  <SkeletonLoader card />
                ) : (
                  <div className="d-flex justify-content-center text-center align-items-center ">
                    <div className="d-flex flex-column justify-content-between align-items-center">
                      <h3 className="min-box-title mb-3 text-capitalize">
                        {<Image src={iconGift} width={50} height={50} />}
                      </h3>
                      <span
                        className="min-box-count min-box-count-font "
                        style={{
                          fontSize: "16px",
                          textAlign: "center",
                          lineHeight: "1.5pc",
                        }}
                      >
                        Total Incentive points
                      </span>
                      <span
                        className="min-box-count min-box-count-font "
                        style={{
                          fontSize: "14px",
                          display: "flex",
                          background:
                            "linear-gradient(180deg, #3B8F01 0%, #033000 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        <Image src={ArrowIcon} width={13}></Image>
                        {firstSectionBoxs.count}
                      </span>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={3} md={12}>
            <Card
              bg="light-blue"
              key={"Dark"}
              text={"Dark"}
              style={{
                background: "#EAEEF3",
                border: "none",
                height: "230px",
              }}
              className="mb-2 min-box position-relative"
            >
              <Card.Body className="px-4 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between">
                  <h4>Total Violations</h4>
                </div>
                {custodyTranieeLoading ? (
                  <SkeletonLoader card />
                ) : (
                  <div className="d-flex align-items-end justify-content-between">
                    <span className="fw-bold fs-3 mb-4">
                      {tranieeData?.sumViolations || 0}
                    </span>
                    <div
                      style={{
                        display: "flex",
                      }}
                      className="chartParent"
                    >
                      <DoughnutChart
                        total={100}
                        value={tranieeData?.sumViolations}
                        totalViolation
                      />
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
      {/* insentiveHistoryData Table */}
      {insentiveHistoryData?.length && showInsentiveHistoryTable ? (
        <Row className="pt-2 px-2 mx-auto mb-2">
          <Col md={12}>
            <button className="main__button mb-2 ms-auto text-white" style={{ opacity: ".7" }} onClick={() => setShowInsentiveHistoryTable(false)}>Hide Table </button>
            <IncentiveHistory
              data={insentiveHistoryData}
              loading={insentiveLoading}
            />
          </Col>
        </Row>
      ) : null}

      <div className="d-flex align-items-start gap-4 ps-0 ">
        {/* Violations */}
        <section className="ms-4 ">
          <h1 className=" total-number-title fw-bold">Violations</h1>

          <Row

            className="py-0  justify-content-center"
          >
            {secondSectionBoxs.map((box) => (
              <Col
                xxl={3}
                xl={4}
                lg={6}
                md={6}
                sm={12}
                className="mt-3"
                key={box.id}
              >
                <LargeBox
                  title={box.title}
                  count={box.count}
                  imgSrc={box.imgSrc}
                  value={tranieeData?.sumViolations}
                  total={200}
                  backgroundColor={box.backgroundColor}
                  iconWidth
                  iconHieght
                  loading={custodyTranieeLoading}
                  excelSheet={box.excelSheet}
                  trainee
                />
              </Col>
            ))}
          </Row>
        </section>

        {/* Map */}
        <div
          className="col-xl-3 col-md-4 col-sm-12"
          style={{
            borderRadius: "16px",
            marginTop: "52px",
          }}
        >
          <MapContainer
            style={{ minHeight: "455px", borderRadius: "16px" }}
            center={position}
            zoom={5}
            scrollWheelZoom={true}
          >
            <TileLayer attribution="" url={tileLayerUrl} />
            <Markers userId={traineeID} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TraineeDetails;

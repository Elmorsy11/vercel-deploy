import Card from "react-bootstrap/Card";
import SkeletonLoader from "./skeleton-loader";
import { useSelector } from "react-redux";

function TotalViolations() {
  const totalNum = useSelector((state) => state.dashboard.dashboardInfo);
  const { sheets } = useSelector((state) => state.dashboardSheets)

  const { cancelledViolationsData } = useSelector((state) => state.cancelledViolations)
  // Selecting Loader to handle loading
  const totalNumLoading = useSelector(
    (state) => state.dashboard.dashboardInfoLoading
  );
  const violationsReportLoading = useSelector(
    (state) => state.dashboard.violationsReportLoading
  );

  const handleRoute = (route) => {
    if (
      ((Object.values(sheets).flat()?.length > 0 && route === "all")) ||
      (sheets[route]?.length > 0 || totalNum.cancelledViolations)
    ) {
      let newTab;
      if (route == "cancelledViolations") {
        newTab = window.open(`/${route}`, "_blank");
      } else {
        newTab = window.open(`violations/${route}`, "_blank");
      }
      newTab.focus();
    }
  };
  const totalViolations =
    totalNum?.overSpeed +
    totalNum?.harshBrake +
    totalNum?.harshAcceleration +
    totalNum?.seatBelt +
    totalNum?.nightDrive +
    totalNum?.fatigue +
    totalNum?.tampering +
    totalNum?.swerving;
  return (
    <Card
      bg="light-blue"
      key={"Dark"}
      text={"Dark"}
      style={{
        border: "none",
        background: "#DBE3ED",
        height: "100%",
        overflow: "auto",
      }}
      className="mb-2 min-box"
    >
      <div
        className=""
        style={{
          display: "flex",
          width: "100%",
          padding: "16px ",
        }}
      >
        {totalNumLoading ? (
          <SkeletonLoader card />
        ) : (
          <div
            className="d-flex flex-column justify-content-around "
            style={{ width: "100%", marginBottom: "5px" }}
          >
            <button
              className={`d-flex justify-content-between align-items-center  `}
              style={{
                marginBottom: "12px",
                fontSize: "12px",
                color: (!violationsReportLoading && totalViolations !== 0) && "#3668e9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                background: "transparent",

              }}

              disabled={violationsReportLoading || totalViolations == 0}
              onClick={() => handleRoute("all")}
            >
              {totalNum && (
                <>
                  <h5 className={` ${(!violationsReportLoading && totalViolations !== 0) ? "violation-btn" : ""}   `} style={{ fontSize: "15px", lineHeight: 1 }}>
                    all Violations
                  </h5>
                  <span
                    className="text-dark  d-flex align-items-center violation-count"
                  >{totalViolations}
                  </span>
                </>
              )}
            </button>
            <div>
              {
                totalNum?.violationsKeys?.map((key, i) => {
                  return (
                    <button
                      className="d-flex justify-content-between align-items-center w-100 bg-transparent"
                      style={{
                        marginBottom: "5px",
                        fontSize: "12px",
                        color: (totalNum[key] && !violationsReportLoading) && "#3668e9",
                      }}
                      disabled={totalNum[key] === 0 || violationsReportLoading}
                      onClick={() => handleRoute(key)}
                      key={i}
                    >
                      <span style={{ textTransform: "capitalize" }} className={`${totalNum[key] && !violationsReportLoading ? "violation-btn" : ""}  `} >
                        {key.replace(/(.)([A-Z])/g, '$1 $2')}
                      </span>
                      <span className="text-dark  d-flex align-items-center violation-count">
                        {totalNum[key]}
                      </span>
                    </button>
                  )
                })}
              <button
                className={`d-flex justify-content-between align-items-center w-100 bg-transparent    `}
                style={{
                  marginBottom: "5px",
                  fontSize: "12px",
                  color: !violationsReportLoading && "#3668e9",
                }}
                disabled={violationsReportLoading}
                onClick={() => handleRoute("cancelledViolations")}

              >
                <span className={` text-capitalize  ${(!violationsReportLoading && totalNum?.cancelledViolations !== 0) ? "violation-btn" : ""}  `} >
                  cancelled violations
                </span>
                <span className="text-dark  d-flex align-items-center violation-count">
                  {totalNum?.cancelledViolations}  </span>
              </button>

            </div>
          </div>
        )}
      </div>
    </Card >
  );
}

export default TotalViolations;

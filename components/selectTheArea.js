import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
/*___________ Components _____________*/
import Card from "react-bootstrap/Card";
import SkeletonLoader from "./skeleton-loader";
import DoughnutChart from "./dashboard/Charts/DoughnutChart";
import { toast } from "react-toastify";
/*___________ Actions _____________*/
import {
  TotalUsers,
  changeItdItc,
  dashboardInfo,
  violationsReport,
  weeklyTrendsChart,
} from "../lib/slices/dashboardSlice";
import { allTrainees } from "lib/slices/custodies";
import moment from "moment";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";
import { dashboardSheets } from "lib/slices/violationsSheetsSlice";

function SelectTheArea({
  backgroundColor,
  loading,
  style,
  label,
  setSelectedLabel,
  itcID,
  itdID,
}) {
  const dispatch = useDispatch();
  const [itdData, setItdData] = useState({});
  const [localLoading, setLocalLoading] = useState(false);
  const { filteredDate, isFilteredDateChanged, isSubmitted } = useSelector((state) => state.filterMaindashboard)
  // in case CLick on Any ITD or ITC
  useEffect(() => {
    // to cancel request 
    const source = axios.CancelToken.source();
    const fetchDashBoard = async () => {
      setLocalLoading(true);
      try {
        const url = `dashboard/mainDashboard`;
        const params = {
          itd: itdID ?? null,
          itc: itcID ?? null,
          mobile: true,  // to remove violations' sheets
          startDate: isFilteredDateChanged ? moment(filteredDate[0].startDate).format("YYYY-MM-DDTHH:mm:ss") : null,
          endDate: isFilteredDateChanged ? moment(filteredDate[0].endDate).format("YYYY-MM-DDTHH:mm:ss") : null,

        };
        const res = await axios.get(url, { params, cancelToken: source.token });
        setItdData({ ...res.data });
        setLocalLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          // Request was canceled
          console.log('Request canceled:', err.message);
        } else {
          toast.error(err?.response?.data.message);

        }

      }
    };
    fetchDashBoard();

    return () => {
      // Cancel the request when the component is unmounted
      source.cancel('Request canceled by cleanup');
    };

  }, [itdID, itcID, isSubmitted]);
  const ok = useSelector((state) => state.dashboard);
  return (
    <>
      <Card
        bg="light-blue"
        key={"Dark"}
        text={"Dark"}
        style={{
          background: `${backgroundColor ? backgroundColor : "#09c"}`,
          border: "none",
          // height: "200px",
        }}
        onClick={() => {
          if (setSelectedLabel) {
            const payloadData = {
              itc: itcID,
              startDate: isFilteredDateChanged ? moment(filteredDate[0].startDate).format("YYYY-MM-DDTHH:mm:ss") : null,
              endDate: isFilteredDateChanged ? moment(filteredDate[0].endDate).format("YYYY-MM-DDTHH:mm:ss") : null,
            }
            setSelectedLabel(label);
            if (itcID) {
              dispatch(changeItdItc({ itc: itcID, itd: null }));
              dispatch(violationsReport(payloadData));
              dispatch(dashboardInfo(payloadData));
              dispatch(TotalUsers(payloadData));
              dispatch(weeklyTrendsChart(payloadData));
              dispatch(allTrainees(payloadData))
              dispatch(cancelledViolations(payloadData))
              dispatch(dashboardSheets(payloadData))

            }
          }
          dispatch(changeItdItc({ label: ok.label ? label : "All ITD" }));
        }}
        className="mb-2 min-box  "
      >
        <Card.Body style={{ cursor: "pointer", padding: "15px" }}>
          {loading ? (
            <SkeletonLoader card />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {style && (
                  <div
                    style={{
                      maxWidth: "150px",
                      overFlow: "scroll",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    {ok.label ?? "Itd"}
                  </div>
                )}
                <div className="d-flex flex-column justify-content-center  w-100">
                  {label ? (
                    <h5
                      className="fw-bold text-black-50  text-center mb-2"
                      style={{ fontSize: "15px" }}
                    >
                      {label}
                    </h5>
                  ) : null}
                </div>
              </div>

              {localLoading ? (
                <SkeletonLoader card />
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <DoughnutChart
                    style={style}
                    value={itdData.totalViolScore}
                    total={itdData?.offline + itdData?.online}
                    main
                  />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default SelectTheArea;

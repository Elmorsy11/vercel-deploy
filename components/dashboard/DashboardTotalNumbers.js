import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

/*___________ Components _____________*/
import { Card, Col, Row } from "react-bootstrap";
/*___________ Actions _____________*/
import {
  TotalUsers,
  dashboardInfo,
  topDrivers,
  weeklyTrendsChart,
  violationsReport,
} from "../../lib/slices/dashboardSlice";

import TopDriversBox from "./TopDriverBox";
import TotalUsersBox from "components/TotalUsersBox";
import TotalViolations from "components/totalViolations";
import { useRouter } from "next/router";
import FliterBox from "components/FilterBox";
import SkeletonLoader from "components/skeleton-loader";
import { useSession } from "next-auth/client";
import { dashboardInfoData, violationReports } from "helpers/indexDb";
import { allTrainees } from "lib/slices/custodies";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";
import { dashboardSheets, source } from "lib/slices/violationsSheetsSlice";

function DashboardTotalMumbers({ }) {
  // const source = axios.CancelToken.source();

  const dispatch = useDispatch();
  const [session] = useSession()
  const router = useRouter();


  // Selecting Loader to handle loading
  const totalNumLoading = useSelector(
    (state) => state.dashboard.TotalUsersLoading
  );
  // violationsLoading to handle loading
  const violationsLoading = useSelector(
    (state) => state.dashboard.dashboardInfoLoading
  );
  // Selecting Data from store
  const totalNum = useSelector((state) => state.dashboard.dashboardInfo);
  const usersNum = useSelector((state) => state.dashboard.TotalUsers);
  const violationsData = useSelector((state) => state?.dashboard?.violationsReport);
  const { cancelledViolationsData } = useSelector((state) => state.cancelledViolations)
  const { sheets } = useSelector((state) => state.dashboardSheets)
  useEffect(() => {
    localStorage.setItem("TotalUsers", JSON.stringify(usersNum));
    if (cancelledViolationsData?.length) {
      localStorage.setItem("cancelledViolations", JSON.stringify(cancelledViolationsData));
    }
    //  setting data at indexDb storage
    dashboardInfoData.put({ id: 1, sheets })
    violationReports.put({ id: 2, violationsData: violationsData?.violationsReportData })
  }, [usersNum, totalNum, violationsData]);

  const fetchRequestsHandler = (itc, itd) => {
    dispatch(dashboardInfo({ itc: itc ?? null, itd: itd ?? null }));
    dispatch(TotalUsers({ itc: itc ?? null, itd: itd ?? null }));
    dispatch(topDrivers({ itc: itc ?? null, itd: itd ?? null }));
    dispatch(weeklyTrendsChart({ itc: itc ?? null, itd: itd ?? null }));
    dispatch(violationsReport({ itc: itc ?? null, itd: itd ?? null }));
    dispatch(allTrainees({ itc: itc ?? null, itd: itd ?? null }))
    dispatch(cancelledViolations({ itc: itc ?? null, itd: itd ?? null }))
    dispatch(dashboardSheets({ itc: itc ?? null, itd: itd ?? null }))
  }

  useEffect(() => {
    if (router.asPath.includes("?")) {
      fetchRequestsHandler(router.query.itc, router.query.itd)
    }
    return () => {
      source.cancel('Request canceled by cleanup');

    }
  }, [router.asPath]);
  useEffect(() => {
    if (session?.user?.data?.role !== "safety-advisor") {
      if (router.asPath === "/") {
        fetchRequestsHandler()
      }
      localStorage.removeItem("Itd")
    }
    return () => {
      source.cancel('Request canceled by cleanup');

    }
  }, []);

  return (
    <>
      <section className="px-4">
        <Row className="pt-0 mt-0" style={{ rowGap: "20px", columnGap: "0" }}>
          <Col xl={4} lg={4} sm={6}>
            <TotalUsersBox loading={totalNumLoading} />
          </Col>
          <Col xl={2} lg={2} sm={6}>
            {violationsLoading ? (
              <Card
                bg="light-blue"
                key={"Dark"}
                text={"Dark"}
                style={{
                  border: "none",
                  height: "200px !important  ",
                }}
                className="mb-2 py-2 min-box hover h-100"
              >
                <Card.Body
                  style={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <SkeletonLoader card />
                </Card.Body>
              </Card>
            ) : (
              <FliterBox
                key={5}
                count={totalNum?.totalViolScore}
                backgroundColor={"#EAEEF3"}
                iconWidth
                iconHieght
                loading={violationsLoading}
                style={true}
              />
            )}
          </Col>

          <Col xl={3} lg={3} sm={6} key={5}>
            <TotalViolations backgroundColor={"#EAEEF3"} />
          </Col>

          <Col xl={3} lg={3} sm={6}>
            <TopDriversBox loading={violationsLoading} />
          </Col>
        </Row>
      </section>
    </>
  );
}

export default DashboardTotalMumbers;

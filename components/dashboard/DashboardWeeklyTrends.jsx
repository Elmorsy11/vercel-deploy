import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

/*___________ Components _____________*/
import { Col, Row } from "react-bootstrap";
import Markers from "components/dashboard/Markers";

const WeeklyTrends = dynamic(() => import("./trends"), {
  ssr: false,
});

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

const DashboardWeeklyTrends = () => {
  const [weeklyCategories, setWeeklyCategories] = useState([]);
  const [weeklyData, setweeklyData] = useState([0]);

  const position = [25.278229, 48.488376];

  // Selecting Weekly Trends Data
  const weeklyTrends = useSelector(
    (state) => state.dashboard.weeklyTrends?.data
  );
  const weeklyTrendsLoading = useSelector(
    (state) => state.dashboard.weeklyTrendsLoading
  );
  // const weeklyTrends = useSelector((state) => state.dashboard);

  const usersNum = useSelector((state) => state.dashboard.TotalUsers);
  const totalUserLoading = useSelector(
    (state) => state.dashboard.TotalUsersLoading
  );
  const dashboardInfo = useSelector((state) => state.dashboard.dashboardInfo);

  useEffect(() => {
    if (!weeklyTrendsLoading && weeklyTrends?.Trends) {
      const categories = weeklyTrends?.Trends?.labels;
      setWeeklyCategories(categories);

      const series = weeklyTrends?.Trends?.series;
      setweeklyData(series);
    }
  }, [weeklyTrendsLoading, weeklyTrends?.Trends]);

  return (
    <section className="px-4 ml-2 mt-4">
      <Row style={{ maxHeight: "270px" }}>
        <Col lg={8} sm={12} className="mb-4" style={{ height: "100%" }}>
          {/* {!weeklyTrendsLoading && ( */}
          <WeeklyTrends
            categories={weeklyCategories}
            data={weeklyData}
            loading={weeklyTrendsLoading}
          />
        </Col>

        <Col lg={4} sm={12} className="mb-4">
          {/* {dashboardInfo && ( */}
          <MapContainer
            style={{ minHeight: "100%", borderRadius: "16px" }}
            center={position}
            zoom={5}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution="Google Maps"
              url="https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
            />

            {dashboardInfo?.users?.length > 0 && (
              <Markers mainPage={true} dashboardUsers={dashboardInfo.users} />
            )}
          </MapContainer>
        </Col>
      </Row>
    </section>
  );
};

export default DashboardWeeklyTrends;

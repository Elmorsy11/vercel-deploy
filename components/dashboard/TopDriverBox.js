import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

/*___________ Components _____________*/
import Card from "react-bootstrap/Card";
import TopDriver from "./TopDriver";
import Image from "next/image";
/*___________ Images _____________*/
import top1 from "public/assets/top1.svg";
import top2 from "public/assets/top2.svg";
import top3 from "public/assets/top3.svg";

/*___________ Actions _____________*/
import { topDrivers } from "../../lib/slices/dashboardSlice";
import SkeletonLoader from "../skeleton-loader";
import { convertJsonToExcel, handlingRowDataColumn } from "helpers/helpers";
import { useSession } from "next-auth/client";

const Toprated = ({ icon, driverName }) => {
  return (
    <div className="d-flex align-items-center ">
      <Image src={icon} alt="icon" width={15} height={15} />
      <span
        className="top-driver-name w-100 ms-1  fs-6 fw-bold"
        style={{ fontSize: "14px" }}
      >
        {driverName}
      </span>
    </div>
  );
};

function TopDriversBox({ loading }) {
  // To path Default src images in props as string
  const user1 = "assets/top-user-1.png";
  const user2 = "assets/top-user-2.png";
  const user3 = "assets/top-user-3.png";
  const [session] = useSession()

  const dispatch = useDispatch();

  // Selecting Data from store
  const topDriversData = useSelector(
    (state) => state.dashboard.topDrivers?.data?.result
  );
  // Selecting Loader to handle loading
  const topDriversLoading = useSelector(
    (state) => state.dashboard.topDriversLoading
  );

  useEffect(() => {
    localStorage.setItem("topDrivers", JSON.stringify(topDriversData));
  }, [topDriversData]);

  const driversData = [
    {
      id: topDriversData?.[0]?._id,
      icon: top1,
      driverName: topDriversData?.[0]?.username,
      driverImage: topDriversData?.[0]?.image?.url || user1,
    },
    {
      id: topDriversData?.[1]?._id,
      icon: top2,
      driverName: topDriversData?.[1]?.username,
      driverImage: topDriversData?.[1]?.image?.url || user2,
    },
    {
      id: topDriversData?.[2]?._id,
      icon: top3,
      driverName: topDriversData?.[2]?.username,
      driverImage: topDriversData?.[2]?.image?.url || user3,
    },
  ];

  function exportData() {
    convertJsonToExcel(handlingRowDataColumn(topDriversData), "Top Drivers");
  }
  return (
    <Card
      style={{
        border: "none",
        background: "#DBE3ED",
        height: "100%",
        overflow: "auto",
      }}
      className="min-box mb-3"
    >
      <Card.Body style={{ height: "100%" }}>
        {topDriversLoading ? (
          <SkeletonLoader card />
        ) : (
          <div className="">
            <div>
              <div className="d-flex align-items-center justify-content-between">
                <h5 className=" mb-1" style={{ fontSize: "15px" }}>
                  Top Drivers
                </h5>
                <button
                  style={{ position: "absolute", top: "15px", right: "10px" }}
                  role="button"
                  onClick={() => window.open("/export/topDrivers")}
                  className={`${topDriversData ? "export-btn" : "export-btn__disabled"
                    } ms-auto d-flex align-items-center ${"justify-content-between"}`}
                  disabled={topDriversData ? false : true}
                >
                  <div>Show All</div>

                  {/* <img
                    src="/blue-export-icon.svg"
                    alt="export"
                    className="mx-2"
                  /> */}
                </button>
              </div>
              <div>
                {driversData?.map((driver) => {
                  return (
                    <div className="d-flex gap-1 align-items-center justify-content-between">
                      <Toprated
                        key={driver.id}
                        icon={driver.icon}
                        driverName={driver.driverName ?? "Driver Name"}
                        loading={topDriversLoading}
                      />
                      <TopDriver
                        imgSrc={driver?.driverImage}
                        imgWidth={35}
                        imgHieght={35}
                        borderColor="#A27E79"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default TopDriversBox;

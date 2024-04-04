import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "react-bootstrap";
import logo from "public/assets/main-logo.svg";
import userImage from "public/assets/images/profile.jpg";
import Icons from "../components/sidebar/Icons";
import { useSession, signOut } from "next-auth/client";

import { useDispatch, useSelector } from "react-redux";
// import NotificationCircle from "components/dashboard/NotificationCircles";
import Notifications from "components/dashboard/Notifications";
import { toast } from "react-toastify";
import axios from "axios";
import { myDatabase } from "helpers/indexDb";
import { TotalUsers, changeItdItc, dashboardInfo, topDrivers, violationsReport, weeklyTrendsChart } from "lib/slices/dashboardSlice";
import { allTrainees } from "lib/slices/custodies";
import { resetFilteredData, setFilteredItcLabel } from "lib/slices/filterMaindashboardSlice";
import { useTrainees } from "context/TraineesContext";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";
import { dashboardSheets } from "lib/slices/violationsSheetsSlice";
const VerticalNav = ({ setSelectedLabel, selectedLabel, setBreadcrumbs, isActiveSideBar }) => {
  const [session, loading] = useSession();
  const safetyAdvisorCustodyId = session?.user?.data?.custodyId
  const isSafetyAdvisor = session?.user?.data?.role === 'safety-advisor'
  const safetyAdvisorCustodyName = session?.user.data?.custodyName

  // to reset selected date at filteration
  const { isFilteredDateChanged, filteredItcLabel } = useSelector((state) => state.filterMaindashboard)
  const router = useRouter();
  const dispatch = useDispatch();
  const { setTrainees } = useTrainees();

  const handleSignOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("label");
    signOut();
    myDatabase.delete()
    localStorage.clear()
  };
  const handleSync = async () => {
    toast.info("Sync Vehicles Started");
    try {
      const res = await axios.get("sync/vehicles");
      toast.success("Sync Vehicles Done");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };
  const fetchRequestsHandler = (safetyAdvisorCustodyId) => {
    dispatch(violationsReport({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(dashboardInfo({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(TotalUsers({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(topDrivers({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(weeklyTrendsChart({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(allTrainees({ itc: safetyAdvisorCustodyId ?? null }))
    dispatch(cancelledViolations({ itc: safetyAdvisorCustodyId ?? null }))
    dispatch(dashboardSheets({ itc: safetyAdvisorCustodyId ?? null }))

  }
  return (
    <Nav
      className="d-flex flex-column align-items-center h-100  flex-nowrap "
      style={{
        backgroundColor: "#f6f6f6",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <section className="mt-5">
        <div className="d-flex  flex-column justify-content-center align-items-center ">
          <Image
            src={logo}
            alt="Logo"
            width={isActiveSideBar ? 48 : 80}
            height={isActiveSideBar ? 48 : 80}
            className="sid-bar-logo"
          />
        </div>
        <div className="d-flex  flex-column justify-content-center align-items-center py-4">
          <Image
            src={session?.user?.data?.image?.url || userImage}
            alt="userImage"
            width={isActiveSideBar ? 48 : 90}
            height={isActiveSideBar ? 48 : 90}
            className="rounded-circle"
          />
          {!isActiveSideBar && <h5 className="py-2 side-bar-user-name text-capitalize">
            {session?.user?.data?.username || "Admin Name"}
          </h5>}

        </div>
      </section>

      <section className="mt-5">
        <Nav.Item className="w-100" onClick={() => {
          setSelectedLabel(null)
          setTrainees(null)
          localStorage.removeItem('Itd')
          if (selectedLabel !== null || isFilteredDateChanged || filteredItcLabel) {
            // reset date of filter at dashnoard 
            dispatch(setFilteredItcLabel({ label: isSafetyAdvisor ? safetyAdvisorCustodyName : "All ITD" }))
            dispatch(resetFilteredData())
            dispatch(changeItdItc({ itc: null, itd: null, label: null }));

            if (router.asPath === "/" || router.asPath.includes("/?")) {
              if (isSafetyAdvisor) {
                fetchRequestsHandler(safetyAdvisorCustodyId)
              } else {
                fetchRequestsHandler()
              }
            }
          }
        }
        }>
          <Link href={session.user.data?.role === "safety-advisor" ? `/?itc=${session.user?.data?.custodyId}` : '/'}>
            <a
              className={` ${(router.pathname === "/" && !isActiveSideBar) && "active"
                } nav-link text-center fs-4 d-flex align-items-center gap-3 mb-2 ${isActiveSideBar ? "" : "px-4"}  `}
            >
              <Icons type="dashboard" />
              <span className={`text-muted ${isActiveSideBar ? "d-none" : ""} `}>Dashboard</span>
            </a>
          </Link>
        </Nav.Item>

        <Nav.Item className="w-100 my-3"
          onClick={() => {
            setBreadcrumbs(["Home"])
            dispatch(resetFilteredData());

          }}
        >
          <Link href={session.user.data?.role === "safety-advisor" ? `/departments/department-details/${session?.user?.data?.custodyId}` : '/departments'}>
            <a
              className={`${(router.pathname === "/departments" && !isActiveSideBar) && "active"
                } nav-link text-center fs-4 d-flex align-items-center gap-4 ${isActiveSideBar ? "" : "px-4"}  `}
            >
              <Icons type="itd" />
              <span className={`text-muted ${isActiveSideBar ? "d-none" : ""} `}>{session?.user.data?.role === "safety-advisor" ? 'ITC' : 'ITD'}</span>
            </a>
          </Link>
        </Nav.Item>

        <Nav.Item className="w-100 ms-1">
          <Link href="/map">
            <a
              className={` ${(router.pathname === "/map" && !isActiveSideBar) && "active"
                } nav-link text-center fs-4 d-flex align-items-center gap-4 ${isActiveSideBar ? "" : "px-4"}  `}
            >
              <Icons type="map" />

              <span className={`text-muted ${isActiveSideBar ? "d-none" : "ms-1"} `}>Map</span>
            </a>
          </Link>
        </Nav.Item>

        {session?.user?.data?.role === "superAdmin" && (
          <Nav.Item
            className="w-100 my-4"
            style={{ cursor: "pointer" }}
            onClick={handleSync}
          >
            <a
              className={`nav-link text-center fs-4 d-flex align-items-center gap-4 ${isActiveSideBar ? "" : "px-4"}  `}
            >
              <Icons type="sync" />
              <span className={`text-muted ${isActiveSideBar ? "d-none" : ""} `}>Sync</span>
            </a>
          </Nav.Item>
        )}
      </section>
      <div
        className="sidebar-footer  w-100"
        style={{
          marginTop: isActiveSideBar ? "130px" : "80px",
        }}
      >
        <section className="sidebar-footer-content mx-auto w-100">
          <Notifications isActiveSideBar={isActiveSideBar} />
          <a
            onClick={handleSignOut}
            className={` text-center fs-4 d-flex align-items-center gap-2 mt-4 ${isActiveSideBar ? "justify-content-center" : "px-5"}  `}
            style={{
              cursor: "pointer",
            }}
          >
            <span
              className="mb-1  d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 2H15C15.5304 2 16.0391 2.21071 16.4142 2.58579C16.7893 2.96086 17 3.46957 17 4V6H15V4H6V20H15V18H17V20C17 20.5304 16.7893 21.0391 16.4142 21.4142C16.0391 21.7893 15.5304 22 15 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V4C4 3.46957 4.21071 2.96086 4.58579 2.58579C4.96086 2.21071 5.46957 2 6 2Z"
                  fill="#414141"
                />
                <path
                  d="M16.09 15.59L17.5 17L22.5 12L17.5 7L16.09 8.41L18.67 11H9V13H18.67L16.09 15.59Z"
                  fill="#414141"
                />
              </svg>
            </span>
            <span className={`text-muted ${isActiveSideBar ? "d-none" : ""} `}>Logout</span>
          </a>
        </section>
      </div>
    </Nav>
  );
};

export default VerticalNav;

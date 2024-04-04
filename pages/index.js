import { useSession } from "next-auth/client";
import { useEffect, useMemo, useState } from "react";

/*___________ Components _____________*/
import DashboardHeader from "components/dashboard/DashboardHeader";
import DashboardTotalNumbers from "components/dashboard/DashboardTotalNumbers";
import DashboardViolations from "components/dashboard/DashboardViolations";

/*___________ Style _____________*/
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useRouter } from "next/router";
import DashboardWeeklyTrends from "components/dashboard/DashboardWeeklyTrends";
import { useDispatch, useSelector } from "react-redux";
import AgGridDT from "components/AgGridDT";
import { allTrainees, clearCustodyDetails } from "lib/slices/custodies";
import { Breadcrumb, Spinner } from "react-bootstrap";
import {
  TotalUsers,
  changeItdItc,
  dashboardInfo,
  topDrivers,
  violationsReport,
  weeklyTrendsChart,
} from "lib/slices/dashboardSlice";
import { useTrainees } from "context/TraineesContext";
import { resetFilteredData, setFilteredItcLabel } from "lib/slices/filterMaindashboardSlice";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";
import { dashboardSheets } from "lib/slices/violationsSheetsSlice";

const Home = ({ selectedLabel, setSelectedLabel, breadcrumbs, setBreadcrumbs }) => {

  const { loading, trainees, setTrainees } = useTrainees();

  const [gridApi, setGridApi] = useState(null);

  const dispatch = useDispatch();
  const [session] = useSession()
  const router = useRouter();

  const getRowStyle = () => {
    return {
      position: "relative",
      transform: "translateY(0)",
      marginBottom: "5px",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    };
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "username",
        minWidth: 250,
      },
      {
        headerName: "ID",
        field: "idNumber", minWidth: 250,
      },
      {
        headerName: "Total Points",
        field: "totalPoints", minWidth: 250,
      },

      {
        headerName: "Student Mobile Number",
        field: "StudentMobileNumber", minWidth: 250,
      }, {
        headerName: "Parent Mobile Number",
        field: "ParentMobileNumber", minWidth: 250,
      },
      {
        headerName: "Email",
        field: "email", minWidth: 250,
      },
      {
        headerName: "Millage",
        field: "millage", minWidth: 250,
      },
      {
        headerName: "Actions",
        maxWidth: 300,
        minWidth: 250,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center justify-content-start gap-3 mt-1">
            <button
              className=" main__button-table"
              onClick={() => {
                if (params?.data?._id) {
                  router.push({
                    pathname: `/departments/trainee-details/${params.data._id}`,
                    // query: { custodyId: params.data._id },
                  });
                } else {
                  toast.error("No Trainee Found");
                }
              }}
            >
              View Statistics
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { label, itd, divisonData } = useSelector((state) => state.dashboard);

  const onGridReady = (params) => setGridApi(params.api);

  // This To Control BreadCrumbs
  useEffect(() => {
    if (label && !breadcrumbs.includes(label)) {
      setBreadcrumbs([...breadcrumbs, label]);
    }

    if (selectedLabel === null && !label) setBreadcrumbs(["Home"]);
  }, [label, selectedLabel]);

  const [allItd, setAllItd] = useState([]);

  useEffect(() => {
    let tempITD = [];
    divisonData.map((item) => {
      tempITD.push(item.label);
    });
    setAllItd(tempITD);
  }, [label]);


  useEffect(() => {

    // const hasLocationReplaced = localStorage.getItem('hasLocationReplaced');
    if (session.user?.data?.role === "safety-advisor") {
      dispatch(
        changeItdItc({
          itc: session.user?.data?.custodyId,
          itd: null,
          label: session.user.data?.custodyName
        })
      );
      router.replace(`/?itc=${session.user?.data?.custodyId}`)
    }

  }, [session.user?.data?.role]);
  const resetFilteredDateAndItcLabelHandler = () => {
    dispatch(setFilteredItcLabel({ label: "All ITD" }))
    dispatch(resetFilteredData())
  }

  return (
    <div className="px-2 " style={{ background: "#f6f6f6" }} >
      <DashboardHeader title="Dashboard" setSelectedLabel={setSelectedLabel} selectedLabel={selectedLabel} breadCrumbs={breadcrumbs} setBreadCrumbs={setBreadcrumbs} />
      {/* Breadcrumb */}
      {
        session.user?.data?.role !== "safety-advisor" && <Breadcrumb className="ms-4 fw-bold fs-5 mb-0">
          {breadcrumbs?.map((bread, i) => (
            <Breadcrumb.Item
              key={bread}
              style={{ fontSize: "15px", visibility: breadcrumbs?.length > 1 ? "visible" : "hidden" }}
              className="m-0 p-0"
              active={label === bread}
              href="#"
              onClick={() => {
                setBreadcrumbs(breadcrumbs.slice(0, i + 1));
                dispatch(clearCustodyDetails());

                if (bread === "Home") {
                  dispatch(dashboardInfo({}));
                  dispatch(topDrivers({}));
                  dispatch(TotalUsers({}));
                  dispatch(violationsReport({}));
                  dispatch(weeklyTrendsChart({}));
                  dispatch(allTrainees({}))
                  dispatch(cancelledViolations({}))

                  setSelectedLabel(null);
                  setTrainees(null);
                  dispatch(changeItdItc({ label: null, itc: "null", itd: null }));
                  dispatch(dashboardSheets({}))

                  // reset filtered date and itcLabel 
                  resetFilteredDateAndItcLabelHandler()
                  localStorage.removeItem("Itd")
                  router.replace("/");
                } else if (bread === "All ITD") {
                  dispatch(setFilteredItcLabel({ label: "All ITD" }))
                  dispatch(dashboardInfo({}));
                  dispatch(topDrivers({}));
                  dispatch(TotalUsers({}));
                  dispatch(violationsReport({}));
                  dispatch(weeklyTrendsChart({}));
                  dispatch(allTrainees({}))
                  dispatch(cancelledViolations({}))
                  // dispatch(dashboardSheets({}))

                  dispatch(changeItdItc({ label: bread, itc: "null", itd: null }));
                  setTrainees(null);
                  setSelectedLabel(null);

                  // reset filtered date and itcLabel 
                  resetFilteredDateAndItcLabelHandler()
                  localStorage.removeItem("Itd")
                  router.replace("/");
                } else if (allItd.includes(bread)) {
                  dispatch(topDrivers({ itd }));
                  setSelectedLabel(bread);
                  dispatch(dashboardInfo({ itd }));
                  dispatch(TotalUsers({ itd }));
                  dispatch(changeItdItc({ label: bread, itc: "null" }));
                  dispatch(violationsReport({ itd }));
                  dispatch(weeklyTrendsChart({ itd }));
                  dispatch(allTrainees({ itd }))
                  dispatch(cancelledViolations({ itd }))
                  setTrainees(null);
                  // reset filtered date and itcLabel 
                  resetFilteredDateAndItcLabelHandler()
                }
              }}
            >
              <button className="bg-transparent breadcrumb-btn" disabled={label === bread}  >
                {bread}
              </button>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      }

      <DashboardTotalNumbers setSelectedLabel={setSelectedLabel} />

      {trainees && !loading ? (
        <div className="m-4">
          <h5 className="p-2" style={{ fontSize: "15px" }}>
            All Trainees
          </h5>

          <AgGridDT
            columnDefs={columns}
            rowData={trainees}
            onGridReady={onGridReady}
            paginationPageSize={2}
            getRowStyle={getRowStyle}
          />
        </div>
      ) : loading ? (
        <div className="d-flex justify-content-center align-items-center py-3">
          <Spinner animation="grow" />
        </div>
      ) : null}

      <DashboardViolations
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
      />
      <DashboardWeeklyTrends />
    </div>
  );
};
export default Home;

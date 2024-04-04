import { useDispatch, useSelector } from "react-redux";
import { useMemo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

/*___________ Components _____________*/
import AgGridDT from "components/AgGridDT";

/*___________ Icons _____________*/
import ItcIcon from "../../components/svgIcons/ItcIcon";
import { CiViewList } from "react-icons/ci";

/*___________ Actions _____________*/
import { TotalUsers, changeItdItc, dashboardInfo, topDrivers } from "../../lib/slices/dashboardSlice";
import { divisionDetails } from "../../lib/slices/custodies";

/*___________ Functions _____________*/
import { convertJsonToExcel } from "../../helpers/helpers";
import { FaRegChartBar } from "react-icons/fa";

const CustodiesDetails = ({ setSelectedLabel }) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const divisionId = null;

  const [rowData, setRowData] = useState([]);

  const safetyAdvisorsData = useSelector(
    (state) =>
      state.custodies.custodyDetails?.data?.custodyDetails?.[0]?.SafetyAdvisor
  );

  const itdName = useSelector(
    (state) => state.custodies.divisionDetails?.[0]?.divisionName
  );

  const itdRowData = useSelector(
    (state) => state.custodies.divisionDetails?.[0]?.itcs
  );
  const loading = useSelector(
    (state) => state.custodies.divisionDetailsLoading
  );

  const [gridApi, setGridApi] = useState(null);
  const itdColumns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "custodyName",
        maxWidth: 290,
        minWidth: 290,
        cellRenderer: (params) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <ItcIcon /> {params?.data?.custodyName}
            </div>
          );
        },
      },
      {
        headerName: "Safety advisor",
        field: "safetyAdvisorsCount",
        maxWidth: 290,
        minWidth: 290,
      },
      {
        headerName: "Trainees",
        field: "traineeCount",
        maxWidth: 290, minWidth: 290,
      },
      {
        headerName: "Millage",
        field: "millage",
        maxWidth: 290,
        minWidth: 290,
        valueGetter: (params) =>
          (params?.data?.millage / 1000).toLocaleString() || 0,
      },
      {
        headerName: "Actions",
        Width: 400,
        maxWidth: 350, minWidth: 300,

        cellRenderer: (params) => (
          <div className="d-flex justify-content-start gap-3 align-items-center">
            <button
              className="main__button-table bg-transparent  " style={{ border: ".5px solid #3668e9ab", color: "#3668E9" }}
              onClick={() => {
                // if (params?.data?.itcs?.length) {
                router.push({
                  pathname: `/departments/department-details/${params?.data?._id}`,
                  // query: { departmentId: params?.data_?.id },
                });
                // } else {
                //   toast.error("No ITC in this ITD");
                // }
              }}
            >
              <CiViewList fontSize={19} color="#3668E9" style={{ marginRight: "4px" }} />
              Details
            </button>
            <button
              onClick={() => {

                setSelectedLabel(params.data.custodyName);
                dispatch(
                  changeItdItc({
                    itc: params?.data?._id,
                    itd: null,
                    label: params.data.custodyName,
                  })
                );
                router.push({
                  pathname: "/",
                  query: { itc: params?.data?._id },
                });
              }}
              className="main__button-table"
            >
              <span className="mx-2">
                <FaRegChartBar fontSize={17} color="#fff" style={{ marginRight: "4px" }} /> Statistics</span>
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const getRowStyle = () => {
    return {
      position: "relative",
      transform: "translateY(0)",
      marginBottom: "5px",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    };
  };

  const onGridReady = (params) => setGridApi(params.api);

  // Export Excel For Safety Advisor
  const onSafetyAdvisorsExport = () => {
    // Get Deep Copy From Main Array to can access to nested Object
    const excelData = JSON.parse(JSON.stringify(itdRowData));

    const excelDataHandeld = excelData?.map((el) => {
      el.Name = el.custodyName;
      el.Safety_advisor = el.safetyAdvisorsCount;
      el.Trainees = el.traineeCount;
      (el.Millage = (el.millage / 1000).toLocaleString() || 0), delete el.email;
      delete el.image;
      delete el.pendingTrainers;
      delete el.SafetyAdvisor;
      delete el.millage;
      delete el._id;
      delete el.__v;
      return {
        ...el,
      };
    });
    convertJsonToExcel(excelDataHandeld, "SafetyAdvisors");
  };

  useEffect(() => {
    divisionId = router.query.id;
    dispatch(divisionDetails(divisionId));
  }, []);

  return (
    <div className="p-2 px-4">
      <div
        className="mt-3"
        style={{
          marginLeft: "auto",
        }}
      >
        <section className="d-flex  pe-4 mb-5 ">
          <span className="header-text me-2">Department</span>
          <span className="fw-bold text-black ">/ Department Details</span>
        </section>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="aggrid__header text-capitalize ">{itdName}</h3>
          <div>
            <button
              onClick={() => onSafetyAdvisorsExport()}
              className="main__button-table "
            >
              <span className="mx-2">Export</span>
              <img src="/white-export-icon.svg" alt="export" />
            </button>
          </div>
        </div>

        <AgGridDT
          columnDefs={itdColumns}
          rowData={!loading ? itdRowData : null}
          overlayLoadingTemplate={loading}
          overlayNoRowsTemplate={loading ? "loading" : "No data"}
          onGridReady={onGridReady}
          paginationPageSize={9}
          getRowStyle={getRowStyle}
        />
      </div>
    </div>
  );
};

export default CustodiesDetails;

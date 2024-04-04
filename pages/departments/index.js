import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { CiViewList } from "react-icons/ci";

/*___________ Components _____________*/
import AgGridDT from "components/AgGridDT";
import { toast } from "react-toastify";
import ItdIcon from "../../components/svgIcons/ItdIcon";
import { FaRegChartBar } from "react-icons/fa";

/*___________ Actions _____________*/
import {
  changeItdItc,
} from "../../lib/slices/dashboardSlice";
import { allDivisions } from "../../lib/slices/custodies";

/*___________ Functions _____________*/
import { convertJsonToExcel } from "../../helpers/helpers";

function Custodies({ setSelectedLabel }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const allCustodiesData = useSelector(
    (state) => state.custodies?.allDivisions
  );

  const [gridApi, setGridApi] = useState(null);
  const getRowStyle = () => {
    return {
      position: "relative",
      transform: "translateY(0)",
      marginBottom: "5px",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    };
  };

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // Table Columns
  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "divisionName",
        minWidth: 260,
        maxWidth: 250,
        cellRenderer: (params) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <ItdIcon /> {params?.data?.divisionName}
            </div>
          );
        },
      },
      {
        headerName: "ITC",
        field: "itcs",
        minWidth: 250,
        maxWidth: 250,
        valueGetter: (params) => params?.data?.itcs?.length,
      },
      {
        headerName: "Safety advisor",
        field: "safetyAdvisorsCount",
        minWidth: 250,
        maxWidth: 250,
        valueGetter: (params) => params?.data?.safetyAdvisorsCount,
      },
      {
        headerName: "Trainees",
        field: "traineeCount",
        minWidth: 250,
        maxWidth: 250,
        valueGetter: (params) => params?.data?.traineeCount,
      },
      {
        headerName: "Millage",
        field: "millage",
        minWidth: 250,
        maxWidth: 250,
        valueGetter: (params) => (params?.data?.millage / 1000).toLocaleString() || 0,
      },
      {
        headerName: "Actions",
        minWidth: 300,
        maxWidth: 250,
        cellRenderer: (params) => (
          <div className="d-flex justify-content-start gap-3 align-items-center">
            <button
              className="main__button-table bg-transparent  " style={{ border: ".5px solid #3668e9ab", color: "#3668E9" }}
              onClick={() => {
                if (params?.data?.itcs?.length) {
                  router.push({
                    pathname: "/departments/[id]",
                    query: { id: params?.data?._id },
                  });
                } else {
                  toast.error("No ITC in this ITD");
                }
              }}
            >
              <CiViewList fontSize={19} color="#3668E9" style={{ marginRight: "4px" }} />
              Details
            </button>
            <button
              onClick={() => {
                setSelectedLabel(params.data.divisionName);
                dispatch(
                  changeItdItc({
                    itd: params?.data?._id,
                    itc: null,
                    label: params.data.divisionName,
                  })
                );
                router.push({
                  pathname: "/",
                  query: { itd: params?.data?._id },
                });
              }}
              className="main__button-table "
            >
              <FaRegChartBar fontSize={17} color="#fff" style={{ marginRight: "4px" }} />
              Statistics
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const onGridReady = (params) => setGridApi(params.api);
  const changeRowDataKeys = (data) => {
    const newArr = data.map((obj) => {
      const newObj = {};
      //You have to add a condition on the Object key name and perform your actions
      Object.keys(obj).forEach((key) => {
        if (key === "divisionName") {
          newObj.Division_Name = obj.divisionName;
        } else if (key === "itcsCount") {
          newObj.ITCs = obj.itcsCount;
        } else if (key === "millage") {
          newObj.millage = obj.millage;
        } else if (key === "traineeCount") {
          newObj.Trainees = obj.traineeCount;
        } else if (key === "safetyAdvisorsCount") {
          newObj.Safety_Advisors = obj.safetyAdvisorsCount;
        } else {
          newObj[key] = obj[key];
        }
      });
      let keys = [];
      Object.keys(newObj).forEach((key) => {
        keys.push(key);
      });
      const order = [
        "Division_Name",
        "ITCs",
        "millage",
        "Trainees",
        "Safety_Advisors",
      ];
      const newOrderdObj = order.reduce((obj, key) => {
        if (!newObj[key]) {
          obj[key] = "N/A";
        } else {
          obj[key] = newObj[key];
        }
        return obj;
      }, {});
      return newOrderdObj;
    });
    return newArr;
  };

  // Export Excel For Safety Advisor
  const onCustodiesExport = () => {
    // Get Deep Copy From Main Array to can access to nested Object
    const excelData = JSON.parse(JSON.stringify(allCustodiesData));
    convertJsonToExcel(changeRowDataKeys(excelData), "Departments Data");
  };

  useEffect(() => {
    dispatch(allDivisions());
  }, []);

  return (
    <div className="p-2 px-4 ">
      <div
        className="mt-3"
        style={{
          marginLeft: "auto",
        }}
      >
        <section className="d-flex justify-content-between pe-2 mb-5">
          <span className="header-text">Departments</span>
        </section>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="aggrid__header text-capitalize">All Departments</h3>

          <div>
            <button
              onClick={() => onCustodiesExport()}
              className="main__button-table "
            >
              <span className="mx-2">Export</span>
              <img src="/white-export-icon.svg" alt="export" />
            </button>
          </div>
        </div>

        <AgGridDT
          columnDefs={columns}
          rowData={allCustodiesData}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          getRowStyle={getRowStyle}
          paginationPageSize={9}
        />
      </div>
    </div>
  );
}

export default Custodies;

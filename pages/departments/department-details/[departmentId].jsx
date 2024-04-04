import { useDispatch, useSelector } from "react-redux";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

/*___________ Components _____________*/
import AgGridDT from "components/AgGridDT";

/*___________ Icons _____________*/
import { FaRegChartBar } from "react-icons/fa";

/*___________ Actions _____________*/
import { custodyDetails } from "../../../lib/slices/custodies";

/*___________ Functions _____________*/
import { convertJsonToExcel } from "../../../helpers/helpers";

const CustodiesDetails = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const custodyID = router.query.departmentId;

  const safetyAdvisorsData = useSelector(
    (state) =>
      state.custodies.custodyDetails?.data?.custodyDetails?.[0]?.SafetyAdvisor
  );

  const traineeData = useSelector(
    (state) => state.custodies.custodyDetails?.data?.custodyDetails?.[0]?.users
  );

  const [gridApi, setGridApi] = useState(null);

  const safetyAdvisorsColumns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "username",
        minWidth: 250
      },
      {
        headerName: "ID",
        field: "idNumber",
        minWidth: 250

      },
      {
        headerName: "Student Mobile Number",
        field: "StudentMobileNumber",
        minWidth: 250

      }, {
        headerName: "Parent Mobile Number",
        field: "ParentMobileNumber",
        minWidth: 250

      },
      {
        headerName: "Email",
        field: "email",
        minWidth: 250

      },
    ],
    []
  );

  const trainerColumns = useMemo(
    () => [
      {
        minWidth: 250,
        headerName: "Name",
        field: "username",
      },
      {
        minWidth: 250,
        headerName: "ID",
        field: "idNumber",
      },
      {
        minWidth: 250,
        headerName: "Total Points",
        field: "totalPoints",
      },
      {
        minWidth: 250,
        headerName: "Email",
        field: "email",
      },
      {
        minWidth: 250,
        headerName: "Student Mobile Number",
        field: "StudentMobileNumber",
      }, {
        minWidth: 250,
        headerName: "Parent Mobile Number",
        field: "ParentMobileNumber",
      },
      {
        minWidth: 250,
        headerName: "Millage",
        field: "millage",
      },
      {
        minWidth: 250,
        headerName: "Actions",
        maxWidth: 250,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center justify-content-start gap-3 mt-1">
            <button
              className=" main__button-table"
              onClick={() => {
                if (params?.data?._id) {
                  router.push({
                    pathname: `/departments/trainee-details/${params?.data?._id}`,
                    // query: { custodyId: params?.data?._id },
                  });
                } else {
                  toast.error("No Trainee Found");
                }
              }}
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
    const excelData = JSON.parse(JSON.stringify(safetyAdvisorsData));
    const excelDataHandeld = excelData.map((el) => {
      el.Name = el.username;
      el.Phone_Number = el.phoneNumber;
      el.Email = el.email;
      el.Role = el.role;
      delete el.email;
      delete el.image;
      delete el.vid;
      delete el.isOnline;
      delete el.idNumber;
      delete el.phoneNumber;
      delete el.role;
      delete el.username;
      delete el._id;
      delete el.id;
      delete el.__v;
      delete el.custodyId;
      return {
        ...el,
      };
    });
    convertJsonToExcel(excelDataHandeld, "SafetyAdvisors");
  };

  // Export Excel For Trainee Table
  const onTraineeExport = () => {
    // Get Deep Copy From Main Array to can access to nested Object
    const excelData = JSON.parse(JSON.stringify(traineeData));
    const excelDataHandeld = excelData.map((el) => {
      el.Name = el.username;
      // el.Phone_Number = el.phoneNumber;
      el.Email = el.email;
      el.Role = "Trainee";
      delete el.email;
      delete el.SerialNumber;
      delete el.image;
      delete el.vid;
      delete el.isOnline;
      delete el.idNumber;
      delete el.phoneNumber;
      delete el.role;
      delete el.username;
      delete el._id;
      delete el.custodyId;
      return {
        ...el,
      };
    });
    convertJsonToExcel(excelDataHandeld, "traineeData");
  };
  useEffect(() => {
    dispatch(custodyDetails(custodyID));
  }, [custodyID]);

  return (
    <>
      <div className="py-3  px-4">
        <div
          className="mt-2"
          style={{
            margin: "auto",
            // minWidth: " 1200px",
          }}
        >
          <section className="d-flex  pe-4 mb-4 ">
            <span className="header-text me-2">Department</span>
            <span className="fw-bold text-black ">/ Department Details</span>
          </section>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="aggrid__header text-capitalize ">Safety advisors</h3>
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
            columnDefs={safetyAdvisorsColumns}
            rowData={safetyAdvisorsData}
            onGridReady={onGridReady}
            paginationPageSize={3}
            getRowStyle={getRowStyle}
            overlayNoRowsTemplate={safetyAdvisorsData == undefined ? "loading" : ""}
          />
        </div>
      </div>

      <div className="py-2  px-4">
        <div
          style={{
            margin: "auto",
            // minWidth: "1200px",
            height: "56px",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="aggrid__header text-capitalize ">Trainees</h3>
            <div>
              <button
                onClick={() => onTraineeExport()}
                className="main__button-table "
              >
                <span className="mx-2">Export</span>
                <img src="/white-export-icon.svg" alt="export" />
              </button>
            </div>
          </div>

          <AgGridDT
            columnDefs={trainerColumns}
            rowData={traineeData}
            onGridReady={onGridReady}
            paginationPageSize={5}
            getRowStyle={getRowStyle}
            overlayNoRowsTemplate={traineeData == undefined ? "loading" : ""}
          />
        </div>
      </div>
    </>
  );
};

export default CustodiesDetails;

import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ReactSelect from "../../components/Select";

/*___________ Components _____________*/
import AgGridDT from "components/AgGridDT";
import { toast } from "react-toastify";

/*___________ Actions _____________*/
import { allCustodies } from "../../lib/slices/custodies";
import { allTrainees } from "../../lib/slices/custodies";

/*___________ Functions _____________*/
import { convertJsonToExcel } from "../../helpers/helpers";

function apprentices() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [custodyDataOption, setCustodyDataOption] = useState(null);
  const [usersData, setUsersData] = useState([]);

  // To Make Filter Select Drobdown
  const allCustodiesData = useSelector(
    (state) => state.custodies?.allCustodies?.data?.custody
  );

  const allTraineeData = useSelector(
    (state) => state.custodies?.allTrainees?.data?.users
  );

  const [gridApi, setGridApi] = useState(null);

  // Table Columns
  const columns = useMemo(
    () => [
      {
        headerName: "Name",
        field: "username",
      },
      {
        headerName: "Last location",
        field: "SafetyAdvisor",
        maxWidth: 300,
      },
      {
        headerName: "ID",
        field: "idNumber",
        maxWidth: 150,
      },
      {
        headerName: "Department",
        // field: "custodyName",
        valueGetter: (params) =>
          params.data.custodyName ? params.data.custodyName : "Not Asigned",
        maxWidth: 150,
      },
      {
        headerName: "Email",
        field: "email",
        maxWidth: 150,
      },
      {
        headerName: "Actions",
        Width: 100,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center justify-content-center  mt-1">
            <button
              onClick={() => {
                router.push({
                  pathname: "/departments/trainee-details/[traineeId]",
                  query: { traineeId: params?.data?._id },
                });
              }}
              className="main__button "
            >
              View Statistics
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  const onGridReady = (params) => setGridApi(params.api);

  const filterData = (departmentId) => {
    if (departmentId) {
      const filterUsers = allTraineeData.filter(
        (el) => el.custodyId === departmentId
      );
      setUsersData(filterUsers);
    }

    if (!departmentId) {
      setUsersData(allTraineeData);
    }
  };

  // Export Excel For Safety Advisor
  const onTraineesExport = () => {
    // Get Deep Copy From Main Array to can access to nested Object
    const excelData = JSON.parse(JSON.stringify(allTraineeData));
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
      delete el.SerialNumber;
      return {
        ...el,
      };
    });
    convertJsonToExcel(excelDataHandeld, "Trainees Data");
  };

  useEffect(() => {
    dispatch(allCustodies());
    dispatch(allTrainees());
  }, []);

  useEffect(async () => {
    const SelectOption = allCustodiesData?.map((e) => ({
      value: e?._id,
      label: e?.custodyName,
    }));
    setCustodyDataOption(SelectOption);
    setUsersData(allTraineeData);
  }, [allCustodiesData, allTraineeData]);

  return (
    <div className="p-2 px-4">
      <div
        className="mt-3"
        style={{
          marginLeft: "auto",
          minWidth: "1200px",
          height: "56px",
        }}
      >
        <section className="d-flex justify-content-between pe-2 mb-5">
          <span className="header-text">Apprentices</span>
        </section>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3 className="aggrid__header text-capitalize">All apprentices</h3>

          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => onTraineesExport()}
              className="main__button "
            >
              Export To Excel
            </button>

            <ReactSelect
              options={custodyDataOption}
              onSelectChange={(departmentId) => filterData(departmentId)}
              placeholder="Departments"
            />
          </div>
        </div>

        <AgGridDT
          columnDefs={columns}
          rowData={usersData}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
}

export default apprentices;

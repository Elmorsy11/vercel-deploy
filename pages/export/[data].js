import AgGridDT from "components/AgGridDT";
import { convertJsonToExcel, handlingRowDataColumn } from "helpers/helpers";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

const Data = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  let totalUsersStored = JSON.parse(localStorage.getItem("TotalUsers"));
  const topDrivers = JSON.parse(localStorage.getItem("topDrivers"));
  const [usersNum, setUsersNum] = useState(totalUsersStored)
  useEffect(() => {

    if (usersNum !== null)
      if (router?.query?.data === "offline") {
        setData(handlingRowDataColumn(usersNum?.offlineUsers, "total users"));
      } else if (router?.query?.data === "online") {
        setData(handlingRowDataColumn(usersNum?.activeUsers, "total users"));
      } else if (router?.query?.data === "topDrivers") {
        setData(handlingRowDataColumn(topDrivers, "total users"));
      } else {
        setData(
          handlingRowDataColumn([
            ...usersNum?.activeUsers,
            ...usersNum?.offlineUsers,
          ], "total users")
        );
      }
  }, [router.query, localStorage.getItem("TotalUsers")]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Check if the storage of totalUsers is Changed
      if (event.key === 'TotalUsers') {
        totalUsersStored = JSON.parse(localStorage.getItem("TotalUsers"))
        setUsersNum(totalUsersStored)
      }
    };
    // Add event listener for storage change
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);



  const excelSheet = () => {
    convertJsonToExcel(
      data,
      router?.query?.data === "topDrivers"
        ? router?.query.data
        : `Total ${router?.query.data}`
    );
  };

  const getRowStyle = () => {
    return {
      position: "relative",
      transform: "translateY(0)",
      marginBottom: "5px",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    };
  };

  const keys = useMemo(() => {
    if (data?.length) return Object?.keys(data[0]);
  }, [data, localStorage.getItem("TotalUsers")]);

  // Table Columns
  const columns = useMemo(() => {
    if (data?.length) {
      // filter to remove _id
      const newColumns = keys?.filter((key) => key !== "_id")
        ?.map((key) => {
          const column = {};
          keys.forEach((k) => {
            column["headerName"] = key.toUpperCase();
            column["field"] = key;
            column["filter"] = 'agTextColumnFilter';
            column["minWidth"] = 250;
            column["valueGetter"] = (params) => {
              return params?.data?.[key] == undefined || params?.data?.[key]?.length == 0
                ? "N/A"
                : params?.data[key]
            }
          });
          return column;
        }
        )
      return [...newColumns,
      {
        headerName: "Action",
        maxWidth: 250,
        minWidth: 250,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center justify-content-start gap-3 mt-1">
            <a
              href={`/departments/trainee-details/${params?.data?._id}`}
              target="_blank"
            >
              <span className=" main__button-table text-white">
                View Profile
              </span>
            </a>
          </div>
        ),
      }];
    }
  }, [data]);


  return (
    <div className="m-4 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="p-2 mb-2 text-capitalize">
          {router?.query?.data === "topDrivers"
            ? router?.query.data
            : `Total ${router?.query.data}`}
        </h5>
        <div>
          <button onClick={excelSheet} className="main__button-table ">
            <span className="mx-2">Export</span>
            <img src="/white-export-icon.svg" alt="export" />
          </button>
        </div>
      </div>

      <AgGridDT columnDefs={columns} rowData={data} getRowStyle={getRowStyle} />
    </div>
  );
};

export default Data;

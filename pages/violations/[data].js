import AgGridDT from "components/AgGridDT";
import ViolationsFilteration from "components/dashboard/ViolationsFilteration";

import {
  changeRowDataKeys,
  convertJsonToExcel,
  handlingRowDataColumn,
} from "helpers/helpers";
import { dashboardInfoData, violationReports } from "helpers/indexDb";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const Data = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [isFilterClear, setIsFilterClear] = useState(false)
  const { violationsReport, violationsReportLoading
  } = useSelector((state) => state?.dashboard)

  const [dashboardInfo, setDashboardInfo] = useState([])
  const [violationsDataState, setViolationsDataState] = useState([])
  useEffect(() => {
    dashboardInfoData.toArray().then(dashboardInfo => {
      setDashboardInfo(dashboardInfo[0])
    });

  }, [router?.query.data])


  useEffect(() => {
    // set data from redux if filtered by date 
    if (violationsReport !== null && !isFilterClear) {
      if (!violationsReportLoading) {
        setViolationsDataState(violationsReport?.violationsReportData)
      }

    }
    // set data from indexDb 
    else {
      violationReports.toArray().then(violationReports => {
        setViolationsDataState(violationReports[0]?.violationsData)
      });

    }
  }, [violationsReportLoading, router?.query.data, isFilterClear]);


  useEffect(() => {

    if (router?.query?.data === "all") {
      const allSheets = Object.values(violationsDataState).flat();
      allSheets?.length > 0 &&
        setData(handlingRowDataColumn(changeRowDataKeys(allSheets)));
      return;
    }

    if (dashboardInfo?.sheets?.[router?.query?.data]?.length > 0) {
      setData(handlingRowDataColumn(violationsDataState?.[router?.query?.data]));
    }

  }, [router?.query, data?.length, dashboardInfo, violationsDataState]);
  const excelSheet = () => {
    convertJsonToExcel(data, `${router?.query.data} Violations`);
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
  }, [data]);
  // Table Columns
  const columns = useMemo(() => {
    if (data?.length) {
      const newColumns = keys?.map((key) => {
        const column = {};
        keys.forEach((k) => {
          column["headerName"] = key.toUpperCase();
          column["field"] = key;
          column["minWidth"] = 250;
        });
        return column;
      });
      return newColumns;
    }
  }, [data]);

  return (
    <div className="m-4 pt-5  violations-section">
      <ViolationsFilteration setIsFilterClear={setIsFilterClear} />
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="p-2 mb-2 text-capitalize">{`${router?.query?.data} Violations`}</h5>
        <div>
          <button onClick={excelSheet} className="main__button-table " style={{ background: "#3668e9" }}>
            <span className="mx-2">Export</span>
            <img src="/white-export-icon.svg" alt="export" />
          </button>
        </div>
      </div>

      <AgGridDT columnDefs={columns} rowData={data} getRowStyle={getRowStyle} overlayNoRowsTemplate={violationsDataState?.length == 0 ? "loading" : ""} />
    </div>
  );
};

export default Data;

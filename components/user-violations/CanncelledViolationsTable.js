import axios from "axios";
import AgGridDT from "components/AgGridDT";
import { convertJsonToExcel } from "helpers/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const CanncelledViolationsTable = ({ id }) => {
  const [data, setData] = useState([]);
  const fetchCancelledViolations = async () => {
    try {
      const res = await axios.get(`/violation/getCancelledViolation

     `);
      setData(res.data.filter((v) => v.vehicleID == id));
    } catch (error) {
      toast.error(error?.data?.enMessage);
    }
  };
  useEffect(() => {
    fetchCancelledViolations();
  }, []);

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
    <div className="my-4 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className="p-2 mb-2 text-capitalize fw-bold">{`Cancelled Violations`}</h3>
        <div>
          <button onClick={excelSheet} className="main__button-table ">
            <span className="mx-2">Export</span>
            <img src="/white-export-icon.svg" alt="export" />
          </button>
        </div>
      </div>

      <AgGridDT
        columnDefs={columns}
        rowData={data}
        getRowStyle={getRowStyle}
        overlayNoRowsTemplate={data?.length == 0 ? "loading" : ""}
      />
    </div>
  );
};

export default CanncelledViolationsTable;

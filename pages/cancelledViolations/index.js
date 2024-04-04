import AgGridDT from "components/AgGridDT";
import ViolationsFilteration from "components/dashboard/ViolationsFilteration";
import { convertJsonToExcel } from "helpers/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const CanncelledViolationsTable = () => {
    const [data, setData] = useState([]);

    const cancelledViolationsStorageData = JSON.parse(localStorage.getItem("cancelledViolations") ?? "[]")

    const excelSheet = () => {
        convertJsonToExcel(data, `Violations`);
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
                    column["minWidth"] = 170;
                });
                return column;
            });
            return newColumns;
        }
    }, [data]);

    const [isFilterClear, setIsFilterClear] = useState(false)
    const { cancelledViolationsData, cancelledViolationsLoading } = useSelector((state) => state.cancelledViolations)

    useEffect(() => {
        // set data from redux if filtered by date 
        if (cancelledViolationsData !== null && !isFilterClear) {
            if (!cancelledViolationsLoading) {
                setData(cancelledViolationsData)
            }
        }
        // set data from localStorage 
        else {
            setData(cancelledViolationsStorageData)
        }
    }, [cancelledViolationsLoading, isFilterClear]);
    return (
        <div className="my-4 pt-5 px-4">
            <ViolationsFilteration
                setIsFilterClear={setIsFilterClear}
            />

            <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="p-2 mb-2 text-capitalize fw-bold">Cancelled Violations</h3>
                <div>
                    <button onClick={excelSheet} className="main__button-table export_btn"
                        disabled={!data.length}>
                        <span className="mx-2">Export</span>
                        <img src="/white-export-icon.svg" alt="export" />
                    </button>
                </div>
            </div>
            <AgGridDT
                columnDefs={columns}
                rowData={data}
                getRowStyle={getRowStyle}
                overlayNoRowsTemplate={cancelledViolationsLoading ? "loading" : data.length == 0 ? "no data" : ""}
            />
        </div>
    );
};

export default CanncelledViolationsTable;

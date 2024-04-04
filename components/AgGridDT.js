import React from "react";
//Ag grid
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
// import "ag-grid-community/styles/ag-theme-alpine-dark.css";
// import { useSelector } from "react-redux";
// import { useTranslation } from "next-i18next";

const AgGridDT = ({
  columnDefs,
  rowData,
  onFirstDataRendered,
  rowHeight,
  onSelectionChanged,
  pagination,
  paginationPageSize,
  paginationNumberFormatter,
  defaultColDef,
  onGridReady,
  suppressMenuHide,
  onCellMouseOver,
  onCellMouseOut,
  overlayNoRowsTemplate,
  suppressExcelExport,
  getRowStyle,
  autoSize,
  overlayLoadingTemplate,
  suppressSizeToFit,
  maxHeight,
}) => {
  // const { darkMode } = useSelector((state) => state.config);
  // const [t, i18] = useTranslation("main")

  return (
    <div
      className={` ${maxHeight && "agGrid__maxHeight"} ag-theme-alpine shadow-xl ${rowData?.length > 0 ? "" : "ag-nodata"} `}
      style={{ maxHeight: maxHeight || "" }}
    >
      <AgGridReact
        rowHeight={rowHeight || 65}
        // enableRtl={i18.language == "ar" ? true : false}
        columnDefs={columnDefs}
        rowData={rowData}
        rowSelection={"multiple"}
        onSelectionChanged={onSelectionChanged || null}
        onCellMouseOver={onCellMouseOver || null}
        onCellMouseOut={onCellMouseOut || null}
        pagination={pagination || true}
        autoSize={autoSize || true}
        domLayout={"autoHeight"}
        suppressExcelExport={suppressExcelExport || true}
        paginationPageSize={paginationPageSize || 10}
        paginationNumberFormatter={paginationNumberFormatter || null}
        onFirstDataRendered={onFirstDataRendered || null}
        defaultColDef={
          defaultColDef || {
            sortable: true,
            flex: 1,
            resizable: true,
            filter: true,
            unSortIcon: true,
          }
        }
        overlayLoadingTemplate={
          overlayLoadingTemplate ||
          `<h3 style="opacity: 0.5">Please wait while your rows are loading</h3>`
        }
        onGridReady={onGridReady || null}
        overlayNoRowsTemplate={
          overlayNoRowsTemplate == "loading"
            ? `<h3 style="opacity: 0.5">Please wait while your rows are loading</h3>`
            : '<img src="/assets/No-data.svg"/>'
        }
        suppressMenuHide={suppressMenuHide || true}
        getRowStyle={getRowStyle || null}
        suppressSizeToFit={suppressSizeToFit || false}
      />
    </div>
  );
};

export default AgGridDT;

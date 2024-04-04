import { useSelector } from "react-redux";
import React from "react";
/*___________ Components _____________*/
import Card from "react-bootstrap/Card";
import SkeletonLoader from "./skeleton-loader";
import DoughnutChart from "./dashboard/Charts/DoughnutChart";
/*___________ Actions _____________*/

function LargeBox({
  title,
  count,
  backgroundColor,
  excelSheet,
  loading,
  total,
  style,
  click,
  trainee,
}) {

  const ok = useSelector((state) => state.dashboard);
  const { dashboardSheetsLoading } = useSelector((state) => state.dashboardSheets)
  return (
    <>
      <Card
        bg="light-blue"
        key={"Dark"}
        text={"Dark"}
        style={{
          background: `#F6F6F6 !important`,
          border: "none",
        }}
        onClick={() => (click ? click(title) : null)}
        className="mb-0  violation-card"
      >
        <Card.Body style={{ paddingTop: "15px" }}>
          {loading ? (
            <SkeletonLoader card />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {style && (
                  <div style={{ maxWidth: "150px", }}>
                    {ok.label ?? "Itds"}
                  </div>
                )}

                <div className="d-flex flex-column justify-content-center  w-100">
                  {title ? (
                    <h5
                      className="fw-bold text-black-50  text-center mb-2"
                      style={{ fontSize: "14px" }}
                    >
                      {title ? title : "Title"}
                    </h5>
                  ) : null}

                  <button
                    role="button"
                    className={`${count && !dashboardSheetsLoading ? "export-btn" : "export-btn__disabled"
                      } ms-auto d-flex align-items-center ${style
                        ? "justify-content-between"
                        : "justify-content-center"
                      } m-auto`}
                    onClick={excelSheet}
                    disabled={dashboardSheetsLoading || !count}
                  >
                    <div style={{ fontSize: "13px" }}>Export</div>

                    <img
                      src="/blue-export-icon.svg"
                      alt="export"
                      className="mx-1"
                    />
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <DoughnutChart
                  style={style}
                  total={total === 0 ? 900 : total}
                  value={count}
                  trainee={trainee}
                />
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default LargeBox;

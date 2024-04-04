import React from "react";
import { Card, Col, Table } from "react-bootstrap";
import Styles from "../../styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";
import moment from "moment";

export default function LatestRides({ lastBookings, showViolationsHandler , showImagesHandler }) {
  const { t } = useTranslation("dashboard");

  return (
    <>
      <Col sm="12">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <h4 className={"card-title " + Styles.head_title}>
              {t("Latest Booking rides")}
            </h4>
          </Card.Header>
          <Card.Body
            style={{
              display: "block",
              height: "400px",
              overflowY: "auto",
            }}
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {[
                    t("#"),
                    `${t("User Image")}`,
                    `${t("Name")}`,
                    `${t("Create Date")}`,
                    `${t("Str Address")}`,
                    `${t("End Address")}`,
                    `${t("Status")}`,
                    `${t("Actions")}`,
                  ].map((ele, i) => (
                    <th key={i}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lastBookings?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-start">{index + 1}</td>
                    <td className="text-start d-flex align-items-center justify-content-center">
                      <img
                        src={item?.User?.Image}
                        alt={item?.User?.UserName}
                        className="img-fluid rounded "
                        style={{
                          height: "50px",
                          width: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="text-start">
                      {item?.User?.UserName || "____"}
                    </td>
                    <td className="text-start">
                      {moment(item?.StartTrip).format(
                        "YYYY-MM-DD hh-mm-ss a"
                      ) || "____"}
                    </td>
                    <td className="text-start">
                      {item?.StartStation?.Address || "____"}
                    </td>
                    <td className="text-start">
                      {item?.EndStation?.Address || "____"}
                    </td>
                    <td className="text-start ">
                      <p
                        style={{
                          borderRadius: "6px",
                          marginBottom: "0px",
                          width: "100px",
                        }}
                        className={`
                        " px-3 px-lg-0  text-white d-flex justify-content-center text-capitalize py-2" 
                        ${
                          item?.Status === "pending"
                            ? "bg-warning"
                            : item?.Status === "rejected"
                            ? "bg-danger"
                            : item?.Status === "finished"
                            ? "bg-success"
                            : item?.Status === "cancelled"
                            ? "bg-danger"
                            : "bg-info"
                        }
                        
                        `}
                      >
                        {item?.Status ? t(item.Status) : "____"}
                      </p>
                    </td>
                    <td className="text-start">
                      {item?.Status === "finished" && (
                        <button
                          onClick={() => showViolationsHandler(item?._id)}
                          className="btn btn-primary px-3 py-1 rounded"
                        >
                          Show Violations
                        </button>
                      )}

                      {item?.gallery?.length > 0 && (
                        <button
                          onClick={() => showImagesHandler(item?._id)}
                          className="btn btn-soft-primary px-3 py-1 rounded text-primary mx-2"
                        >
                          Show Images
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}

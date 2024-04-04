import axios from "axios";
import AgGridDT from "components/AgGridDT";
import CanncelledViolationsTable from "components/user-violations/CanncelledViolationsTable";
import { convertJsonToExcel } from "helpers/helpers";
import { useRouter } from "next/router";
import TraineeModal from "pages/departments/trainee-details/TraineeModal";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Data = () => {
  const router = useRouter();
  const [violationsDataState, setViolationsDataState] = useState(null);
  const [rowData, setRowData] = useState({});
  const [message, setMessage] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleCloseCancelModal = () => {
    setShowCancelModal(!showCancelModal)
    setChangeModalContent(false)
    setMessage("")
  };
  const [validated, setValidated] = useState(false);
  const [changeModalContent, setChangeModalContent] = useState(false)
  const handleInputChange = (e) => {
    setErrorMessage("");
    setMessage(e.target.value);
  };
  const handleData = (data) => {
    handleCloseCancelModal();
    setRowData(data);
  };
  const fetchViolationsData = async (id) => {
    try {
      const res = await axios.get(`/violation/vehViolationHistory?vid=${id}`);
      setViolationsDataState(res.data);
    } catch (error) {
      toast.error(error?.data?.enMessage);
    }
  };
  useEffect(() => {
    let isMounted = false;
    if (!isMounted) fetchViolationsData(router?.query.data);
    isMounted = true;
  }, [router?.query.data]);
  const excelSheet = () => {
    convertJsonToExcel(violationsDataState, `${router?.query.data} Violations`);
  };
  const getRowStyle = () => {
    return {
      position: "relative",
      transform: "translateY(0)",
      marginBottom: "5px",
      boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
    };
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return setErrorMessage("Message is Required");
    } else {
      setValidated(true);
    }
    try {
      const res = await axios.post("violation/cancelViolation", {
        action: "cancelled",
        vehicleID: rowData.VehicleID,
        violationType: rowData.violationType,
        points: rowData.violationPoints,
        violationDate: rowData.violationDate,
        cancellationReason: message,
      });
      toast.success(`${rowData.violationType} is Cancelled successfully`);
      setRowData({});
      setShowCancelModal(false);
      setMessage("");
      fetchViolationsData(router?.query.data);
    } catch (error) {
      toast.error(error?.response?.data?.enMessage || "Something went Wrong");
    }
  };

  const columns = useMemo(
    () => [
      {
        headerName: "VehicleID",
        field: "VehicleID",
        minWidth: 150,
      },
      {
        headerName: "Start Date",
        field: "StrDate",
        minWidth: 150,
      },
      {
        headerName: "End Date",
        field: "EndDate",
        minWidth: 150,
      },
      {
        headerName: "Serial Number",
        field: "SerialNumber",
        minWidth: 150,
      },
      {
        headerName: "Plate Number",
        field: "PlateNumber",
        minWidth: 150,
      },
      {
        headerName: "ITC",
        field: "GroupName",
        minWidth: 150,
      },
      {
        headerName: "Violation Date",
        field: "violationDate",
        minWidth: 150,
      },
      {
        headerName: "Reason",
        field: "cancellationReason",
        minWidth: 100,
        maxWidth: 120,

        cellRenderer: (params) => {
          return (
            <div className="d-flex align-items-center justify-content-center  mt-0">
              {params.data.cancellationReason == "N/A" || !params.data.cancellationReason ? (
                <div className="  text-center text-secondary w-100 rounded" >
                  N/A
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleData(params.data);
                    setChangeModalContent(true)
                  }}

                  className="rounded w-100"
                  style={{
                    color: "rgb(54, 104, 233)",
                    background: "rgb(217, 227, 243)",
                  }}
                >
                  Reason
                </button>
              )}
            </div>
          )
        },
        minWidth: 150,
      },
      {
        headerName: "Violation Type",
        field: "violationType",
        minWidth: 200,
      },
      // {
      //   headerName: "Violation Points",
      //   field: "violationPoints",
      //   minWidth: 150,
      // },
      {
        headerName: "Actions",
        minWidth: 200,
        cellRenderer: (params) => (
          <div className="d-flex align-items-center justify-content-center  mt-1">
            {params.data.cancelled ? (
              <div className="  text-center text-light main__button cancelled-label w-100">
                cancelled
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleData(params.data);
                  setChangeModalContent(false)
                }}

                className="main__button "
                style={{ background: "#BF2929", border: "1px solid transparent" }}
                disabled={params.data.cancelled}
              >
                Cancel Violation
              </button>
            )}
          </div>
        ),
      },
    ],
    [violationsDataState]
  );

  return (
    <div className="my-4 mx-2 pt-5">
      {
        <TraineeModal
          handleClose={handleCloseCancelModal}
          handleShow={showCancelModal}
          title={
            rowData.violationType
              ? `${rowData.violationType} | ${rowData.DisplayName}`
              : "Cancel Violation"
          }
        >
          {changeModalContent ? (
            <article>
              <h5 className=" mb-2 " style={{ fontSize: "16px", fontWeight: "400" }}>
                Reason of Cancelation
              </h5>
              <div className="border  p-2 rounded" style={{ height: "100px", borderColor: "#eee" }}>
                <p>  {rowData.cancellationReason} </p>
              </div>
              <button className=" w-100 mt-3 rounded p-2 text-white" style={{
                background: "#3668E9"
              }}
                onClick={() => {
                  handleCloseCancelModal()
                  setChangeModalContent(false)
                }}

              > Done </button>
            </article>
          ) : (<Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Form.Group className="position-relative" controlId="messageInput">
              <label htmlFor="message" className="fs-5 mb-2 fw-semibold">
                Reason of Cancelation
              </label>
              <Form.Control
                as="textarea"
                rows={3}
                value={message}
                onChange={handleInputChange}
                required
                placeholder="Type you reason here!"
              />
            </Form.Group>
            {errorMessage && (
              <Alert className="mt-2" variant="danger">
                {errorMessage}
              </Alert>
            )}
            <Button
              type="Submit"
              variant="info"
              className=" mt-3  py-2 fw-bold  justify-content-center w-100"
            >
              Cancel Violation
            </Button>
          </Form>)}

        </TraineeModal>
      }
      <div className=" mt-5 d-flex justify-content-between align-items-center mb-2">
        <h3 className="p-2 mb-2 text-capitalize fw-bold">
          {`${violationsDataState !== null && violationsDataState[0]?.DisplayName || "User"} Violations`}</h3>
        <div>
          <button onClick={excelSheet} className="main__button-table export_btn" disabled={!violationsDataState?.length} >
            <span className="mx-2">Export</span>
            <img src="/white-export-icon.svg" alt="export" />
          </button>
        </div>
      </div>

      <AgGridDT
        columnDefs={columns}
        rowData={violationsDataState}
        getRowStyle={getRowStyle}
        overlayNoRowsTemplate={violationsDataState == null ? "loading" : ""}
      />
      {/* <CanncelledViolationsTable id={router?.query.data} /> */}
    </div>
  );
};

export default Data;

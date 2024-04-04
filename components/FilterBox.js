import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import React from "react";
/*___________ Components _____________*/
import Card from "react-bootstrap/Card";
import SkeletonLoader from "./skeleton-loader";
import DoughnutChart from "./dashboard/Charts/DoughnutChart";
import { CheckTreePicker, TreePicker } from "rsuite";
import { toast } from "react-toastify";
/*___________ Actions _____________*/
import {
  changeItdItc,
  dashboardInfo,
  topDrivers,
  weeklyTrendsChart,
} from "../lib/slices/dashboardSlice";
import { useRouter } from "next/router";
import { set } from "firebase/database";
import { custodyDetails } from "lib/slices/custodies";
import { useTrainees } from "context/TraineesContext";
import { useSession } from "next-auth/client";


function FliterBox({
  title,
  count,
  backgroundColor,
  excelSheet,
  loading,
  total,
  style,
  click,
}) {
  const dispatch = useDispatch();

  const [itc, setItc] = useState([]);
  const { fetchCustodyDetails } = useTrainees();
  const [session] = useSession();
  const divisonData = useSelector((state) => state.dashboard?.divisonData);
  const itcId = useSelector((state) => state.dashboard);
  const isSafetyAdvisor = session?.user?.data?.role === 'safety-advisor'

  useEffect(() => {
    const tempItc = [];
    //  get all Itc of ITD
    divisonData?.forEach((element) => {
      if (element.children) {
        element.children.forEach((item) => {
          tempItc.push(item.label);
          setItc(tempItc);
        });
      }
    });
  }, [itcId.label]);

  return (
    <>
      {title ? (
        <h5 className="fw-bold text-black-50 text-center my-3 ">
          {title ? title : "Title"}
        </h5>
      ) : null}
      <Card
        bg="light-blue"
        key={"Dark"}
        text={"Dark"}
        style={{
          background: `${backgroundColor ? backgroundColor : "#09c"}`,
          border: "1px solid transparent",
        }}
        onClick={() => {
          dispatch(changeItdItc({ label: itcId.label ? itcId.label : "All ITD" }));
          if (itc.includes(itcId.label)) {
            if (itcId?.itc) fetchCustodyDetails(itcId?.itc);
          }
          // if a safety advisor 
          else if (isSafetyAdvisor) {
            fetchCustodyDetails(session.user?.data?.custodyId)
          }
        }}
        className="mb-2 py-2 min-box hover h-100"
      >
        <Card.Body
          style={{
            cursor: "pointer",
            height: "100%",
            display: "flex",
            padding: "1rem",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {loading ? (
            <SkeletonLoader card />
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {style && (
                  <div
                    style={{
                      maxWidth: "150px",
                      overFlow: "scroll",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {itcId.label ?? "ITD"}
                  </div>
                )}


              </div>

              <DoughnutChart style={style} total={total} value={count} main />
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default FliterBox;

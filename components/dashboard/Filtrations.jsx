import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { TbFilterCancel } from "react-icons/tb";
/*___________ Components _____________*/
import { DateRangePicker } from "react-date-range";
import { MdKeyboardArrowDown, MdOutlineFilterAlt } from "react-icons/md";
/*___________ Actions _____________*/
import {
  TotalUsers,
  changeItdItc,
  dashboardInfo,
  setDivsionData,
  topDrivers,
  violationsReport,
  weeklyTrendsChart,
} from "../../lib/slices/dashboardSlice";
import { allTrainees, clearCustodyDetails } from "../../lib/slices/custodies";
/*___________ Data _____________*/
import { useRouter } from "next/router";
import { TreePicker } from "rsuite";
import axios from "axios";
import { useSession } from "next-auth/client";
import {
  resetFilteredDate,
  setFilteredDate,
  setFilteredItcId,
  setFilteredItcLabel,
  toggleDateChanged,
  filterSubmitted,
  resetFilteredData,
} from "lib/slices/filterMaindashboardSlice";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";
import HeaderNotifications from "./HeaderNotifications";
import { useTrainees } from "context/TraineesContext";
import { SlCalender } from "react-icons/sl";
import { dashboardSheets } from "lib/slices/violationsSheetsSlice";

export const Filtrations = ({
  setSelectedLabel,
  selectedLabel,
  setBreadCrumbs,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [session] = useSession();
  const isSafetyAdvisor = session?.user?.data?.role === "safety-advisor";
  const safetyAdvisorCustodyId = session?.user?.data?.custodyId;
  const safetyAdvisorCustodyName = session?.user.data?.custodyName;
  const [showPicker, setShowPicker] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setTrainees } = useTrainees();

  const {
    isFilteredDateChanged,
    filteredDate,
    filteredItcLabel,
    filteredItcId,
  } = useSelector((state) => state.filterMaindashboard);
  const handelDateChange = (item) => {
    const {
      dashboardInfo: { startDate, endDate, key },
    } = item;
    //  to handle endDate to end of day not start of day
    let endDateToEndDay = moment(endDate, "ddd MMM DD YYYY HH:mm:ss");
    endDateToEndDay.set({ hour: 23, minute: 59, second: 59 });
    let formattedEndDate = endDateToEndDay.format("YYYY-MM-DDTHH:mm:ss");
    let endDateForItem = new Date(formattedEndDate);

    const dateItem = {
      startDate,
      key,
      endDate: endDateForItem,
    };
    // setIsNotHasDate(false)
    dispatch(setFilteredDate([dateItem]));
  };

  const fetchRequestsHandler = (safetyAdvisorCustodyId) => {

    dispatch(violationsReport({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(dashboardInfo({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(TotalUsers({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(topDrivers({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(weeklyTrendsChart({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(allTrainees({ itc: safetyAdvisorCustodyId ?? null }));
    dispatch(cancelledViolations({ itc: safetyAdvisorCustodyId ?? null }))
    dispatch(dashboardSheets({ itc: safetyAdvisorCustodyId ?? null }))
  }

  const handleClearSearch = () => {
    //    statement to prevent click action if there is no filter
    if (
      isFilteredDateChanged ||
      filteredItcId ||
      filteredItcLabel !== "All ITD"
    ) {
      dispatch(
        setFilteredItcLabel({
          label: isSafetyAdvisor ? safetyAdvisorCustodyName : "All ITD",
        })
      );

      // dispatch(setFilteredItcId({ id: null }));
      dispatch(resetFilteredData());
      // setSelectedLabel(null);
      setTrainees(null)
      // isSubmitted to make sure there is a filter
      if (isSubmitted) {
        setIsSubmitted(false);
        setShowPicker(false);
        dispatch(toggleDateChanged(false));
        if (isSafetyAdvisor) {
          dispatch(
            changeItdItc({
              itc: safetyAdvisorCustodyId,
              itd: null,
              label: safetyAdvisorCustodyName,
            })
          );
          fetchRequestsHandler(safetyAdvisorCustodyId)
        } else {
          router.replace("/");
          fetchRequestsHandler()
          dispatch(changeItdItc({ itc: null, itd: null, label: null }));
          localStorage.removeItem("Itd");
        }
      }
      // setIsNotHasDate(true)
      dispatch(clearCustodyDetails());
    }
  };

  const { itd, itc, label, divisonData } = useSelector(
    (state) => state.dashboard
  );
  const [allItds, setAllItds] = useState([]);
  useEffect(() => {
    const itdList = divisonData?.map((division) => division.label);
    setAllItds(itdList);
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedLabel(
      isSafetyAdvisor ? safetyAdvisorCustodyName : selectedLabel
    );
    const data = {};

    data.startDate = moment(filteredDate[0]?.startDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    data.endDate = moment(filteredDate[0]?.endDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    data.itc = isSafetyAdvisor
      ? safetyAdvisorCustodyId
      : filteredItcId
        ? filteredItcId
        : itc !== "null" && !allItds.includes(selectedLabel)
          ? itc
          : null;
    // to clear bread crumbs and selected label
    if (filteredItcId) {
      setBreadCrumbs(["Home", filteredItcLabel]);
      setSelectedLabel(null);
    }
    dispatch(filterSubmitted());
    //  set itd  in two cases if route has itd by clicking on sidebar route  || if itd stored at localStorage by clicking on itd card

    data.itd =
      filteredItcId && selectedLabel !== "All ITD"
        ? null
        : router.query.itd
          ? router.query.itd
          : (itc == "null" || itc == null) &&
            label !== null &&
            label !== "All ITD"
            ? itd
            : null;
    // if not safety advisor
    dispatch(
      changeItdItc({
        itc: isSafetyAdvisor ? safetyAdvisorCustodyId : filteredItcId,
        label:
          filteredItcLabel !== "All ITD"
            ? filteredItcLabel
            : selectedLabel ?? null,
      })
    );

    setShowPicker(false);
    dispatch(clearCustodyDetails());
    // dispatch(setDates({ startDate: data.startDate, endDate: data.endDate }));
    dispatch(dashboardInfo(data));
    dispatch(TotalUsers(data));
    dispatch(topDrivers(data));
    dispatch(weeklyTrendsChart(data));
    dispatch(violationsReport(data));
    dispatch(allTrainees(data));
    dispatch(cancelledViolations(data))
    dispatch(dashboardSheets(data))

    dispatch(toggleDateChanged(true));
    setIsSubmitted(true);
  };
  // Select functions
  const [treeData, setTreeData] = useState([]);
  const [opend, setOpend] = useState(false);
  const treePickerRef = useRef(null);

  function OtherCLickHandler(event) {

    if (
      treePickerRef.current && !treePickerRef?.current?.contains(event.target) &&
      !event.target.classList.contains("nodeParent") &&
      !event.target.classList.contains("rs-tree-node")
      && !event.target.classList.contains("rs-tree-nodes")
    ) {
      setOpend(false);
    }
  }
  useEffect(() => {
    document.addEventListener("click", OtherCLickHandler);
    return () => {
      document.removeEventListener("click", OtherCLickHandler);
    };
  }, []);
  useEffect(() => {
    dispatch(
      setFilteredItcLabel({
        label: isSafetyAdvisor ? safetyAdvisorCustodyName : "All ITD",
      })
    );
    if (!isSafetyAdvisor) {
      axios.get("/division/getDivisionsFilter").then((res) => {
        dispatch(setDivsionData(res.data));
        setTreeData(JSON.parse(JSON.stringify(res.data.treeData)));
      });
    }
  }, [isSafetyAdvisor]);
  function customIcon(nodeData) {
    return <img src={"/assets/Vector.png"} width={6} alt="icon" />;
  }
  function renderCustomNode(nodeData) {
    return (
      <div
        className={`${nodeData.children ? "nodeParent custom-node" : " custom-node"
          }`}
        onClick={() => {
          if (nodeData.children) {
            // setOpend(true);
            document
              .querySelector(`[data-ref=String_${nodeData.value}]`)
              .click();
            return;
          }
          // setOpend(false);
          // setLabel(nodeData.label);
          dispatch(setFilteredItcLabel({ label: nodeData.label }));
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px ",
          width: "100%",
        }}
      >
        <span
          className={`${nodeData.children ? "nodeParent " : " "}`}
          style={{ fontSize: "15px" }}
        >
          {nodeData.label}
        </span>
        {/* <div
          className={`${
            nodeData.children ? "nodeParent percentage" : "percentage "
          }`}
        >
          {nodeData.parentage}
        </div> */}
      </div>
    );
  }

  const CustomMenu = ({ menuRef, ...menuProps }) => {
    // Define a custom function to handle the button click
    const handleClick = () => {
      dispatch(
        dashboardInfo({
          itc: itc,
          itd: itd,
          startDate: ok.startDate,
          endDate: ok.endDate,
        })
      );
      dispatch(TotalUsers({ itc: itc, itd: itd }));
      dispatch(
        weeklyTrendsChart({
          itc: itc,
          itd: itd,
          startDate: ok.startDate,
          endDate: ok.endDate,
        })
      );
    };
    //  style={{ padding: "5px 16px" }}
    return (
      <div ref={menuRef} {...menuProps}>
        {/* Render the default menu */}
        {menuProps.props.children}
        {/* Add a button at the bottom */}
      </div>
    );
  };

  function handleSelectChange(value, item) {
    if (!allItds.includes(item?.target?.innerText)) {
      dispatch(setFilteredItcId({ id: value }));
    }

    if (item.children) {
      // If the selected item has children, prevent the selection from being updated
      return;
    }

    // Update the state with the selected value
  }
  return (
    <div className="d-flex flex-column justify-content-center flex-md-row  align-items-center gap-2 ga-md-0">
      <HeaderNotifications />
      <span className=" d-none d-xl-block " style={{ color: "#ACACAF" }}>Filter by</span>
      <Form
        onSubmit={handleSubmit}
        className="d-flex gap-2 align-items-center flex-column flex-md-row"
      >
        <div className="position-relative">
          <button
            className=" main__button z-3 px-2 ps-3 d-flex gap-1"
            style={{
              height: "35px",
              background: "#575757"
            }}
            type="button"
            onClick={() => setShowPicker(!showPicker)}
          >
            {isFilteredDateChanged
              ? `${moment(filteredDate[0]?.startDate).format(
                "YYYY-MM-DD"
              )} to ${moment(filteredDate[0]?.endDate).format("YYYY-MM-DD")}`
              : <SlCalender fontSize={18} />}
            <MdKeyboardArrowDown fontSize={18} />
          </button>
          {showPicker ? (
            <DateRangePicker
              className="datePicker"
              onChange={handelDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={filteredDate}
              maxDate={moment().toDate()}
              direction="vertical"
            />
          ) : null}
        </div>
        {session.user?.data?.role !== "safety-advisor" && (
          <div
            ref={treePickerRef}
            style={{ maxWidth: "135px", overFlow: "scroll" }}
          >
            <TreePicker
              // checkStrictly
              data={treeData}
              cascade={false}
              onChange={handleSelectChange}
              renderTreeNode={renderCustomNode}
              renderMenu={(menuProps) => <CustomMenu {...menuProps} />}
              searchable={false}
              onClick={() => setOpend((perv) => !perv)}
              open={opend}
              value={filteredItcLabel}
              placeholder={filteredItcLabel}
              preventOverflow={false}
              className="check-tree-picker"
              renderTreeIcon={customIcon}
            />
          </div>
        )}
        <Button
          type="Submit"
          className="px-3 py-2 d-block    text-white filter-btn ">
          Filter <MdOutlineFilterAlt style={{ fontSize: "16px" }} />
        </Button>
        <Button
          type="button"
          onClick={handleClearSearch}
          variant="none"
          className="px-2 py-2 d-block clear_filter-btn "
          style={{ height: "35px" }}
        >
          Clear  <TbFilterCancel style={{ fontSize: "14px" }} />
        </Button>
      </Form>
    </div>
  );
};

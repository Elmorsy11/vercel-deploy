import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import moment from "moment";

/*___________ Components _____________*/
import { DateRangePicker } from "react-date-range";
import { MdKeyboardArrowDown, MdOutlineFilterAlt } from "react-icons/md";
/*___________ Actions _____________*/
import {
    violationsReport,
} from "../../lib/slices/dashboardSlice";
/*___________ Data _____________*/
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import { cancelledViolations } from "lib/slices/cancelledViolationsSlice";
import { TbFilterCancel } from "react-icons/tb";
const ViolationsFilteration = ({ setIsFilterClear }) => {
    const session = useSession()
    const safetyAdvisorCustodyId = session[0]?.user?.data?.custodyId
    const dispatch = useDispatch()
    const router = useRouter()

    // const [changed, setChanged] = useState(false);
    const isSafetyAdvisor = session[0]?.user?.data?.role === "safety-advisor"
    const [showPicker, setShowPicker] = useState();
    const { violationsReportLoading } = useSelector((state) => state?.dashboard)
    const { cancelledViolationsLoading } = useSelector((state) => state.cancelledViolations)
    const itdId = JSON.parse(localStorage.getItem("Itd"))
    // filteration of violation report
    const [date, setDate] = useState([
        {
            startDate: moment().subtract(30, 'days').toDate(),
            endDate: moment().toDate(),
            key: "dashboardInfo",
        },
    ]);
    const handelDateChange = (item) => {
        const { dashboardInfo: { startDate, endDate, key } } = item
        //  to handle endDate to end of day not start of day
        let endDateToEndDay = moment(endDate, "ddd MMM DD YYYY HH:mm:ss");
        endDateToEndDay.set({ hour: 23, minute: 59, second: 59 });
        let formattedEndDate = endDateToEndDay.format("YYYY-MM-DDTHH:mm:ss");
        let endDateForItem = new Date(formattedEndDate)
        const dateItem = {
            startDate,
            key,
            endDate: endDateForItem
        }
        setDate([dateItem]);


    };
    const handleClearSearch = () => {
        setDate([
            {
                startDate: moment().subtract(30, 'days').toDate(),
                endDate: moment().toDate(),
                key: "dashboardInfo",
            },
        ]);
        setIsFilterClear(true)
        setShowPicker(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {};
        data.startDate = moment(date[0].startDate).format("YYYY-MM-DDTHH:mm:ss");
        data.endDate = moment(date[0].endDate).format("YYYY-MM-DDTHH:mm:ss");
        data.itc = isSafetyAdvisor ? safetyAdvisorCustodyId : null
        data.itd = itdId?.value ?? null
        data.sheets = router?.query.data !== "all" ? router?.query.data : null
        setShowPicker(false);
        setIsFilterClear(false)
        if (router.asPath === "/cancelledViolations") {
            if (!cancelledViolationsLoading) dispatch(cancelledViolations(data))
        } else {
            if (!violationsReportLoading) dispatch(violationsReport(data));
        }
    };
    return (
        <div className="d-flex flex-column justify-content-end mb-4 flex-md-row  align-items-center gap-2 ga-md-0">
            <span className="fw-bold text-muted d-block">Filter by</span>

            <Form
                onSubmit={handleSubmit}
                className="d-flex gap-2 align-items-center flex-column flex-md-row"
            >
                <div className="position-relative">
                    <button
                        className=" main__button z-3 "

                        type="button"
                        onClick={() => setShowPicker(!showPicker)}
                    >
                        {`${moment(date[0].startDate).format(
                            "YYYY-MM-DD"
                        )} to ${moment(date[0].endDate).format("YYYY-MM-DD")}`
                        }
                        <MdKeyboardArrowDown fontSize={18} />
                    </button>
                    {showPicker ? (
                        <DateRangePicker
                            className="datePicker"
                            onChange={handelDateChange}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            ranges={date}
                            maxDate={moment().toDate()}
                            direction="vertical"
                        />
                    ) : null}
                </div>

                <Button
                    type="Submit"
                    variant="none"
                    className="  py-2 fw-bold  justify-content-center text-white filter-btn px-3"
                    style={{ width: "100px", background: "#3668e9", borderRadius: "6px" }}
                >
                    {(violationsReportLoading || cancelledViolationsLoading) && <div className="spinner-border text-light " role="status"> </div>}
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


export default ViolationsFilteration
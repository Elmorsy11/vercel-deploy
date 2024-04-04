import { useSelector } from "react-redux";
import SearchInput from "../shared/SearchInput";
import { Filtrations } from "./Filtrations";
import IncentivePoints from "components/incentivePoints";

function DashboardHeader({ title = "Dashboard", selectedLabel, setSelectedLabel, setBreadCrumbs, breadCrumbs }) {
  const usersNum = useSelector((state) => state.dashboard.TotalUsers);
  const handleMileageResult = (num) => {
    if (num > 1000000) return Math.round(num).toLocaleString().slice(0, 5);
    if (num < 1000000) return num.toLocaleString();
  };

  const totalNumLoading = useSelector(
    (state) => state.dashboard.TotalUsersLoading
  );

  // Boxes Data
  const firstSectionBoxs = [
    {
      id: 3,
      title: "incentive points",
      count: handleMileageResult(usersNum?.incentivePoints),
      backgroundColor: "#EAEEF3",
      bottomTitle: usersNum?.incentivePoints,
    },
  ];
  return (
    <nav className="d-flex justify-content-between  py-2 px-4 gap-2 align-items-center mb-3 dashboard-nav position-sticky top-0" >
      <div className="d-flex flex-column ">
        <span className="header-text">{title}</span>
        <SearchInput />
      </div>
      {firstSectionBoxs.map((box) => (
        <IncentivePoints
          header
          key={box.id}
          title={box.title}
          count={box.count}
          loading={totalNumLoading}
          bottomTitle={box.bottomTitle}
          precentage={box.precentage}
          iconWidth
          iconHieght
        />
      ))}
      <Filtrations setSelectedLabel={setSelectedLabel} selectedLabel={selectedLabel} breadCrumbs={breadCrumbs} setBreadCrumbs={setBreadCrumbs} />
    </nav>
  );
}

export default DashboardHeader;

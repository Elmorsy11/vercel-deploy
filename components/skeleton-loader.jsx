import { Skeleton } from "@mui/material";

const SkeletonLoader = ({ card, chart, height, traineeCard, circle }) => {
  return (
    <>
      {circle && <Skeleton variant="circular" width={250} height={250} />}
      {card && (
        <div className="d-flex justify-content-between align-items-center" style={{width:"100%" ,height:"100%"}}>
          <div style={{ width: "100%" }}>
            <Skeleton variant="rectangular" sx={{ width: "100px" }} />
            <Skeleton variant="text" sx={{ width: "80%" }} />
            <Skeleton variant="text" />
          </div>
        </div>
      )}
      {chart && (
        <div className="d-flex justify-content-between align-items-center">
          <Skeleton
            variant="rectangular"
            sx={{ width: "100%" }}
            height={height}
          />
        </div>
      )}
      {traineeCard && (
        <div className="d-flex align-items-center w-100">
          <Skeleton
            variant="circular"
            sx={{ width: "158px", height: "158px", marginRight: "30px" }}
          />
          <div style={{ width: "40%" }}>
            <Skeleton
              variant="rectangular"
              sx={{ width: "100px", marginBottom: "20px" }}
            />
            <Skeleton variant="text" sx={{ width: "20%" }} />
          </div>
        </div>
      )}
    </>
  );
};

export default SkeletonLoader;

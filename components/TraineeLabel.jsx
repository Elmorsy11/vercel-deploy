import React from "react";

const TraineeLabel = ({ userName, image, custodyName }) => {
  return (
    <div className="d-flex gap-3 align-items-center border-bottom pb-0">
      <img
        src={image}
        alt={userName}
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
      <div className="d-flex flex-column gap-2">
        <p className="text-darkm mb-1">{userName}</p>
        <p className="text-muted mb-1">{custodyName}</p>
      </div>
    </div>
  );
};

export default TraineeLabel;

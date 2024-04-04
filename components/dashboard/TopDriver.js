import Image from "next/image";
import React from "react";
import crown from "public/assets/Medieval Crown.png";

import ApiLoader from "../ApiLoader";

function TopDriver({
  imgSrc,
  middle,
  imgWidth,
  imgHieght,
  borderColor,
  loading,
}) {
  return (
    <div className="d-flex flex-column align-items-center p-1">
      {middle ? (
        <Image src={crown} alt="Icon" width={32} height={32} className="mb-1" />
      ) : (
        ""
      )}
      {loading ? (
        <ApiLoader />
      ) : (
        <img
          src={imgSrc}
          alt="profile"
          width={imgWidth ? imgWidth : 60}
          height={imgHieght ? imgHieght : 60}
          // className="top-driver-pic"
          style={{
            border: "2px solid",
            borderRadius: "50px",
            borderColor: borderColor,
          }}
        />
      )}
    </div>
  );
}

export default TopDriver;

import Card from "react-bootstrap/Card";
import Image from "next/image";
import iconGift from "./../public/gift 1.svg";
import ArrowIcon from "./../public/arrow-up.svg";

import SkeletonLoader from "./skeleton-loader";
function IncentivePoints({
  title,
  count,
  imgSrc,
  backgroundColor,
  boxWidth,
  iconWidth,
  iconHieght,
  loading,
  bottomTitle,
  precentage,
  header,
}) {
  return (
    <section
      // bg="light-blue"
      key={"Dark"}
      text={"Dark"}
      style={{
        width: boxWidth,
        background: `${backgroundColor ? backgroundColor : ""}`,
        border: "none",
        height: "100%",
        cursor: "pointer",
        boxShadow: "none",
      }}
      className=" min-box"
      onClick={() => window.open("/export/Incentive points")}
    >
      <Card.Body
        className="p-0"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // width: "100%",
        }}
      >
        {loading ? (
          <SkeletonLoader card />
        ) : (
          <div
            className={`d-flex ${!header && "flex-column"
              } justify-content-between align-items-center gap-1`}
          >
            <h3 className="min-box-title mb-0 text-capitalize ">
              {<Image src={iconGift} width={30} height={30} />}
            </h3>
            <div>
              <span
                className="min-box-count min-box-count-font "
                style={{
                  fontSize: "13px",
                  marginBottom: "5px",
                  textAlign: "center",
                  lineHeight: "14px",
                }}
              >
                Total Incentive points
              </span>
              <span
                className="min-box-count min-box-count-font "
                style={{
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(180deg, #3B8F01 0%, #033000 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <Image src={ArrowIcon} width={13}></Image>
                {count}
              </span>
            </div>
          </div>
        )}
      </Card.Body>
    </section>
  );
}

export default IncentivePoints;

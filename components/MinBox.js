import { Col, Collapse, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Image from "next/image";
import SkeletonLoader from "./skeleton-loader";
function MinBox({
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
}) {
  return (
    <Card
      bg="light-blue"
      key={"Dark"}
      text={"Dark"}
      style={{
        width: boxWidth,
        background: `${backgroundColor ? backgroundColor : "#09c"}`,
        border: "none",
        height: "100%",
      }}
      className="mb-2 min-box"
    >
      <Card.Body
        className="px-4"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {loading ? (
          <SkeletonLoader card />
        ) : (
          <div className="d-flex flex-column justify-content-between align-items-center">
            <h3 className="min-box-title mb-3 text-capitalize">{title}</h3>
            <span className="min-box-count min-box-count-font ">{count}</span>
            {bottomTitle && (
              <span className="min-box-title mb-3 text-capitalize">
                {bottomTitle}
              </span>
            )}
            {precentage && (
              <span className="text-success fw-bold fs-2 text-capitalize mb-2">
                {precentage}
              </span>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default MinBox;

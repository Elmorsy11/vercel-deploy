import { useEffect } from "react";
import { useRef } from "react";
import { TiWarning } from "react-icons/ti";
import { useSelector } from "react-redux";


const Notifications = ({ isActiveSideBar }) => {
  const animationRef = useRef()
  const iconRef = useRef()
  const { notifications } = useSelector(state => state.violationsNotifications)
  let notificationLength = notifications?.length

  useEffect(() => {
    if (notificationLength > 0) {
      iconRef.current.classList.add('warning-icon')
      animationRef.current.classList.add('pulse-animation')
    }
    const animationTimeOut = setTimeout(() => {
      animationRef.current.classList.remove('pulse-animation')
      iconRef.current.classList.remove('warning-icon')
    }, 7000)

    return () => clearTimeout(animationTimeOut)
  }, [notificationLength])
  let notificationIcon;
  let circleBg = notificationLength > 0 ? "#F5A0A0" : "#A1C08C"
  let circleShadow = notificationLength > 0 ? "#FAC8C8" : "#DBE7D3"
  let iconColor = notificationLength > 0 ? "#E10000" : "#4D9F15"
  let circleDiminsion = isActiveSideBar ? "45px" : notificationLength > 0 ? "85px" : "75px";
  notificationIcon = (
    <div id="notification" ref={animationRef} className="d-flex align-items-center justify-content-center position-relative rounded-circle" style={{
      width: isActiveSideBar ? "60px" : "105px",
      height: isActiveSideBar ? "60px" : "105px"
    }}>
      <span style={{ animationDelay: "0s" }}></span>
      <span style={{ animationDelay: "1s" }}></span>
      <span style={{ animationDelay: "2s" }}></span>
      <span style={{ animationDelay: "3s" }}></span>
      <span style={{ animationDelay: "4s" }}></span>
      <div style={{
        background: circleBg, width: circleDiminsion, height: circleDiminsion,
        boxShadow: ` 0 0 0 ${isActiveSideBar ? "10px" : "15px"} ${circleShadow}`,
        transition: "all .1s ease-in-out",
        zIndex: 3
      }} className="rounded-circle d-flex align-items-center justify-content-center position-relative" >
        <div ref={iconRef}        >
          <TiWarning color={iconColor} style={{ fontSize: isActiveSideBar ? "35px" : notificationLength > 0 ? "55px" : "40px", transition: "all ease-in-out .1s" }} />
        </div>
      </div>
    </div >

  );
  return (
    <div className="d-flex justify-content-center mb-2 mt-3 position-relative">
      {notificationIcon}
    </div>
  );
};

export default Notifications;

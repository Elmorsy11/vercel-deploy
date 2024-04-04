// import dynamic from "next/dynamic";
// import React from "react";
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
// import Battery0BarIcon from "@mui/icons-material/Battery0Bar";
// import MailOutlineIcon from "@mui/icons-material/MailOutline";
// import MapIcon from "@mui/icons-material/Map";
// import SpeedIcon from "@mui/icons-material/Speed";
// import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
// const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
//   ssr: false,
// });
// const NormalPopup = React.memo(({ user, mainDashboard }) => {
//   return (
//     <Popup
//       style={mainDashboard ? { width: "320px" } : null}
//       position={[user?.data?.Latitude, user?.data?.Longitude]}
//       closeButton={false}
//     >
//       <div className="popup p-4">
//         <div className="popup-profile mb-4">
//           <div className="popup__image">
//             <img src={user.user.image?.url} alt="" />
//           </div>
//           <div className="popup__info">
//             <div>
//               <h3
//                 style={{
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   lineHeight: "12px",
//                 }}
//               >
//                 {user.user.username}
//               </h3>
//               <p>{mainDashboard ? user.user.idNumber : user.user.email}</p>
//             </div>
//             <div className="popup__info__Role">
//               <span>{user.user.role}</span>
//             </div>
//           </div>
//         </div>
//         <div className="popup_data">
//           {!mainDashboard && (
//             <div className="popup__data__item">
//               <PersonOutlineIcon
//                 style={{ fontSize: "30px", color: "#5E86ED" }}
//               />
//               <span>
//                 {" "}
//                 <span className="text-black-50">ID Number :</span>{" "}
//                 {user.user.idNumber}
//               </span>
//             </div>
//           )}
//           {!mainDashboard && (
//             <div className="popup__data__item">
//               <MailOutlineIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
//               <span>
//                 {" "}
//                 <span className="text-black-50">Email :</span> {user.user.email}
//               </span>
//             </div>
//           )}{" "}
//           <div className="popup__data__item">
//             <MapIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
//             <span>
//               {" "}
//               <span className="text-black-50">Total Millage :</span>{" "}
//               {user.data?.Mileage}
//             </span>
//           </div>
//           {!mainDashboard && (
//             <div className="popup__data__item">
//               <Battery0BarIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
//               <span>
//                 {" "}
//                 <span className="text-black-50">Battery :</span>
//                 Battery : {user.data?.IsPowerCutOff ? "OFF" : "ON"}
//               </span>
//             </div>
//           )}
//           <div className="popup__data__item">
//             <SpeedIcon style={{ fontSize: "30px", color: "#5E86ED" }} />
//             <span>
//               {" "}
//               <span className="text-black-50"> Speed :</span>
//               {user.data?.Speed}
//             </span>
//           </div>
//           <div className="popup__data__item Adress">
//             <FmdGoodOutlinedIcon
//               style={{ fontSize: "30px", color: "#5E86ED" }}
//             />
//             <span>
//               {" "}
//               <span className="text-black-50"> Address :</span>{" "}
//               {user.data?.Address}
//             </span>
//           </div>
//         </div>
//       </div>
//     </Popup>
//   );
// });

// export default NormalPopup;

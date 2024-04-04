import React, { useEffect } from "react";
import VerticalNav from "./vertical-nav";
import Scrollbar from "smooth-scrollbar";
import { useSelector, useDispatch } from "react-redux";
import { leave, sidebarMini, toggle } from "../lib/slices/toggleSidebar";
import { useRouter } from "next/router";

const Sidebar = ({ setSelectedLabel, selectedLabel, setBreadcrumbs }) => {
  const isActiveSideBar = useSelector((state) => state.toggleMenu.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Scrollbar.init(document.getElementById("my-scrollbar"));
    router.events.on("routeChangeComplete", () => dispatch(sidebarMini()));
  }, [dispatch, router.events]);

  const handleToggleMenu = () => {
    dispatch(toggle());
  };

  return (
    <aside
      className={`sidebar sidebar-default navs-rounded-all  ${isActiveSideBar && "sidebar-mini"
        }  `}
    >
      <div
        style={{
          zIndex: 999,
        }}
        className="sidebar-toggle shadow-lg"
        data-toggle="sidebar"
        data-active="true"
        onClick={handleToggleMenu}
        id="show-mobile-menu"
      >
        <i className="icon d-flex align-items-center justify-content-center">
          <svg
            width="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.25 12.2744L19.25 12.2744"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </i>
      </div>
      <div
        className="sidebar-body pt-0 px-0 h-100"
      >
        <div className="collapse navbar-collapse h-100 " id="sidebar">
          <VerticalNav setBreadcrumbs={setBreadcrumbs} setSelectedLabel={setSelectedLabel} selectedLabel={selectedLabel} isActiveSideBar={isActiveSideBar} />

        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

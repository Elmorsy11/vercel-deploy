import "../helpers/plugins/fullscreen/Control.FullScreen.css";
import "../styles/globals.scss";
import store from "../lib";
import { Provider } from "react-redux";
import React, { useEffect, useState } from "react";
import Script from "next/script";
import Router from "next/router";
import SSRProvider from "react-bootstrap/SSRProvider";
import NextNprogress from "nextjs-progressbar";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "react-bootstrap";
import AuthGuard from "../components/authGuard";
import { GTMPageView } from "../utils/gtm.ts";
import { library } from "@fortawesome/fontawesome-svg-core";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ToastContainer } from "react-toastify";
import "../styles/app.css";
import "rsuite/dist/rsuite.min.css";
import Chart from "chart.js/auto";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";

import {
  faCheckSquare,
  faChevronDown,
  faChevronRight,
  faFile,
  faFolder,
  faFolderOpen,
  faMinusSquare,
  faPlusSquare,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import TraineesContext from "context/TraineesContext";

library.add(
  faCheckSquare,
  faSquare,
  faChevronRight,
  faChevronDown,
  faPlusSquare,
  faMinusSquare,
  faFolder,
  faFolderOpen,
  faFile
);

function MyApp({ Component, pageProps }) {
  const [, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);

  useEffect(() => {
    const handleStart = (url) => {
      url !== Router.pathname ? setLoading(true) : setLoading(false);
    };
    const handleComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);
    const setSize = function () {
      const docStyle = document.documentElement.style;
      window.innerWidth < 425
        ? (docStyle.fontSize = `${((window.innerWidth * 0.1122) / 3).toFixed(
          1
        )}px`)
        : (docStyle.fontSize = "16px");
    };
    setSize();
    window.addEventListener("resize", setSize);
    window.addEventListener("orientationchange", setSize);

    const handleRouteChange = (url) => GTMPageView(url);
    Router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
      Router.events.off("routeChangeComplete", handleComplete);
    };
  }, []);

  return (
    <ThemeProvider>
      <SSRProvider>
        <Provider store={store}>
          stage dev  check 22
          <NextNprogress
            color="#3668E9"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
          />
          <Script
            async
            defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-qWPc8xQrA-D8TSiNBpjLYBBsS29oU0U"
          ></Script>
          <TraineesContext>
            <AuthGuard
              selectedLabel={selectedLabel}
              setSelectedLabel={setSelectedLabel}
              breadcrumbs={breadcrumbs}
              setBreadcrumbs={setBreadcrumbs}
            >
              <ToastContainer
                position="top-center"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />

              <Component
                {...pageProps}
                selectedLabel={selectedLabel}
                setSelectedLabel={setSelectedLabel}
                breadcrumbs={breadcrumbs}
                setBreadcrumbs={setBreadcrumbs}
              />

            </AuthGuard>
          </TraineesContext>
        </Provider>

      </SSRProvider>
    </ThemeProvider>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main"])),
    },
  };
}
// export default MyApp
export default appWithTranslation(MyApp);

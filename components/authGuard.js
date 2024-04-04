import React, { useEffect } from "react";
import { Provider, useSession } from "next-auth/client";
import Router, { useRouter } from "next/router";
import Layout from "layout";
import { useDispatch } from "react-redux";
import Loader from "./loader";
import config from "config/config";
import axios from "axios";

const AuthGuard = ({ children, selectedLabel, setSelectedLabel, setBreadcrumbs }) => {
  const [session, loading] = useSession();
  const hasUser = !!session?.user;
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading && !hasUser) {
      Router.push("/auth/signin");
      delete axios.defaults.headers.common.Authorization;
    }
    return () => {
      axios.defaults.headers.common.Authorization = `Bearer ${session?.user?.token}`;

      axios.defaults.baseURL =
        window.location.href.includes("stage") ||
          window.location.href.includes("localhost")
          ?
          // "http://192.168.1.27:5000/api/v1/"
          "https://sr-itc-dev-api-hcr64pytia-uc.a.run.app/api/v1/"
          : "https://itc-api-hcr64pytia-uc.a.run.app/api/v1/";
    };
  }, [loading, hasUser, session, dispatch]);

  if ((loading || !hasUser) && router.pathname !== "/auth/signin") {
    return <Loader />;
  }
  return (
    <Provider
      options={{
        clientMaxAge: 0,
        keepAlive: 0,
      }}
      session={session}
    // refetchInterval={5}
    // Re-fetches session when window is focused
    // refetchOnWindowFocus={true}
    >
      {router.pathname !== "/auth/signin" ? (
        <Layout selectedLabel={selectedLabel} setSelectedLabel={setSelectedLabel} setBreadcrumbs={setBreadcrumbs} >{children}</Layout>
      ) : (
        children
      )}
    </Provider>
  );
};
export default AuthGuard;

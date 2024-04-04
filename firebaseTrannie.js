import firebase, { initializeApp } from "firebase/app";
import config from "config/config";

import { getDatabase, onValue, ref } from "firebase/database";

const firebaseConfig = {
    databaseURL: "https://saferoad-srialfb.firebaseio.com",
  };
  const App = initializeApp(firebaseConfig, "updatefb");
  export const db = getDatabase(App);
  
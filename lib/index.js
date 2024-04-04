import { configureStore } from "@reduxjs/toolkit";
import ToggleMenuSlice from "./slices/toggleSidebar";
import ConfigSlice from "./slices/config";
import ToggleAddMarkerRoutingMachineSlice from "./slices/toggleAddMarkerRoutingMachine";
import ToggleHeaderSlice from "./slices/toggle-header";
import StreamDataSlice from "./slices/StreamData";
import dashboardSlice from "./slices/dashboardSlice";
import custodiesSlice from "./slices/custodies";
import filterMaindashboard from "./slices/filterMaindashboardSlice";
import cancelledViolationsSlice from "./slices/cancelledViolationsSlice";
import notificationSlice from "./slices/notificationSlice";
import dashboardSheetsSlice from "./slices/violationsSheetsSlice";

export default configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    toggleMenu: ToggleMenuSlice,
    config: ConfigSlice,
    toggleAddMarkerRoutingMachine: ToggleAddMarkerRoutingMachineSlice,
    ToggleHeader: ToggleHeaderSlice,
    streamData: StreamDataSlice,
    dashboard: dashboardSlice,
    custodies: custodiesSlice,
    filterMaindashboard,
    cancelledViolations: cancelledViolationsSlice,
    violationsNotifications: notificationSlice,
    dashboardSheets: dashboardSheetsSlice
  },
});

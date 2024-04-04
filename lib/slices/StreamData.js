import { createSlice } from "@reduxjs/toolkit";
import UseStreamHelper from "../../helpers/streamHelper";

export const StreamData = createSlice({
  name: "StreamData",
  initialState: {
    VehFullData: [],
    VehTotal: {},
  },
  reducers: {
    addFullVehData: (state, { payload }) => {
      const { CalcVstatus } = UseStreamHelper();
      const FullVehData = payload.map((l) => {
        return { ...l, VehicleStatus: CalcVstatus(l) };
      });
      state.VehFullData = [...FullVehData];
    },

    countVehTotal: (state) => {
      const { groupBykey } = UseStreamHelper();
      const statusGroups = groupBykey(state.VehFullData, "VehicleStatus");
      const VehStatusGroups = groupBykey(state.VehFullData, "Status");
      state.VehTotal = {
        totalVehs: state.VehFullData.length,
        noshow: VehStatusGroups["noshow"]?.length ?? 0,
        late: VehStatusGroups["late"]?.length ?? 0,
        idle: VehStatusGroups["idle"]?.length ?? 0,
        started: VehStatusGroups["started"]?.length ?? 0,

        activeVehs:
          state.VehFullData.length -
          (statusGroups[5]?.length || 0 + statusGroups[600]?.length || 0),
        offlineVehs:
          (statusGroups[5]?.length || 0) + (statusGroups[600]?.length || 0), //
        idlingVehs: statusGroups[2]?.length ?? 0, //
        RunningVehs: statusGroups[1]?.length ?? 0, //
        stoppedVehs: statusGroups[0]?.length ?? 0, //
        ospeedVehs: statusGroups[101]?.length ?? 0, //
        osspeedVehs: statusGroups[100]?.length ?? 0, //
        invalidVehs: statusGroups[203]?.length ?? 0, //
      };
    },

    UpdateVehicle: (state, { payload }) => {
      state.VehFullData[
        state.VehFullData.findIndex(
          (x) => x?.SerialNumber == payload?.SerialNumber
        )
      ] = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { addFullVehData, countVehTotal, UpdateVehicle } =
  StreamData.actions;

export default StreamData.reducer;

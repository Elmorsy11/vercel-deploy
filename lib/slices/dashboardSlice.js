import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
export const source = axios.CancelToken.source();

export const dashboardInfo = createAsyncThunk(
  "dashbroad/dashboardInfo",
  async ({ itd = null, itc = null, startDate = null, endDate = null }, thunkAPI) => {
    try {
      const url = `dashboard/mainDashboard`;
      const params = {
        itd: itd,
        itc: itc,
        startDate: startDate,
        endDate: endDate,
      };
      const res = await axios.get(url, { params, cancelToken: source.token });
      return { dashboardInfo: res.data, startDate, endDate };
    }
    catch (error) {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else {
        return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)
      }

    }
  }
);

// handling violationsReport request
export const violationsReport = createAsyncThunk(
  "dashbroad/violationsReport",
  async ({ itd = null, itc = null, startDate = null, endDate = null, sheets = null }, thunkAPI) => {
    try {
      const url = `dashboard/violationsReport`;
      const params = {
        itd: itd,
        itc: itc,
        startDate,
        endDate,
        sheets,
      };
      const res = await axios.get(url, { params, cancelToken: source.token });

      return { violationsReportData: res.data, startDate, endDate };
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

    }
  }
);

export const setDivsionData = createAction("dashboard/setDivsionData");
export const changeItdItc = createAction("dashboard/changeItdItc");
export const setDates = createAction("dashboard/setDates");

export const topDrivers = createAsyncThunk(
  "dashbroad/topDrivers",
  async ({ itd = null, itc = null, startDate = null, endDate = null }, thunkAPI) => {
    try {
      const url = "dashboard/topDrivers";
      const params = {
        itd: itd,
        itc: itc,
        startDate: startDate,
        endDate: endDate,
      };
      const res = await axios.get(url, { params, cancelToken: source.token });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

    }
  }
);

export const TotalUsers = createAsyncThunk(
  "dashbroad/totalUsers",
  async ({ itd = null, itc = null }, thunkAPI) => {
    try {
      const url = "dashboard/totalUsers";
      const params = {
        itd: itd,
        itc: itc,
      };
      const res = await axios.get(url, { params, cancelToken: source.token });
      return res;
    } catch (error) {
      // toast.error(`Request Chart Has Error`);
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `Request Chart Has Error`)

    }
  }
);


export const weeklyTrendsChart = createAsyncThunk(
  "dashbroad/weeklyTrendsChart",
  async ({ itd = null, itc = null, startDate = null, endDate = null }, _) => {
    try {
      const url = "dashboard/weeklyTrends";
      const params = {
        itd: itd,
        itc: itc,
        startDate: startDate,
        endDate: endDate,
      };
      const res = await axios.get(url, { params, cancelToken: source.token });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `Request Chart Has Error`)
    }
  }
);

export const dashboardSlice = createSlice({
  name: "dashboard",
  reducers: {
    setDashBoardInfo: (state, action) => {
      state.dashboardInfo = action.payload;
    },
  },
  initialState: {
    dashboardInfo: null,
    dashboardInfoLoading: false,
    divisonData: [],
    topDrivers: null,
    topDriversLoading: false,
    itc: null,
    itd: null,
    TotalUsers: null,
    TotalUsersLoading: false,
    itdsData: null,
    // ratings: null,
    // ratingsLoading: false,
    label: null,
    startDate: null,
    endtDate: null,
    weeklyTrends: null,
    weeklyTrendsLoading: false,

    violationsReport: null,
    violationsReportLoading: false,

  },
  extraReducers: (builder) => {
    builder.addCase(setDates, (state, action) => {
      // Update the state with the payload of the action

      state.startDate = action.payload.startDate;
      state.endtDate = action.payload.endDate;
    });
    // Dashboard : DashboardInfo
    builder.addCase(dashboardInfo.pending, (state, action) => {
      state.dashboardInfoLoading = true;
    });
    builder.addCase(dashboardInfo.fulfilled, (state, action) => {
      state.dashboardInfo = action.payload?.dashboardInfo;
      state.startDate = action.payload?.startDate;
      state.endtDate = action.payload?.endDate;
      state.dashboardInfoLoading = false;
    });
    builder.addCase(dashboardInfo.rejected, (state, action) => {
      state.dashboardInfoLoading = false;
      toast.error(action.payload)

    });
    //  violations Report
    builder.addCase(violationsReport.pending, (state, action) => {
      state.violationsReportLoading = true;
    });
    builder.addCase(violationsReport.fulfilled, (state, action) => {
      state.violationsReport = action.payload;
      state.startDate = action.payload?.startDate;
      state.endtDate = action.payload?.endDate;
      state.violationsReportLoading = false;
    });
    builder.addCase(violationsReport.rejected, (state, action) => {
      state.violationsReportLoading = false;
      toast.error(action.payload)

    });


    // Dashboard : Top Drivers
    builder.addCase(topDrivers.pending, (state, action) => {
      state.topDriversLoading = true;
    });
    builder.addCase(topDrivers.fulfilled, (state, action) => {
      state.topDriversLoading = false;
      state.topDrivers = action.payload;
    });
    builder.addCase(topDrivers.rejected, (state, action) => {
      state.topDriversLoading = false;
      toast.error(action.payload)

    });
    builder.addCase(TotalUsers.pending, (state, action) => {
      state.TotalUsersLoading = true;

    });
    builder.addCase(TotalUsers.fulfilled, (state, action) => {
      state.TotalUsersLoading = false;
      state.TotalUsers = action.payload.data;
    });
    builder.addCase(TotalUsers.rejected, (state, action) => {
      state.TotalUsersLoading = false;
      toast.error(action.payload)

    });
    // Dashboard : Ratings
    builder.addCase(weeklyTrendsChart.pending, (state, action) => {
      state.weeklyTrendsLoading = true;
    });
    builder.addCase(weeklyTrendsChart.fulfilled, (state, action) => {
      state.weeklyTrendsLoading = false;
      state.weeklyTrends = action.payload;
    });
    builder.addCase(weeklyTrendsChart.rejected, (state, action) => {
      state.weeklyTrendsLoading = false;
      toast.error(action.payload)

    });
    builder.addCase(changeItdItc, (state, action) => {
      if (action.payload.itd) {
        state.itd = action.payload.itd;
      }
      if (action.payload.itc) {
        state.itc = action.payload.itc;
      }
      // localStorage.setItem("label", action.payload.label)
      state.label = action.payload.label;
    });
    builder.addCase(setDivsionData, (state, action) => {
      state.divisonData = action.payload.treeData;
    });

    // // Dashboard : Ratings
    // builder.addCase(dashboardRatings.pending, (state, action) => {
    //   state.ratingsLoading = true;
    // });
    // builder.addCase(dashboardRatings.fulfilled, (state, action) => {
    //   state.ratingsLoading = false;
    //   state.ratings = action.payload;
    // });
    // builder.addCase(dashboardRatings.rejected, (state, action) => {
    //   state.ratingsLoading = false;
    // });
  },
});

export default dashboardSlice.reducer;
export const { setDashBoardInfo } = dashboardSlice.actions;

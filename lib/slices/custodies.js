import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const allDivisions = createAsyncThunk(
  "custodies/allDivisions",
  async (_, thunkAPI) => {
    try {
      const url = `division/getDivision`;
      const res = await axios.get(url);
      return res.data.divisions;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

    }
  }
);

export const divisionDetails = createAsyncThunk(
  "custodies/divisionDetails",
  async (divisionId, thunkAPI) => {
    try {
      const url = `division/getDivision/${divisionId}`;
      const res = await axios.get(url);
      return res.data.division;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

    }
  }
);

export const allCustodies = createAsyncThunk(
  "custodies/allCustodies",
  async (city, thunkAPI) => {
    try {
      const url = `user/getallCustodys`;
      const params = {
        city: city,
      };
      const res = await axios.get(url, { params });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)


    }
  }
);

export const custodyDetails = createAsyncThunk(
  "custodies/custodyDetails",
  async (custodyID, thunkAPI) => {
    try {
      const url = `user/CustodyDetails/${custodyID}`;
      const res = await axios.get(url);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

    }
  }
);

export const custodyStatistics = createAsyncThunk(
  "custodies/custodyStatisticsViolations",
  async (custodyId, thunkAPI) => {
    try {
      const url = `dashboard/vechViolations`;
      const params = {
        custodyId: custodyId,
      };
      const res = await axios.get(url, { params });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)


    }
  }
);

export const allTrainees = createAsyncThunk(
  "custodies/allTrainees",
  async ({ itd = null, itc = null }, thunkAPI) => {
    try {
      const url = `user/getAllTrainers`;
      const params = {
        itd,
        itc
      }
      const res = await axios.get(url, { params });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

    }
  }
);

export const custodyTranieeStatistcs = createAsyncThunk(
  "custodies/custodyTranieeStatistcs",
  async ({ traineeID, startDate = null, endDate = null }, thunkAPI) => {
    try {
      const url = `dashboard/vechViolations`;
      const params = {
        userId: traineeID,
        startDate: startDate,
        endDate: endDate,
      };
      const res = await axios.get(url, { params });
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)


    }
  }
);

export const custodiesSlice = createSlice({
  name: "custodies",
  reducers: {
    // empty custodyDetails in clear filter
    clearCustodyDetails: (state, action) => {
      state.custodyDetails = null;
    },
  },
  initialState: {
    allDivisions: null,
    allDivisionsLoading: false,

    divisionDetails: null,
    divisionDetailsLoading: false,

    allCustodies: null,
    allCustodiesLoading: false,

    custodyDetails: null,
    custodyDetailsLoading: false,

    custodyStatistics: null,
    custodyLoading: false,

    allTrainees: null,
    allTraineesLoading: false,

    custodyTranieeStatistcs: null,
    custodyTranieeLoading: false,
  },
  extraReducers: (builder) => {
    // Custodies : Division Details
    builder.addCase(divisionDetails.pending, (state, action) => {
      state.divisionDetailsLoading = true;
      state.divisionDetails = null;
    });
    builder.addCase(divisionDetails.fulfilled, (state, action) => {
      state.divisionDetailsLoading = false;
      state.divisionDetails = action.payload;
    });
    builder.addCase(divisionDetails.rejected, (state, action) => {
      state.divisionDetailsLoading = false;
      toast.error(action.payload)
    });

    // Custodies : Division Details
    builder.addCase(allDivisions.pending, (state, action) => {
      state.allDivisionsLoading = true;
      state.allDivisions = null
    });
    builder.addCase(allDivisions.fulfilled, (state, action) => {
      state.allDivisionsLoading = false;
      state.allDivisions = action.payload;
    });
    builder.addCase(allDivisions.rejected, (state, action) => {
      state.allDivisionsLoading = false;
      toast.error(action.payload)
    });

    // Custodies : All Custodies
    builder.addCase(allCustodies.pending, (state, action) => {
      state.allCustodiesLoading = true;
      state.allCustodies = null
    });
    builder.addCase(allCustodies.fulfilled, (state, action) => {
      state.allCustodiesLoading = false;
      state.allCustodies = action.payload;
    });
    builder.addCase(allCustodies.rejected, (state, action) => {
      state.allCustodiesLoading = false;
      toast.error(action.payload)
    });

    // Custodies : Custody Details
    builder.addCase(custodyDetails.pending, (state, action) => {
      state.custodyDetailsLoading = true; state.custodyDetails = null
    });
    builder.addCase(custodyDetails.fulfilled, (state, action) => {
      state.custodyDetailsLoading = false;
      state.custodyDetails = action.payload;
    });
    builder.addCase(custodyDetails.rejected, (state, action) => {
      state.custodyDetailsLoading = false;
      toast.error(action.payload)
    });

    // Custodies : Custody Statiscts Data
    builder.addCase(custodyStatistics.pending, (state, action) => {
      state.custodyLoading = true; state.custodyStatistics = null;
    });
    builder.addCase(custodyStatistics.fulfilled, (state, action) => {
      state.custodyLoading = false;
      state.custodyStatistics = action.payload;
    });
    builder.addCase(custodyStatistics.rejected, (state, action) => {
      state.custodyLoading = false;
      toast.error(action.payload)
    });

    // Custodies : All Trainees Data
    builder.addCase(allTrainees.pending, (state, action) => {
      state.allTraineesLoading = true; state.allTrainees = null
    });
    builder.addCase(allTrainees.fulfilled, (state, action) => {
      state.allTraineesLoading = false;
      state.allTrainees = action.payload;
    });
    builder.addCase(allTrainees.rejected, (state, action) => {
      state.allTraineesLoading = false;
      toast.error(action.payload)
    });

    // Custodies : Custody Traniee Data
    builder.addCase(custodyTranieeStatistcs.pending, (state, action) => {
      state.custodyTranieeLoading = true;
      state.custodyTranieeStatistcs = null
    });
    builder.addCase(custodyTranieeStatistcs.fulfilled, (state, action) => {
      state.custodyTranieeLoading = false;
      state.custodyTranieeStatistcs = action.payload;
    });
    builder.addCase(custodyTranieeStatistcs.rejected, (state, action) => {
      state.custodyTranieeLoading = false;
      toast.error(action.payload)
    });
  },
});

export default custodiesSlice.reducer;
export const { clearCustodyDetails } = custodiesSlice.actions;

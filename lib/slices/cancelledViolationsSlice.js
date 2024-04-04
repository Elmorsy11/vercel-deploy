import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";


export const cancelledViolations = createAsyncThunk(
    "dashbroad/cancelledViolations",
    async ({ itd = null, itc = null, startDate = null, endDate = null }, thunkAPI) => {
        try {
            const url = `/violation/getCancelledViolation`;
            const params = {
                itd: itd,
                itc: itc,
                startDate: startDate,
                endDate: endDate,
            };
            const res = await axios.get(url, { params });
            return { cancelledViolations: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)

        }
    }
);


export const cancelledViolationsSlice = createSlice({
    name: "dashboard",
    initialState: {
        cancelledViolationsData: null,
        cancelledViolationsLoading: false,
    },
    extraReducers: (builder) => {
        builder.addCase(cancelledViolations.pending, (state, action) => {
            state.cancelledViolationsLoading = true;
            state.cancelledViolationsData = null
        });
        builder.addCase(cancelledViolations.fulfilled, (state, action) => {
            state.cancelledViolationsData = action.payload?.cancelledViolations;
            state.cancelledViolationsLoading = false;
        });
        builder.addCase(cancelledViolations.rejected, (state, action) => {
            state.cancelledViolationsLoading = false;
            toast.error(action.payload)

        });
    }
});

export default cancelledViolationsSlice.reducer;

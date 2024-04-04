import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
export const source = axios.CancelToken.source();

export const dashboardSheets = createAsyncThunk(
    "dashbroad/dashboardSheets",
    async ({ itd = null, itc = null, startDate = null, endDate = null }, thunkAPI) => {
        try {
            const url = `dashboard/mainDashSheets`;
            const params = {
                itd: itd,
                itc: itc,
                startDate: startDate,
                endDate: endDate,
            };
            const res = await axios.get(url, { params, cancelToken: source.token });
            return res
        } catch (error) {
            if (axios.isCancel(err)) {
                console.log('Request canceled', err.message);
            } else {
                return thunkAPI.rejectWithValue(error?.response?.data?.message || error?.response?.data.enMessage || `some thing went wrong`)
            }

        }
    }
);



export const dashboardSheetsSlice = createSlice({
    name: "dashboardSheets",

    initialState: {
        sheets: null,
        dashboardSheetsLoading: false,

    },
    extraReducers: (builder) => {
        builder.addCase(dashboardSheets.pending, (state, action) => {
            state.dashboardSheetsLoading = true;
            state.sheets = null
        });
        builder.addCase(dashboardSheets.fulfilled, (state, action) => {
            state.sheets = action.payload?.data;
            state.dashboardSheetsLoading = false;
        });
        builder.addCase(dashboardSheets.rejected, (state, action) => {
            state.dashboardSheetsLoading = false;
            state.sheets = null;
            toast.error(action.payload)
        });

    },
});

export default dashboardSheetsSlice.reducer;

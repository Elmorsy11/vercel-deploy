import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
// filter button at main dashboard 
// reset data when click on sidebar button || breadCrumb 
export const filterMaindashboardSlice = createSlice({
    name: 'filterMaindashboard',
    initialState: {
        isFilteredDateChanged: false,
        filteredDate: [
            {
                startDate: moment().subtract(24, "hours").toDate(),
                endDate: moment().toDate(),
                key: "dashboardInfo",
            },
        ],
        filteredItcLabel: null,
        filteredItcId: null,
        isSubmitted: false,
    },
    reducers: {
        toggleDateChanged: (state, action) => {
            state.isFilteredDateChanged = action.payload
        },
        setFilteredDate: (state, action) => {
            state.filteredDate = action.payload
        },
        resetFilteredData: (state) => {
            state.filteredDate = [
                {
                    startDate: moment().subtract(24, "hours").toDate(),
                    endDate: moment().toDate(),
                    key: "dashboardInfo",
                },
            ],
                state.isFilteredDateChanged = false
            state.filteredItcId = null
            state.isFilteredDateChanged = false
        },
        setFilteredItcLabel: (state, action) => {
            state.filteredItcLabel = action.payload?.label
        },
        setFilteredItcId: (state, action) => {
            state.filteredItcId = action.payload?.id
        },
        filterSubmitted: (state, action) => {
            state.isSubmitted = !state.isSubmitted
        }
    },
})

// Action creators are generated for each case reducer function
export const { toggleDateChanged, setFilteredDate, resetFilteredData, setFilteredItcLabel, setFilteredItcId, filterSubmitted } = filterMaindashboardSlice.actions

export default filterMaindashboardSlice.reducer
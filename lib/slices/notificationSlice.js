import { createSlice } from "@reduxjs/toolkit";


export const notificationSlice = createSlice({
    name: "notification",

    initialState: {
        notifications: [],
        notificationsCount: 0,
        shownNotifications: []
    },
    reducers: {
        setNotifications: (state, action) => {
            const isExist = state.notifications.find((notify) => {
                return notify.data.newData.SerialNumber == action.payload.newData.SerialNumber
            })
            const NotificationNotSeenLength = state.shownNotifications.filter((item) => !item.isSeen).length + 1
            if (!isExist) {
                state.notificationsCount = NotificationNotSeenLength
                state.notifications.unshift({ data: action.payload, isSeen: false })
                if (state.shownNotifications.length >= 30) {
                    state.shownNotifications.pop()
                    state.shownNotifications.unshift({ data: action.payload, isSeen: false })
                } else {
                    state.shownNotifications.unshift({ data: action.payload, isSeen: false })
                }
            }
        },
        // make  notifications as all read
        setAllNotificationSeen: (state, action) => {
            state.shownNotifications = state.shownNotifications.map((item) => {
                return { ...item, isSeen: true }
            })
            state.notificationsCount = 0
        },
        // make one notification as read
        setNotifiySeen: (state, action) => {
            const idx = state.notifications.findIndex((item) => item.data.user._id == action.payload)
            const notificationNotSeenLength = state.shownNotifications.filter((item) => !item.isSeen).length
            state.notificationsCount = state.shownNotifications[idx]?.isSeen == false ?
                notificationNotSeenLength - 1 : notificationNotSeenLength
            state.shownNotifications[idx].isSeen = true
        }
    }

});

export default notificationSlice.reducer;
export const { setNotifications, setNotifiySeen, setAllNotificationSeen } = notificationSlice.actions;

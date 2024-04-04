import { Dexie } from 'dexie'

export const myDatabase = new Dexie("Dashboard")
myDatabase.version(1).stores({
    dashboardInfoData: "id",
    violationReports: "id"
})

export const { dashboardInfoData, violationReports } = myDatabase
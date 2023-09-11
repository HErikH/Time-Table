import { configureStore } from "@reduxjs/toolkit";
import timeTableReducer from "../features/timTableSlice"

export default configureStore({
    reducer: {
        timeTable: timeTableReducer,
    }
})
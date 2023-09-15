import { configureStore } from "@reduxjs/toolkit";
import timeTableReducer from "../features/timTableSlice"
import classesSliceReducer from "../features/classesSlice";

export default configureStore({
    reducer: {
        timeTable: timeTableReducer,
        classes: classesSliceReducer,
    }
})
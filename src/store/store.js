import { configureStore } from "@reduxjs/toolkit";
import timeTableReducer from "../features/timTableSlice"
import classesSliceReducer from "../features/classesSlice";
import subjectsSliceReducer from "../features/subjectsSlice";
import teachersSliceReducer from "../features/teachersSlice";
import lessonsSliceReducer from "../features/lessonsSlice";
import dragDropSliceReducer from "../features/dragDropSlice";

export default configureStore({
    reducer: {
        timeTable: timeTableReducer,
        classes: classesSliceReducer,
        subjects: subjectsSliceReducer,
        teachers: teachersSliceReducer,
        lessons: lessonsSliceReducer,
        dragDrop: dragDropSliceReducer,
    }
})
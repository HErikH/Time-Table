import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import fetchDataFromApi from "../utils/api.js";

let initialState = {};

// Async reducers

export const getLessons = createAsyncThunk(
  "lessons/fetchLessons",
  async function (_, { getState }) {
    return JSON.parse(getState().timeTable.lessons);
  }
);

export const addLesson = createAsyncThunk(
  "lessons/addLesson",
  async function (payload) {
    let { teachersId, classesId, classRoomsId, ...rest } =
      structuredClone(payload);
      classesId[Object.keys(classesId)[0]] = {
      chapterId: "all",
      groupId: "all",
    };
    const response = await fetchDataFromApi(
      "lessons/create",
      {
        tableId: 1,
        teachersId: JSON.stringify(teachersId),
        classesId: JSON.stringify(classesId),
        classRoomsId: JSON.stringify(classRoomsId),
        ...rest,
      },
      "post"
    );
    return JSON.parse(response.data.table.lessons);
  }
);

export const editLesson = createAsyncThunk(
  "lessons/editLesson",
  async function (payload) {
    let { teachersId, classesId, classRoomsId, ...rest } =
      structuredClone(payload);
    classesId[Object.keys(classesId)[0]] = {
      chapterId: "all",
      groupId: "all",
    };

    const response = await fetchDataFromApi(
      "lessons/update",
      {
        tableId: 1,
        teachersId: JSON.stringify(teachersId),
        classesId: JSON.stringify(classesId),
        classRoomsId: JSON.stringify(classRoomsId),
        ...rest,
      },
      "post"
    );
    return JSON.parse(response.data.table.lessons);
  }
);

export const deleteLesson = createAsyncThunk(
  "lessons/deleteLesson",
  async function (payload) {
    const response = await fetchDataFromApi(
      "lessons/delete",
      { tableId: 1, lessonId: payload },
      "post"
      );
      return JSON.parse(response.data.table.lessons);
  }
);

const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLessons.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(addLesson.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(editLesson.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(deleteLesson.fulfilled, (_, { payload }) => {
      return payload;
    });
  },
});

export const {} = lessonsSlice.actions;
export default lessonsSlice.reducer;

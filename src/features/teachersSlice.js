import { createSlice, createAsyncThunk, current, isAnyOf } from "@reduxjs/toolkit";
import fetchDataFromApi from "../utils/api.js";

let initialState = {};

// Async reducers

export const getTeachers = createAsyncThunk(
  "teachers/fetchTeachers",
  async function (_, { getState }) {
    return JSON.parse(getState().timeTable.teachers);
  }
);

export const addTeacher = createAsyncThunk(
  "teachers/addTeacher",
  async function (payload) {
    let { classIdWhoesSupervisor, supervisor: _, ...rest } = structuredClone(payload);
    const response = await fetchDataFromApi(
      "teachers/create",
      {
        tableId: 1,
        classIdWhoesSupervisor: JSON.stringify(classIdWhoesSupervisor),
        ...rest,
      },
      "post"
    );
    return JSON.parse(response.data.table.teachers);
  }
);

export const editTeacher = createAsyncThunk(
  "teachers/editTeacher",
  async function (payload) {
    let { classIdWhoesSupervisor, ...rest } = payload.data;
    const response = await fetchDataFromApi(
      "teachers/update",
      {
        tableId: 1,
        teacherId: payload.teacherId,
        classIdWhoesSupervisor: JSON.stringify(classIdWhoesSupervisor),
        ...rest,
      },
      "post"
    );
    return JSON.parse(response.data.table.teachers);
  }
);

export const deleteTeacher = createAsyncThunk(
  "teachers/deleteTeacher",
  async function (payload) {
    const response = await fetchDataFromApi(
      "teachers/delete",
      { tableId: 1, teacherId: payload },
      "post"
    );
    return JSON.parse(response.data.table.teachers);
  }
);

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(
      getTeachers.fulfilled, 
      addTeacher.fulfilled, 
      editTeacher.fulfilled, 
      deleteTeacher.fulfilled
    ), (_, { payload }) => payload)
  },
});

export const {} = teachersSlice.actions;
export default teachersSlice.reducer;

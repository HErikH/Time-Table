import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import fetchDataFromApi from "../utils/api.js";

let initialState = {};

// Async reducers

export const getClasses = createAsyncThunk(
  "classes/fetchClasses",
  async function (_, { getState }) {
    let result = await getState().timeTable.classes;
    return JSON.parse(result);
  }
);

export const addClass = createAsyncThunk(
  "classes/addClass",
  async function (payload) {
    let { classSupervisors, supervisor: _, ...rest } = structuredClone(payload);
    const response = await fetchDataFromApi(
      "classes/create",
      {
        tableId: 1,
        classSupervisors: JSON.stringify(classSupervisors),
        ...rest,
      },
      "post"
    );
    return JSON.parse(response.data.table.classes);
  }
);

export const editClass = createAsyncThunk(
  "classes/editClass",
  async function (payload) {
    let {
      classId,
      data: { supervisor: _, classSupervisors, ...rest },
    } = structuredClone(payload);
    const response = await fetchDataFromApi(
      "classes/update",
      {
        tableId: 1,
        classId: classId,
        classSupervisors: JSON.stringify(classSupervisors),
        ...rest,
      },
      "post"
    );
    return JSON.parse(response.data.table.classes);
  }
);

export const deleteClass = createAsyncThunk(
  "classes/deleteClass",
  async function (payload) {
    const response = await fetchDataFromApi(
      "classes/delete",
      { tableId: 1, classId: payload },
      "post"
    );
    return JSON.parse(response.data.table.classes);
  }
);

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClasses.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(addClass.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(editClass.fulfilled, (_, { payload }) => {
      return payload;
    });
    builder.addCase(deleteClass.fulfilled, (_, { payload }) => {
      return payload;
    });
  },
});

export const {} = classesSlice.actions;
export default classesSlice.reducer;

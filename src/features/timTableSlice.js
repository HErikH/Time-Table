import { createSlice, createAsyncThunk, current, isAnyOf } from "@reduxjs/toolkit";
import fetchDataFromApi from "../utils/api.js";

let initialState = {
  // nameOfSchool: "161",
  // year: "2023/2024",
  // registrationName: "161r",
  // weekend: "Saturday - Sunday",
};

// Async reducers

export const fetchTable = createAsyncThunk(
  "timTable/fetchTable",
  async function () {
    const {
      data: { table },
    } = await fetchDataFromApi("table/read", { tableId: 1 }, "post");
    return table;
  }
);

export const updateTable = createAsyncThunk(
  "timeTable/updateTable",
  async function (payload) {
    let promises = [];
    let { timeInfo, daysInfo, ...rest } = payload;

    for (const key in rest) {
      let infoKey = null,
        count = 0;
      switch (key) {
        case "days":
          count = "daysCount";
          break;
        case "hours":
          count = "newHoursCount";
          break;
        case "name":
        case "year":
          infoKey = "info";
          break;
      }

      const response = await fetchDataFromApi(
        "settings/update/" + (infoKey ? infoKey : key),
        { tableId: 1, [count ? count : key]: rest[key] },
        "post"
      );

      promises.push(response);
    }

    let timeResponse =
      timeInfo &&
      (await fetchDataFromApi(
        "settings/update/hour/info",
        { tableId: 1, ...timeInfo },
        "post"
      ));

    let daysResponse =
      daysInfo &&
      (await fetchDataFromApi(
        "settings/update/day/name",
        { tableId: 1, ...daysInfo },
        "post"
      ));

    timeResponse && promises.push(timeResponse);
    daysResponse && promises.push(daysResponse);

    let result = await Promise.all(promises);
    return result.at(-1).data.table;
  }
);

const timeTableSlice = createSlice({
  name: "timTable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isAnyOf(fetchTable.fulfilled, updateTable.fulfilled), (_, { payload }) => {
      return {
        ...payload,
        weekDays: JSON.parse(payload.weekDays)
      };
    })
  },
});

export default timeTableSlice.reducer;

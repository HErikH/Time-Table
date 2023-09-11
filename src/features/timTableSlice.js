import { createSlice } from "@reduxjs/toolkit";

let initialState = {
    classes: {
      161: {className: 161, short: '161short'},
      162: {className: 162, short: '162short'},
      163: {className: 163, short: '163short'},
    },
    table: {
      nameOfSchool: "161",
      year: "2023/2024",
      registrationName: "161r",
      periodsPerDay: 3,
      numberOfDays: 2,
      weekend: "Saturday - Sunday",
   }
};

const timeTableSlice = createSlice({
    name: 'timTable',
    initialState,
    reducers: {
        changeTable(state, {payload}) {
          state.table = {...state.table, ...payload}
        },

        addClass(state, {payload}) {
          state.classes[payload.className] = payload
        },

        editClass(state, {payload}) {
          for (const key in payload.data) {
            if (payload.data[key]) {
              state.classes[payload.selected][key] = payload.data[key]
            }
          }
        },
        
        removeClass(state, {payload}) {
          delete state.classes[payload]
        }
    },
})

export const { changeTable, addClass, editClass, removeClass } = timeTableSlice.actions; 
export default timeTableSlice.reducer;
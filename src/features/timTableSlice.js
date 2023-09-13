import { createSlice, current } from "@reduxjs/toolkit";

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
      weekend: "Saturday - Sunday",
   }
};

const timeTableSlice = createSlice({
    name: 'timTable',
    initialState,
    reducers: {
        getTimeTableApi(state, {payload}) {
          payload.weekDays = JSON.parse(payload.weekDays)
          state.table = {...state.table, ...payload}
          console.log(current(state))
        },

        changeTable(state, {payload}) {
          state.table = {...state.table, weekDays: {...state.table.weekDays}}
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

export const { changeTable, addClass, editClass, removeClass, getTimeTableApi } = timeTableSlice.actions; 
export default timeTableSlice.reducer;
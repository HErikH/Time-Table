import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { fetchDataFromApi } from '../utils/api.js'

let initialState = {
    // nameOfSchool: "161",
    // year: "2023/2024",
    // registrationName: "161r",
    // weekend: "Saturday - Sunday",
};

// Async reducers

export const fetchTable = createAsyncThunk(
  'timTable/fetchTable',
  async function() {
    const { data: { table } } = await fetchDataFromApi('table/read',{tableId: 1},'post')
    return table
  }
)

export const updateTable = createAsyncThunk(
  'timeTable/updateTable',
  async function(payload) {
    let promises = [], infoKey = null, count = 0 

    for (const key in payload) {
      if (payload[key]) {
        switch(key) {
          case 'days':
            count = 'daysCount'
            break
          case 'hours':
            count = 'newHoursCount'
            break
          case 'name':
          case 'year':
            infoKey = 'info'
            break
        }

        const result = await fetchDataFromApi(
          "settings/update/" + (infoKey ? infoKey : key),
          {tableId: 1,[count ? count : key]: payload[key]},
          'post'
        )
        promises.push(result)
      }
    }

    let result = await Promise.all(promises)
    return result.at(-1).data.table
   }
)

const timeTableSlice = createSlice({
    name: 'timTable',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchTable.fulfilled, (_, {payload}) => {
        payload.weekDays = JSON.parse(payload.weekDays)
        return payload
      })
      builder.addCase(updateTable.fulfilled, (_, {payload}) => {
        payload.weekDays = JSON.parse(payload.weekDays)
        return payload
      })
    }
})

export default timeTableSlice.reducer;
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { fetchDataFromApi } from '../utils/api.js'

let initialState = {}

// Async reducers

export const getSubjects = createAsyncThunk(
    'subjects/fetchSubjects',
    async function(_, {getState}) {
        return JSON.parse(getState().timeTable.subjects)
   }
)

export const addSubject = createAsyncThunk(
    'subjects/addSubject',
    async function(payload) {
        const response = await fetchDataFromApi('subjects/create', {tableId: 1, ...payload}, 'post')
        return JSON.parse(response.data.table.subjects)
    }
) 

export const editSubject = createAsyncThunk(
    'subjects/editClass',
    async function(payload) {
        const response = await fetchDataFromApi(
            'subjects/update', 
            {tableId: 1, subjectId: payload.subjectId, ...payload.data}, 
            'post')
        return JSON.parse(response.data.table.subjects)
    }
) 

export const deleteSubject = createAsyncThunk(
    'subjects/deleteClass',
    async function(payload) {
        const response = await fetchDataFromApi(
            'subjects/delete', 
            {tableId: 1, subjectId: payload}, 
            'post')
        return JSON.parse(response.data.table.subjects)
    }
) 

const subjectsSlice = createSlice({
    name: 'subjects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getSubjects.fulfilled, (_, {payload}) => {
        return payload
    })
      builder.addCase(addSubject.fulfilled, (_, {payload}) => {
        return payload
    })
      builder.addCase(editSubject.fulfilled, (_, {payload}) => {
        return payload
      })
      builder.addCase(deleteSubject.fulfilled, (_, {payload}) => {
        return payload
      })
    }
})

export const { } = subjectsSlice.actions; 
export default subjectsSlice.reducer;
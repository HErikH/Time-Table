import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { fetchDataFromApi } from '../utils/api.js'


let initialState = {}

// Async reducers

export const getClassrooms = createAsyncThunk(
    'classrooms/fetchClassrooms',
    async function(_, {getState}) {
        let result = await getState().timeTable.classRooms
        return JSON.parse(result)
   }
)

export const addClassroom = createAsyncThunk(
    'classrooms/addClassroom',
    async function(payload) {
        const response = await fetchDataFromApi('/class/rooms/create', {tableId: 1, ...payload}, 'post')
        return JSON.parse(response.data.table.classRooms)
    }
) 

export const editClassroom = createAsyncThunk(
    'classrooms/editClassroom',
    async function(payload) {
        const response = await fetchDataFromApi(
            '/class/rooms/update', 
            {tableId: 1, classRoomId: payload.classRoomId, ...payload.data}, 
            'post')
        return JSON.parse(response.data.table.classRooms)
    }
) 

export const deleteClassroom = createAsyncThunk(
    'classrooms/deleteClassroom',
    async function(payload) {
        const response = await fetchDataFromApi(
            'class/rooms/delete', 
            {tableId: 1, classRoomId: payload}, 
            'post')
        return JSON.parse(response.data.table.classRooms)
    }
) 

const classroomsSlice = createSlice({
    name: 'classrooms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(getClassrooms.fulfilled, (_, {payload}) => {
        return payload
    })
      builder.addCase(addClassroom.fulfilled, (_, {payload}) => {
        return payload
    })
      builder.addCase(editClassroom.fulfilled, (_, {payload}) => {
        return payload
      })
      builder.addCase(deleteClassroom.fulfilled, (_, {payload}) => {
        return payload
      })
    }
})

export const { } = classroomsSlice.actions; 
export default classroomsSlice.reducer;
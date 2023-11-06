import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from "uuid";
import fetchDataFromApi from "../utils/api.js";

let initialState = { error: false, stacks: {} };

export const updateFooterStacksDrag = createAsyncThunk(
  "dragDrop/updateFooterStacksDrag",
  async function (payload, { rejectWithValue }) {
    let { source, destination } = payload;
    const response = await fetchDataFromApi(
      "lessons/put/without/error",
      {
        tableId: 1,
        lessonId: source.lessonId,
        classId: destination.classId,
        dayId: destination.dayId,
        hourId: destination.hourId,
      },
      "post"
    );

    if (response.data.errorMessage) {
      return rejectWithValue(response.data);
    }
  }
);

export const deleteFooterStacksDrag = createAsyncThunk(
  "dragDrop/deleteFooterStacksDrag",
  async function (payload, { dispatch }) {
    const response = await fetchDataFromApi(
      "lessons/delete/lesson",
      {
        tableId: 1,
        lessonId: payload.lessonId,
        placeId: payload.placeId,
      },
      "post"
    );
  }
);

export const getFooterStacks = createAsyncThunk(
  "dragDrop/getFooterStacks",
  async function (_, { getState, dispatch }) {
    let { lessons, subjects, teachers, classes, classrooms } = await getState();
    dispatch(
      changeFooterStacks({ lessons, subjects, teachers, classes, classrooms })
    );
  }
);

const dragDropSlice = createSlice({
  name: "dragDrop",
  initialState,
  reducers: {
    changeFooterStacks(state, { payload }) {
      let next = {};
      let { lessons, subjects, teachers, classes, classrooms } = structuredClone(payload);

      for (const key in lessons) {
        let unIdStack = lessons[key].lessonId;
        next["footerStack" + unIdStack] = { 
          id: "footerStack" + unIdStack,
          lessonId: unIdStack,
          classesId: lessons[key].classesId,
          content: {},
        };

        for (let i = 0; i < lessons[key].lessonsCount - Object.keys(lessons[key].places).length; i++) {
          let unIdContent = uuidV4();
          next["footerStack" + unIdStack].content[unIdContent] = {
            contentId: unIdContent,
            subjectShortName: subjects[lessons[key].subjectId].shortName,
            subjectLongName: subjects[lessons[key].subjectId].longName,
            subjectColor: subjects[lessons[key].subjectId].color,
            teacherName: teachers[Object.keys(lessons[key].teachersId)[0]].name,
            classLongName: classes[Object.keys(lessons[key].classesId)[0]].longName,
            classroomLongName: classrooms[Object.keys(lessons[key].classRoomsId)[0]].longName,
            lessonsCount: lessons[key].lessonsCount
          };
        }
      }
      
      state.stacks = next
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(updateFooterStacksDrag.rejected, (state, { payload }) => {
        state.error = payload;
      })
      .addCase(updateFooterStacksDrag.fulfilled, (state) => {
        state.error = false;
      });
  },
});

export const { changeFooterStacks } = dragDropSlice.actions;
export default dragDropSlice.reducer;

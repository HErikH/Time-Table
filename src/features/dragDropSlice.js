import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { v4 as uuidV4 } from 'uuid';
import { fetchDataFromApi } from "../utils/api";

let initialState = {};

export const updateFooterStacksDrag = createAsyncThunk(
  'dragDrop/updateFooterStacksDrag',
  async function(payload) {
      let {destination: {droppableId: destinationObj}, source: {droppableId: sourceObj}} = structuredClone(payload)
      let sourceData = JSON.parse(sourceObj)
      let destinationData = JSON.parse(destinationObj);

      if (Object.keys(sourceData.classesId).includes(String(destinationData.classId))) {
        const response = await fetchDataFromApi(
          'lessons/put/without/error',
          {
            tableId: 1, 
            lessonId: sourceData.lessonId, 
            classId: destinationData.classId,
            dayId: destinationData.dayId,
            hourId: destinationData.hourId
          },
          'post'
        )

        // let lessons = JSON.parse(response.data.table.lessons)
        // let subjects = JSON.parse(response.data.table.subjects)

        // dispatch(changeFooterStacks({ lessons, subjects })) 
      }
  }
)

export const deleteFooterStacksDrag = createAsyncThunk(
  'dragDrop/deleteFooterStacksDrag',
  async function(payload, {dispatch}) {
        const response = await fetchDataFromApi(
        'lessons/delete/lesson',
        {
          tableId: 1, 
          lessonId: payload.lessonId, 
          placeId: payload.placeId,
        },
        'post'
      )

      // let lessons = JSON.parse(response.data.table.lessons)
      // let subjects = JSON.parse(response.data.table.subjects)

      // dispatch(changeFooterStacks({ lessons, subjects })) 
})

export const getFooterStacks = createAsyncThunk(
    'dragDrop/getFooterStacks',
    async function(_, {getState, dispatch}) {
      let { lessons, subjects, teachers, classes } = await getState()
      dispatch(changeFooterStacks({ lessons, subjects, teachers, classes })) 
   }
)

const dragDropSlice = createSlice({
  name: "dragDrop",
  initialState,
  reducers: {
    changeFooterStacks(_, { payload }) {
      let next = {}
      let {lessons, subjects, teachers, classes} = structuredClone(payload)

      for (const key in lessons) {
      let unIdStack = lessons[key].lessonId
          next['footerStack' + unIdStack] = {
            id: 'footerStack' + unIdStack,
            lessonId: unIdStack,
            classesId: lessons[key].classesId,
            content: {}
        }        
        for (let i = 0; i < lessons[key].lessonsCount - Object.keys(lessons[key].places).length; i++) {  
          let unIdContent = uuidV4()

          next['footerStack' + unIdStack].content[unIdContent] = { 
            contentId: unIdContent, 
            subjectShortName: subjects[lessons[key].subjectId].shortName + (i + 1),
            subjectLongName: subjects[lessons[key].subjectId].longName,
            teacherName: teachers[Object.keys(lessons[key].teachersId)[0]].name,
            classLongName: classes[Object.keys(lessons[key].classesId)[0]].longName
          }                                                         
        }          
      } 

      return next
    }
    // updateFooterStacksDrag(state, { payload }) {
    // //  console.log(payload)
    //   if (!payload.destination) return;

    //   // let start = payload.source.droppableId;
    //   // let finish = payload.destination.droppableId;
    //   let {destination: {droppableId: destinationData}, source: {droppableId: sourceData}} = payload

    //   // if (start == finish) {
    //   //   const items = Object.values(state[start].content);
    //   //   const [reorderedItem] = items.splice(payload.source.index, 1);
    //   //   items.splice(payload.destination.index, 0, reorderedItem);
    //   //   state[start].content = items; 
    //   // } else {
    //   //   let classesContentExist = finish.includes('subjectStack') ? true : false

    //   //   const startStack = Object.values(state[start].content);
    //   //   const finishStack = Object.values(
    //   //     classesContentExist ? 
    //   //     state.classesContent[finish].content :
    //   //     state[finish].content
    //   //   );

    //   //   const [reorderedStart] = startStack.splice(payload.source.index, 1);
    //     // finishStack.splice(payload.destination.index, 0, reorderedStart);

    //     // if (classesContentExist) {
    //     //   // state.classesContent[start].content = startStack;
    //     //   state.classesContent[finish].content = finishStack
    //     // } else {
    //       // state[start].content = startStack;
    //       // state[finish].content = finishStack
    //     // }
    //   // }
    //   // console.log(current(state))
    // },
  },
});

export const { changeFooterStacks } = dragDropSlice.actions;
export default dragDropSlice.reducer;
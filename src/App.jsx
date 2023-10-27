import { Routes, Route } from "react-router-dom";
import { useEffect, useState, useCallback, createContext } from "react";
import { getFooterStacks, updateFooterStacksDrag } from "./features/dragDropSlice";
import { DragDropContext } from "react-beautiful-dnd";
import { fetchTable } from "./features/timTableSlice";
import { getClasses } from "./features/classesSlice";
import { getSubjects } from "./features/subjectsSlice";
import { getTeachers } from "./features/teachersSlice";
import { getClassrooms } from "./features/classroomsSlice";
import { getLessons } from "./features/lessonsSlice";
import { useDispatch } from "react-redux";

import LanguageModalDynamic from "./components/ui/modals/languageModal/LanguageModalDynamic";
import Header from './components/header/Header'
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
import Help from "./pages/help/Help";
import Footer from "./components/footer/Footer";
import PageNotFound from "./pages/404/PageNotFound";
import Loader from "./components/ui/loader/Loader";
import './App.scss'

import { fetchDataFromApi } from "./utils/api";

export const GlobalContext = createContext()

function App() {
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(false)
  const [lessonPeriod, setLessonPeriod] = useState(false)

  let dispatch = useDispatch()

  async function initialFetch(result) {
    setAvailable(false)
    
    if (
      result && 
      !result.destination || result &&
      JSON.parse(result.source.droppableId).droppableId.includes('footerStack') && 
      JSON.parse(result.destination.droppableId).droppableId.includes('footerStack') 
    ) return

    result && await dispatch(updateFooterStacksDrag(result))
    await dispatch(fetchTable())
    await dispatch(getClassrooms())
    await dispatch(getClasses())
    await dispatch(getSubjects())
    await dispatch(getTeachers())
    await dispatch(getLessons())
    await dispatch(getFooterStacks())
    setLoading(false)
  }

  useEffect(() => {
    initialFetch()

    function outsideClickListener() {
      setAvailable(false)
    }

    window.addEventListener('click', outsideClickListener)
    return () => {
      window.removeEventListener('click', outsideClickListener)
    }

    // *For initial create data

    // fetchDataFromApi('table/create')
    // fetchDataFromApi('classes/create', {tableId: 1, longName: 162, shortName: '162short'},'post')
    // fetchDataFromApi('subjects/create', {tableId: 1, longName: 'Spain', shortName: 'Sp'},'post')
    // fetchDataFromApi('lessons/create', {tableId: 1, subjectId: 1695046542530, classId: 1694798594956, teacherId: 1695214404268}, 'post')
    // fetchDataFromApi('/class/rooms/create', {tableId: 1, longName: 'arajin', shortName: 'araj'}, 'post')
  }, [])

  return (
    loading ? 
    <Loader /> : 
    <GlobalContext.Provider value={initialFetch}>
    <LanguageModalDynamic />
    <Header />  
    <Routes>
      <Route path={"/"} element={<Main />} />
      <Route path="/help" element={<Help />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    <DragDropContext onDragEnd={initialFetch}>
    <Timetable 
    key='table' 
    available={available}
    setLessonPeriod={setLessonPeriod}
    />
    <Footer 
    key='footer' 
    available={available}
    setAvailable={setAvailable}
    lessonPeriod={lessonPeriod}
    />
    </DragDropContext>
    </GlobalContext.Provider>
  )
}

export default App

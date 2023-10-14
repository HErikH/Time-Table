import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFooterStacks, updateFooterStacksDrag } from "./features/dragDropSlice";
import { DragDropContext } from "react-beautiful-dnd";
import { fetchTable } from "./features/timTableSlice";
import { getClasses } from "./features/classesSlice";
import { getSubjects } from "./features/subjectsSlice";
import { getTeachers } from "./features/teachersSlice";
import { getLessons } from "./features/lessonsSlice";
import { useDispatch } from "react-redux";

import Header from './components/header/Header'
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
import Help from "./pages/help/Help";
import Footer from "./components/footer/Footer";
import Loader from "./components/ui/loader/Loader";
import './App.scss'

import { fetchDataFromApi } from "./utils/api";

function App() {
  const [loading, setLoading] = useState(true)
  const [available, setAvailable] = useState(false)

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
      removeEventListener('click', outsideClickListener)
    }

    // *For initial create data

    // fetchDataFromApi('table/create')
    // fetchDataFromApi('classes/create', {tableId: 1, longName: 162, shortName: '162short'},'post')
    // fetchDataFromApi('subjects/create', {tableId: 1, longName: 'Spain', shortName: 'Sp'},'post')
    // fetchDataFromApi('lessons/create', {tableId: 1, subjectId: 1695046542530, classId: 1694798594956, teacherId: 1695214404268}, 'post')
  }, [])

  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/help" element={<Help />} />
    </Routes>

    <DragDropContext 
    onDragEnd={initialFetch}
    >
    {
    loading ? 
    <Loader /> : 
    ([<Timetable key='table' 
    initialFetch={initialFetch} 
    available={available}
    />, 
    <Footer key='footer' 
    setAvailable={setAvailable}
    />
    ])
    }
    </DragDropContext>
    </>
  )
}

export default App

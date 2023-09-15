import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { fetchTable } from "./features/timTableSlice";
import { getClasses } from "./features/classesSlice";
import { useDispatch } from "react-redux";
import Header from './components/header/Header'
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
import Help from "./pages/help/Help";
import './App.scss'

import { fetchDataFromApi } from "./utils/api";

function App() {
  let dispatch = useDispatch()

  useEffect(() => {
    async function initialFetch() {
      await dispatch(fetchTable())
      dispatch(getClasses())
    }
    initialFetch()
    // fetchDataFromApi('table/create')
    // fetchDataFromApi('classes/create', {tableId: 1, longName: 162, shortName: '162short'},'post')
  }, [])

  return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/help" element={<Help />} />
    </Routes>
    <Timetable />
    </>
  )
}

export default App

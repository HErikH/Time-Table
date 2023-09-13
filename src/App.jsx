import { Routes, Route } from "react-router-dom";
import { useImmer } from "use-immer";
import { useEffect } from "react";
import { getTimeTableApi } from "./features/timTableSlice";
import { fetchDataFromApi } from "./utils/api";
import { useDispatch } from "react-redux";
import Header from './components/header/Header'
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
import Help from "./pages/help/Help";
import './App.scss'

function App() {
  let dispatch = useDispatch()

  useEffect(() => {
    async function fetchTable() {
      let { data: {table} } = await fetchDataFromApi('table/read', { tableId: 1 }, 'post')
      dispatch(getTimeTableApi(table))
    }
    fetchTable();
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

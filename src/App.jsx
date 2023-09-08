import { Routes, Route } from "react-router-dom";
import Header from './components/header/Header'
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
import Help from "./pages/help/Help";
import { useContext } from "react";
import { useImmer } from "use-immer";
import { TimeTableContext } from './context/TimeTableContext'
import './App.scss'

function App() {
  let [state, setState] = useImmer(useContext(TimeTableContext))

  return (
    <TimeTableContext.Provider value={[state, setState]}>
    <Header />
    <Routes>
      <Route path="/main" element={<Main />} />
      <Route path="/help" element={<Help />} />
    </Routes>
    <Timetable />
    </TimeTableContext.Provider>
  )
}

export default App

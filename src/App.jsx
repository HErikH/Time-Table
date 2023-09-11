import { Routes, Route } from "react-router-dom";
import Header from './components/header/Header'
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
import Help from "./pages/help/Help";
import './App.scss'

function App() {
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

import { Routes, Route } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import {
  getFooterStacks,
  updateFooterStacksDrag,
} from "./features/dragDropSlice";
import { useTranslation } from "react-i18next";
import { fetchTable } from "./features/timTableSlice";
import { getClasses } from "./features/classesSlice";
import { getSubjects } from "./features/subjectsSlice";
import { getTeachers } from "./features/teachersSlice";
import { getClassrooms } from "./features/classroomsSlice";
import { getLessons } from "./features/lessonsSlice";
import { useDispatch } from "react-redux";

import Login from "./pages/login/Login";
import LanguageModalDynamic from "./components/ui/modals/languageModal/LanguageModalDynamic";
import Header from "./components/header/Header";
import Timetable from "./components/Timetable/Timetable";
import Main from "./pages/main/Main";
// import Help from "./pages/help/Help";
import Footer from "./components/footer/Footer";
import PageNotFound from "./pages/404/PageNotFound";
import Loader from "./components/ui/loader/Loader";
import ErrorModal from "./components/ui/modals/customErrorModal/ErrorModal";
import { useCookies } from "react-cookie";
import "react-responsive-modal/styles.css";
import "./App.scss";

// import fetchDataFromApi from "./utils/api.js";

export const GlobalContext = createContext();
export const DragSourceData = createContext();

function App() {
  const [cookies] = useCookies(["uid"]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [lessonPeriod, setLessonPeriod] = useState(false);
  const [sourceData, setSourceData] = useState(false);

  let dispatch = useDispatch();

  const { t } = useTranslation();

  async function initialFetch(result) {
    setLoading(true);

    result && await dispatch(updateFooterStacksDrag(result));
    await dispatch(fetchTable());
    await dispatch(getClassrooms());
    await dispatch(getClasses());
    await dispatch(getSubjects());
    await dispatch(getTeachers());
    await dispatch(getLessons());
    await dispatch(getFooterStacks());

    setLoading(false);
  }

  useEffect(() => {
    cookies.uid && initialFetch();

    // *For initial create data

    // fetchDataFromApi('auth/login', {name: 'University', password: 'vPjLZw626v9W'}, 'post')
    // fetchDataFromApi('table/create')
    // fetchDataFromApi('classes/create', {tableId: 1, longName: 162, shortName: '162short'},'post')
    // fetchDataFromApi('subjects/create', {tableId: 1, longName: 'Spain', shortName: 'Sp'},'post')
    // fetchDataFromApi('lessons/create', {tableId: 1, subjectId: 1695046542530, classId: 1694798594956, teacherId: 1695214404268}, 'post')
    // fetchDataFromApi('/class/rooms/create', {tableId: 1, longName: 'arajin', shortName: 'araj'}, 'post')
  }, [cookies.uid]);

  return !cookies.uid ? (
  <>
    <LanguageModalDynamic />
    <Login />
  </>
  ) : loading ? (
    <Loader />
  ) : (
    <GlobalContext.Provider value={initialFetch}>
      <DragSourceData.Provider
        value={{
          sourceData,
          setSourceData,
        }}
      >
        <LanguageModalDynamic />
        <Header />
        <Routes>
          <Route path={"/"} element={<Main />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Timetable
          key="table"
          available={available}
          setLessonPeriod={setLessonPeriod}
        />
        <Footer
          key="footer"
          available={available}
          setAvailable={setAvailable}
          lessonPeriod={lessonPeriod}
        />
        <ErrorModal />
      </DragSourceData.Provider>
    </GlobalContext.Provider>
  );
}

export default App;

import { useContext } from "react";
import { deleteFooterStacksDrag } from "../../features/dragDropSlice";
import { GlobalContext, DragSourceData } from "../../App";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import { useImmer } from "use-immer";
import "./style.scss";

function Timetable({ available, setLessonPeriod }) {
  const initialFetch = useContext(GlobalContext)
  const { sourceData } = useContext(DragSourceData)
  const table = useSelector((state) => state.timeTable.weekDays);
  const classes = useSelector((state) => state.classes);
  const lessons = useSelector((state) => state.lessons);
  const subjects = useSelector((state) => state.subjects);
  const teachers = useSelector((state) => state.teachers);
  const classrooms = useSelector((state) => state.classrooms);
  const dispatch = useDispatch();

  let { t } = useTranslation();

  function handleHourClick(destinationData) {
    if (
      sourceData &&
      Object.keys(sourceData.classesId).includes(String(destinationData.classId))
      ) { 
        initialFetch({
          source: sourceData,
          destination: destinationData
        })
      return
    }
  }

  function createWeekDays() {
    let result = [];

    for (const item in table) {
      result.push(
        <th key={table[item].dayId}>{t(table[item].name.toLowerCase())}</th>
      );
    }

    return result;
  }

  function createPeriodsPerDay() {
    let result = [];

    for (const item in table) {
      result.push(
        <td key={table[item].dayId} className="per-days">
          {Object.values(table[item].hours).map((h) => {
            return (
              <div key={h.hourId} className="per-days__hour">
                {h.shortName}
              </div>
            );
          })}
        </td>
      );
    }

    return result;
  }

  async function deletePlacedLesson(placeId, lessonId) {
    await dispatch(deleteFooterStacksDrag({placeId, lessonId}))
    await initialFetch()
    setLessonPeriod(false)
  }

  function createClassRow() {
    return Object.values(classes).map((classItem) => {
      return (
        <tr className="classes" key={classItem.classId}>
          <td 
          className={
            `classes__class ${available.classId == classItem.classId ? 
            'classes__class_theme' : ''}`
          }
          >
            {classItem.longName}
          </td>
          {Object.values(table).map((day) => {
            return (
              <td key={day.dayId} className="per-days">
                {Object.values(day.hours).map((hour) => {
                  let unId = uuidV4();
                  return (
                      <div
                      key={unId}
                      className="per-days__hour"
                      data-destination-id='destinationArea' 
                      onClick={() => {
                        handleHourClick({
                        droppableId: "subjectStack" + unId,
                        dayId: day.dayId,
                        hourId: hour.hourId,
                        classId: classItem.classId,
                        })
                      }}
                      >
                          {Object.values(classItem.lessons).map((lessonId) => {
                              return lessons[lessonId] && Object.values(lessons[lessonId].places).map((place) => {
                                if (place.dayId == day.dayId && place.hourId == hour.hourId) {
                                  return (
                                  <div 
                                  key={place.hourId} 
                                  className="subject"
                                  onClick={() => deletePlacedLesson(place.placeId, lessonId)}      
                                  onMouseEnter={() => setLessonPeriod({
                                    teacherName: teachers[Object.keys(lessons[lessonId].teachersId)[0]].name,
                                    subjectLongName: subjects[lessons[lessonId].subjectId].longName,
                                    classroomLongName: Object.keys(lessons[lessonId].classRoomsId).length ? classrooms[Object.keys(lessons[lessonId].classRoomsId)[0]].longName : '',
                                    timeStart: hour.timeStart, 
                                    timeEnd: hour.timeEnd
                                  })}
                                  onMouseLeave={() => setLessonPeriod(false)}  
                                  style={{
                                    backgroundColor: subjects[lessons[lessonId].subjectId].color,
                                    color: '#e3e3e3'
                                  }}
                                   >
                                    <span>{subjects[lessons[lessonId].subjectId].shortName}</span>
                                  </div>
                                )}
                              });
                            })
                          }
                        </div>
                  );
                })}
              </td>
            );
          })}
        </tr>
      );
    });
  }

  return (
    <div className="time-table-wrapper">
      <table 
      className="time-table" 
      onMouseLeave={() => setLessonPeriod(false)}  
      >
        <thead>
          <tr>
            <th>{t("classes")}</th>
            {createWeekDays()}
          </tr>
        </thead>

        <tbody>
          <tr>
            {/* <td style={{ textAlign: "center", border: "1px solid #dbe9ee" }}>
              {t("hours")}-&#62;
            </td> */}
            <td style={{border: "1px solid #dbe9ee"}}></td>
            {createPeriodsPerDay()}
          </tr>
          {createClassRow()}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;

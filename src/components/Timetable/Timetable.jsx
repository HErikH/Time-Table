import { deleteFooterStacksDrag } from "../../features/dragDropSlice";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { v4 as uuidV4 } from "uuid";
import { useImmer } from "use-immer";
import "./style.scss";

function Timetable({ initialFetch, available }) {
  const table = useSelector((state) => state.timeTable.weekDays);
  const classes = useSelector((state) => state.classes);
  const lessons = useSelector((state) => state.lessons);
  const subjects = useSelector((state) => state.subjects);
  const dispatch = useDispatch();

  let { t } = useTranslation();

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
                {h.name}
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
    initialFetch()
  }

  function createClassRow() {
    return Object.values(classes).map((classItem) => {
      return (
        <tr className="classes" key={classItem.classId}>
          <td 
          className={
            `classes__class ${available == classItem.classId ? 
            'classes__class_theme' : ''}`
          }
          // className='classes__class'
          >
            {classItem.longName}
          </td>
          {Object.values(table).map((day) => {
            return (
              <td key={day.dayId} className="per-days">
                {Object.values(day.hours).map((hour) => {
                  let unId = uuidV4();
                  return (
                    <Droppable
                      key={unId}
                      droppableId={JSON.stringify({
                        droppableId: "subjectStack" + unId,
                        dayId: day.dayId,
                        hourId: hour.hourId,
                        classId: classItem.classId,
                      })}
                    >
                      {(provided) => (
                        <div
                          className="per-days__hour"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {Object.values(classItem.lessons).map((lessonId, lessonIndex) => {
                              return Object.values(lessons[lessonId].places).map((place) => {
                                if (place.dayId == day.dayId && place.hourId == hour.hourId) {
                                  return (
                                  <span 
                                  key={place.hourId} 
                                  className="subject"
                                  onClick={() => deletePlacedLesson(place.placeId, lessonId)}                                 
                                   >
                                    {subjects[lessons[lessonId].subjectId].shortName}
                                  </span>
                                )}
                              });
                            })
                          }
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
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
      <table className="time-table">
        <thead>
          <tr>
            <th>{t("classes")}</th>
            {createWeekDays()}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={{ textAlign: "center", border: "1px solid #00739a" }}>
              {t("hours")}-&#62;
            </td>
            {createPeriodsPerDay()}
          </tr>
          {createClassRow()}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;

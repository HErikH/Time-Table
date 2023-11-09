import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { PrintContext } from "../PrintSettings";
import { useTranslation } from 'react-i18next'
import "./style.scss";

function PrintComponent({ lessonsData, section }) {
  const { printRef, handlePrint, setDocumentTitle } = useContext(PrintContext);
  const table = useSelector((state) => state.timeTable);
  const lessons = useSelector((state) => state.lessons);
  const subjects = useSelector((state) => state.subjects);
  const teachers = useSelector((state) => state.teachers);
  const classrooms = useSelector((state) => state.classrooms);
  const classes = useSelector((state) => state.classes);

  const { t } = useTranslation()

  useEffect(() => {
    section == 'classes' ? 
    setDocumentTitle((table.name ? table.name : '') + '_' + (lessonsData ? lessonsData.longName : '') + '_' + t('class timetable')) :
    section == 'teachers' ?
    setDocumentTitle((table.name ? table.name : '') + '_' + (lessonsData ? lessonsData.name : '') + '_' + t('teacher timetable')) :
    ''
  }, [section, lessonsData])

  return (
    <>
      <div ref={printRef}>
        <h4 style={{textAlign: 'center'}}>
          {t('school') + ':' + ' ' + (table.name ? table.name : '')}
        </h4>
        <h4 style={{textAlign: 'center'}}>
          {t('academic year') + ':' + ' ' + (table.year ? table.year : '')}
        </h4>
        <h4 style={{textAlign: 'center'}}>
        {
        section == 'classes' ?
        t('class name') + ':' + ' ' + (lessonsData ? lessonsData.longName : '') :
        section == 'teachers' ?
        t('teacher') + ':' + ' ' + (lessonsData ? lessonsData.name : '') : ''
        }
        </h4>
        <h5 style={{textAlign: 'center'}}>
        {
        section == 'classes' &&
        t('class supervisor') + ':' + ' ' + (lessonsData ? teachers[Object.keys(lessonsData.classSupervisors)[0]]?.name : '')
        }
        </h5>
        <table className="print-timetable">
          <thead>
            <tr>
              <th></th>
              {table.weekDays && Object.entries(table.weekDays["1"].hours).map((hour) => {
                return (
                  <th key={hour[0]}>
                    <p>{hour[1].shortName}</p>
                    <p style={{fontSize: '14px'}}>{`${hour[1].timeStart} - ${hour[1].timeEnd}`}</p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {table.weekDays && Object.entries(table.weekDays).map((day) => {
              return (
                <tr key={day[0]}>
                  <td style={{textAlign: 'center'}}>{day[1].shortName}</td>
                  {Object.entries(day[1].hours).map((hour) => {
                    return (
                      <td key={hour[0]}>
                        {lessonsData && Object.values(lessonsData.lessons).map((lessonId) => {
                          return (
                            lessons[lessonId] &&
                            Object.values(lessons[lessonId].places).map(
                              (place) => {
                                if (
                                  place.dayId == day[1].dayId &&
                                  place.hourId == hour[1].hourId
                                ) {
                                  return (
                                    <div
                                      key={place.hourId}
                                      className="lesson"
                                    >
                                    <p style={{textAlign: 'center'}}>
                                      {
                                        section == 'classes' ?
                                        (lessons[lessonId].subjectId ? 
                                        subjects[lessons[lessonId].subjectId].shortName : '') :
                                        section == 'teachers' ?
                                        (Object.keys(lessons[lessonId].classesId).length ? 
                                        classes[Object.keys(lessons[lessonId].classesId)[0]].shortName : '') :
                                        ''
                                      }
                                    </p>
                                    <span style={{float: 'left', fontSize: '12px'}}>
                                      {
                                        section == 'classes' ?
                                        (Object.keys(lessons[lessonId].classRoomsId).length ? 
                                        classrooms[Object.keys(lessons[lessonId].classRoomsId)[0]].shortName : '') :
                                        section == 'teachers' ?
                                        (lessons[lessonId].subjectId ? 
                                        subjects[lessons[lessonId].subjectId].shortName : '') :
                                        ''
                                      }
                                    </span>
                                    <span style={{float: 'right',fontSize: '12px'}}>
                                      {
                                        section == 'classes' ?
                                        (Object.keys(lessons[lessonId].teachersId).length ?
                                        teachers[Object.keys(lessons[lessonId].teachersId)[0]].name : '') :
                                        section == 'teachers' ?
                                        (Object.keys(lessons[lessonId].classRoomsId).length ? 
                                        classrooms[Object.keys(lessons[lessonId].classRoomsId)[0]].shortName : '') :
                                        ''
                                      }
                                    </span>
                                    </div>
                                  );
                                }
                            })
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="OSstyle" onClick={handlePrint}>
        {t('print')}
      </button>
    </>
  );
}
export default PrintComponent;

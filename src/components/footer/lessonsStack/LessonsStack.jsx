import { useState } from "react";
import { GlobalContext } from "../../../App";
import { useSelector } from "react-redux/es/exports";
import Movable from "../../ui/moveElement/Movable";
import { useTranslation } from "react-i18next";
import './style.scss'

function LessonsStack({ setAvailable, lessonPeriod }) {
  // const initialFetch = useContext(GlobalContext)
  let {error, ...stacks} = useSelector(state => state.dragDrop)
  let [reviewState, setReviewState] = useState(false)
  let [clicked, setClicked] = useState(false)
  const { t } = useTranslation()

  function hoverHandler(item, classId) { 
    if (item && classId) {
      setReviewState({ 
        subjectShortName: item.subjectShortName,
        subjectLongName: item.subjectLongName,
        subjectColor: item.subjectColor,
        teacherName: item.teacherName,
        classLongName: item.classLongName,
        classroomLongName: item.classroomLongName,
        lessonsCount: item.lessonsCount
      }) 
      setAvailable({ classId })
    } else if (!clicked) {
      setReviewState(false)
      setAvailable(false)
    }
  }

  function createStacks() {
    let result = [];

    for (const key in stacks) {
      result.push(
        <div 
        className="stack" 
        key={stacks[key].id}
        >
          {Object.values(stacks[key].content).map((item, index) => {
            return (
                <Movable 
                  key={item.contentId}
                  keyProp={item.contentId} 
                  type='div'
                  className='subject'
                  text={item.subjectShortName}
                  style={{
                    backgroundColor: item.subjectColor,
                  }}
                  setReviewState={setReviewState}
                  setAvailable={setAvailable}
                  clicked={clicked}
                  setClicked={setClicked}
                  dragSourceData={{
                   droppableId: stacks[key].id,
                   classesId: stacks[key].classesId,
                   lessonId: stacks[key].lessonId
                  }}
                  onMouseEnter={() => hoverHandler(item, Object.keys(stacks[key].classesId)[0], item.subjectColor)}
                  onMouseLeave={hoverHandler}
                />
          )})}
        </div>
      );
    }

    return result;
  }

  return (
    <div className="stacks-section">
      <div className="stacks-section__review">
        {reviewState && (
          <>
          <div className="subject-block" style={{opacity: reviewState ? '1' : '0'}}>
            <span className="subject" style={{
              backgroundColor: reviewState.subjectColor
              }}
              >
              <span>{reviewState.subjectShortName}</span>
            </span>
            <span style={{color: 'white'}}>- {reviewState.subjectLongName}</span>
          </div>
          <p>{`${t("class name")} - ${reviewState.classLongName}`}</p>
          <p>{`${t("teacher")} - ${reviewState.teacherName}`}</p>
          <p>{`${t("classroom name")} - ${reviewState.classroomLongName}`}</p>
          <p>{`${t("lessons count")} - ${reviewState.lessonsCount}`}</p>
          </>
          )}
          {lessonPeriod && (
            <>
            <p>{`${t("subject title")} - ${lessonPeriod.subjectLongName}`}</p>
            <p>{`${t("teacher")} - ${lessonPeriod.teacherName}`}</p>
            <p>{`${t("classroom name")} - ${lessonPeriod.classroomLongName}`}</p>
            <p>{`${t("start time")} - ${lessonPeriod.timeStart}`}</p>
            <p>{`${t("end time")} - ${lessonPeriod.timeEnd}`}</p>
            </>
          )}
      </div>
      <div className="stacks-section__stacks">
          {createStacks()}
      </div>
    </div>
  );
}

export default LessonsStack;

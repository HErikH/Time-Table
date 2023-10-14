import { useState } from "react";
import { useSelector } from "react-redux/es/exports";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import './style.scss'

function LessonsStack({ setAvailable }) {
  let { classesContent:_, ...stacks} = useSelector(state => state.dragDrop)
  let [reviewState, setReviewState] = useState(false)

  const { t } = useTranslation()

  function hoverHandler(item, classId) {
    if (item && classId) {
      setReviewState({ 
        subjectShortName: item.subjectShortName,
        subjectLongName: item.subjectLongName,
        teacherName: item.teacherName,
        classLongName: item.classLongName
      }) 
      setAvailable(classId)
    } else {
      setReviewState(false)
    }
  }

  function createStacks() {
    let result = [];

    for (const key in stacks) {
      result.push(
        <Droppable 
        key={stacks[key].id} 
        droppableId={JSON.stringify({
          droppableId: stacks[key].id,
          classesId: stacks[key].classesId,
          lessonId: stacks[key].lessonId
        })}
        >
          {(provided) => (
          <div 
          className="stack"     
          {...provided.droppableProps}
          ref={provided.innerRef}
          >
            {Object.values(stacks[key].content).map((item, index) => {
              return (
                <Draggable 
                draggableId={item.contentId} 
                key={item.contentId} 
                index={index}
                >
                {(provided) => ( 
                  <div 
                  className="subject"
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  onMouseEnter={() => hoverHandler(item, Object.keys(stacks[key].classesId)[0])}
                  onMouseLeave={hoverHandler}
                  >
                    {item.subjectShortName}
                  </div> 
                )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
          )}
        </Droppable>
      );
    }

    return result;
  }

  return (
    // @params subjectName, className, teacherName
    <div className="stacks-section">
      <div 
      className="stacks-section__review" 
      >
        {reviewState && (
          <>
          <div className="subject-block" style={{opacity: reviewState ? '1' : '0'}}>
            <span className="subject">{reviewState.subjectShortName}</span>
            <span>- {reviewState.subjectLongName}</span>
          </div>
          <p>{`${t("class name")} - ${reviewState.classLongName}`}</p>
          <p>{`${t("teacher name")} - ${reviewState.teacherName}`}</p>
          </>)}
      </div>
      <div className="stacks-section__stacks">
          {createStacks()}
      </div>
    </div>
  );
}

export default LessonsStack;

import { useState, useContext } from "react";
import { GlobalContext } from "../../../App";
import { useSelector } from "react-redux/es/exports";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Movable from "../../ui/moveElement/Movable";
import { useTranslation } from "react-i18next";
import styled from 'styled-components'
import './style.scss'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  color: #e3e3e3;
`

function LessonsStack({ available, setAvailable, lessonPeriod }) {
  // const initialFetch = useContext(GlobalContext)
  let stacks = useSelector(state => state.dragDrop)
  let [reviewState, setReviewState] = useState(false)
  const { t } = useTranslation()

  function hoverHandler(item, classId, color) { 
    if (item && classId) {
      setReviewState({ 
        subjectShortName: item.subjectShortName,
        subjectLongName: item.subjectLongName,
        teacherName: item.teacherName,
        classLongName: item.classLongName,
        classroomLongName: item.classroomLongName
      }) 
      setAvailable({ classId, color })
    } else {
      setReviewState(false)
      // setAvailable(false)
    }
  }

  function createStacks() {
    let result = [];

    for (const key in stacks) {
      result.push(
        // <div 
        // className="stack" 
        // key={stacks[key].id}
        // >
        //   {Object.values(stacks[key].content).map((item, index) => {
        //     return (
        //         <Movable 
        //           key={item.contentId}
        //           keyProp={item.contentId} 
        //           type='div'
        //           className='subject'
        //           text={item.subjectShortName}
        //           style={{
        //             backgroundColor: item.subjectColor,
        //           }}
        //           onMouseEnter={() => hoverHandler(item, Object.keys(stacks[key].classesId)[0], item.subjectColor)}
        //           onMouseLeave={hoverHandler}
        //         />
        //   )})}
        // </div>

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
                  <Container 
                  className="subject"
                  color={item.subjectColor}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  ref={provided.innerRef}
                  onMouseEnter={() => hoverHandler(item, Object.keys(stacks[key].classesId)[0], item.subjectColor)}
                  onMouseLeave={hoverHandler}
                  >
                  {item.subjectShortName}
                  </Container>
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
    <div className="stacks-section">
      <div 
      className="stacks-section__review" 
      >
        {reviewState && (
          <>
          <div className="subject-block" style={{opacity: reviewState ? '1' : '0'}}>
            <span className="subject" style={{
              color: '#e3e3e3', 
              backgroundColor: available.color}}
              >
              {reviewState.subjectShortName}
            </span>
            <span style={{color: 'white'}}>- {reviewState.subjectLongName}</span>
          </div>
          <p style={{color: 'white'}}>{`${t("class name")} - ${reviewState.classLongName}`}</p>
          <p style={{color: 'white'}}>{`${t("teacher")} - ${reviewState.teacherName}`}</p>
          <p style={{color: 'white'}}>{`${t("classroom name")} - ${reviewState.classroomLongName}`}</p>
          </>)}
          {lessonPeriod && (
            <>
            <p style={{color: 'white'}}>{`${t("start time")} - ${lessonPeriod.timeStart}`}</p>
            <p style={{color: 'white'}}>{`${t("end time")} - ${lessonPeriod.timeEnd}`}</p>
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

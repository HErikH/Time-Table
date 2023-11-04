import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { getFooterStacks } from "../../../features/dragDropSlice";
import { DragSourceData } from "../../../App";

function Movable({ 
  keyProp,
  type: Tag, 
  text, 
  className, 
  style, 
  children,
  setReviewState,
  setAvailable,
  clicked,
  setClicked,
  onMouseEnter,
  onMouseLeave,
  dragSourceData
  }) {

  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  let { setSourceData } = useContext(DragSourceData)

  let dispatch = useDispatch()

  let tagRef = useRef()
  let offsetX,offsetY
  
  const move = useCallback((e) => {
    setCursorPosition({ left: e.pageX - offsetX - 50, top: e.pageY - offsetY});
  }, []);
  
  const outsideClickListener = useCallback((e) => {
    if (
    e.target.dataset.sourceId != 'movableElement' && 
    e.target.id != 'clicked-text' ||
    e.target.dataset.destinationId == 'destinationArea' ||
    e.target.dataset.sourceId == 'movableElement' && clicked || 
    e.target.id == 'clicked-text' && clicked
    ) {
        setClicked(false)
        setAvailable(false)
        setReviewState(false)
        setSourceData(false)
        window.removeEventListener('click', outsideClickListener)
        window.removeEventListener("mousemove", move);
        dispatch(getFooterStacks())  
        return
      }
  }, [clicked])

  
  function onMouseMove(e) {
    // ! IMPORTANT DO NOT CHANGE e.currentTarget.dataset.sourceData to e.target
    setClicked(true)
    setSourceData(JSON.parse(e.currentTarget.dataset.sourceData))
    window.addEventListener("mousemove", move);
    window.addEventListener('click', outsideClickListener)
  }

  useEffect(() => {
    offsetX = tagRef.current.getBoundingClientRect().left
    offsetY = tagRef.current.getBoundingClientRect().top
  }, []);

  return (
    <Tag
    ref={tagRef}
    key={keyProp}
    onClick={onMouseMove}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`default-styles ${className}`}
    data-source-id='movableElement'
    data-source-data={JSON.stringify(dragSourceData)}
    style={{
      ...style,
      ...cursorPosition,
    }}
    >
      <span id="clicked-text">{text}</span>
      {children}
    </Tag>
  );
}

export default Movable;

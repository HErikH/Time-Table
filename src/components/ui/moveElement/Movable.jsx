import { useState, useEffect, useRef, useCallback } from "react";

function Movable({ 
  keyProp,
  type: Tag, 
  text, 
  className, 
  style, 
  children,
  onMouseEnter,
  onMouseLeave,
  }) {

  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  let tagRef = useRef()
  let offsetX,offsetY

  const move = useCallback((e) => {
    setCursorPosition({ left: e.pageX - offsetX - 50, top: e.pageY - offsetY});
  }, []);

  function onMouseMove() {
    window.addEventListener("mousemove", move);
  }
 
  useEffect(() => {
    offsetX = tagRef.current.getBoundingClientRect().left
    offsetY = tagRef.current.getBoundingClientRect().top

    function handleClick(e) {
      if (e.target.className == "per-days__hour") {
        window.removeEventListener("mousemove", move);
      }
    }

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
    <Tag
    ref={tagRef}
    key={keyProp}
    onClick={onMouseMove}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`default-styles ${className}`}
    style={{
      ...style,
      ...cursorPosition,
    }}
    >
      {text}
      {children}
    </Tag>
  );
}

export default Movable;

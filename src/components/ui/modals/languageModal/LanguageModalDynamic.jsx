import { useState, useCallback } from "react";
import { BsGlobe } from "react-icons/bs";
import LanguageSelect from "../../../languageSelect/LanguageSelect";
import Flags from "country-flag-icons/react/3x2";
import { useCookies } from 'react-cookie';
import './style.scss'

function LanguageModalDynamic() {
  const [cursorPosition, setCursorPosition] = useState({ top: '10px', right: '15px' });
  let [modal, setModal] = useState({lng: false})

  let [cookies] = useCookies(['i18next']) || 'en'
  let flagCode = cookies.i18next == 'en' ? 'GB' : cookies.i18next.toUpperCase()
  let Flag = Flags[flagCode]

  function onClose(name) {
    setModal({...modal, [name]: false});
  }

  function onOpen(name) {
    setModal({...modal, [name]: true});
  }

  const move = useCallback((e) => {
    setCursorPosition({ left: e.pageX, top: e.pageY});
  }, []);

  const handleMouseDown = useCallback(() => {
    window.addEventListener("mousemove", move);

    window.addEventListener("mouseup", function handleMouseUp() {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", handleMouseUp);
    });
  }, [])

  return (
    <>
    <button 
    className="language-dynamic" 
    onClick={() => onOpen('lng')}
    onMouseDown={handleMouseDown}
    style={{
    ...cursorPosition
    }}
    >
      <Flag className='flag' />
    </button>
    <LanguageSelect lngModal={modal.lng} closeLngModal={onClose}/>
    </>
  )
}

export default LanguageModalDynamic
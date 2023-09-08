import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PiNotebook } from 'react-icons/pi'
import { BsPeople } from 'react-icons/bs'
import { FaGraduationCap } from 'react-icons/fa'
import { GiGreekTemple, GiHamburgerMenu } from "react-icons/gi";
import SchoolSettings from "../../components/schoolSettings/SchoolSettings";
import ClassesSettings from "../../components/classesSettings/ClassesSettings";
import "./style.scss";

let navItems = [
  {icon: <PiNotebook className="icon" />, linkClass: 'main-navbar__item', text: 'subjects'},
  {icon: <BsPeople className="icon" />, linkClass: 'main-navbar__item', text: 'classes',},
  {icon: <FaGraduationCap className="icon" />, linkClass: 'main-navbar__item', text: 'teachers'},
  {icon: <GiGreekTemple className="icon" />, linkClass: 'main-navbar__item', text: 'school',},
]

function Main() {
  let [modal, setModal] = useState({ school: false, classes: false });
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const { t } = useTranslation();

  function onClose(name, setSelected) {
    setModal({...modal, [name]: false});
    setSelected(false);
  }

  function onOpen(name) {
    setModal({...modal, [name]: true});
  }

  return (
    <>
    <nav className="main-navbar">
      <div className={isNavExpanded ? "main-navbar__menu expanded" : "main-navbar__menu"}>
      {navItems.map(({ icon, linkClass, text }) => {
        return (
          <Link className={linkClass} key={text} onClick={() => onOpen(text)} >
            {icon}
            <p className="text">{t(text)}</p>
          </Link>
        )
      })}
      </div>
      <GiHamburgerMenu className="hamburger" onClick={()=>setIsNavExpanded(!isNavExpanded)} />
    </nav>
    <SchoolSettings schoolModal={modal.school} closeSchoolModal={onClose}/>
    <ClassesSettings classesModal={modal.classes} closeClassesModal={onClose}/>
    </>
  );
}

export default Main;

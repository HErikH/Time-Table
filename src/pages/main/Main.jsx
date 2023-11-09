import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { PiNotebook } from 'react-icons/pi'
import { BsPeople, BsFillDoorOpenFill } from 'react-icons/bs'
import { AiOutlinePrinter } from 'react-icons/ai'
import { FaGraduationCap } from 'react-icons/fa'
import { GiGreekTemple, GiHamburgerMenu } from "react-icons/gi";
// import { PrintContext } from "../../App";
import SchoolSettings from "../../components/schoolSettings/SchoolSettings";
import ClassesSettings from "../../components/classesSettings/ClassesSettings";
import TeachersSettings from "../../components/teachersSettings/TeachersSettings";
import SubjectsSettings from "../../components/subjectsSettings/SubjectsSettings";
import ClassroomsSettings from "../../components/classroomsSettings/ClassroomsSettings";
import PrintSettings from "../../components/printSettings/PrintSettings";
import "./style.scss";

let navItems = [
  {icon: <GiGreekTemple className="icon" />, linkClass: 'main-navbar__item', text: 'school',},
  {icon: <PiNotebook className="icon" />, linkClass: 'main-navbar__item', text: 'subjects'},
  {icon: <FaGraduationCap className="icon" />, linkClass: 'main-navbar__item', text: 'teachers'},
  {icon: <BsPeople className="icon" />, linkClass: 'main-navbar__item', text: 'classes',},
  {icon: <BsFillDoorOpenFill className="icon" />, linkClass: 'main-navbar__item', text: 'classrooms',},
  {icon: <AiOutlinePrinter className="icon" />, linkClass: 'main-navbar__item', text: 'print'},
]

function Main() {
  // const { handlePrint } = useContext(PrintContext)
  let [modal, setModal] = useState({ 
    school: false, 
    classes: false, 
    teachers: false, 
    classrooms: false,
    subjects: false,
    print: false 
  });

  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const { t } = useTranslation();

  function onClose(name) {
    setModal({...modal, [name]: false});
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
          <Link className={linkClass} key={text} onClick={() => onOpen(text)}>
            {icon}
            <p className="text">{t(text)}</p>
          </Link>
        )
      })}
      </div>
      <GiHamburgerMenu className="hamburger" onClick={()=>setIsNavExpanded(!isNavExpanded)} />
    </nav>
    <SchoolSettings schoolModal={modal.school} closeSchoolModal={onClose}/>
    <TeachersSettings teachersModal={modal.teachers} closeTeachersModal={onClose}/>
    <ClassroomsSettings classroomsModal={modal.classrooms} closeClassroomsModal={onClose} />
    <ClassesSettings classesModal={modal.classes} closeClassesModal={onClose}/>
    <SubjectsSettings subjectsModal={modal.subjects} closeSubjectsModal={onClose}/>
    <PrintSettings printSettingsModal={modal.print} closePrintSettingsModal={onClose} />
    </>
  );
}

export default Main;

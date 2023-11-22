import { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Modal from "react-responsive-modal";
import PrintComponent from "../printComponent/PrintComponent";
import { useTranslation } from 'react-i18next'
import "react-responsive-modal/styles.css";
import './style.scss'

function PrintTeachers({ printTeachersModal, closePrintTeachersModal}) {
  const teachers = useSelector((state) => state.teachers);
  const [selectValue, setSelectValue] = useState()
  const [selected, setSelected] = useState(teachers[Object.keys(teachers)[0]])

  const { t } = useTranslation()

  function onSet(e) {
    let selectedOption = e.target.options.selectedIndex
    setSelectValue(e.target.value)
    setSelected(JSON.parse(e.target.options[selectedOption].id))
  }

  return (
    <Modal
    classNames={{ modal: "print-teacher" }}
    open={printTeachersModal}
    onClose={() => closePrintTeachersModal('teachers')}
    center
    >
    <span className="teacher-select">
        {t('teachers')}:
        <select className="OSstyle" value={selectValue} onChange={onSet}>
        {Object.entries(teachers).map((item) => {
          return (
          <option id={JSON.stringify(item[1])} key={item[0]} value={item[1].name}>
            {item[1].name}
          </option>
          )
        })}
        </select>
    </span>
    <PrintComponent lessonsData={selected} section='teachers'/>
    </Modal>
  )
}
export default PrintTeachers
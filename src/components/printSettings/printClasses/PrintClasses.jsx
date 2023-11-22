import { useState } from "react";
import { useSelector } from "react-redux/es/hooks/useSelector";
import Modal from "react-responsive-modal";
import PrintComponent from "../printComponent/PrintComponent";
import { useTranslation } from 'react-i18next'
import "react-responsive-modal/styles.css";
import './style.scss'

function PrintClasses({ printClassesModal, closePrintClassesModal}) {
  const classes = useSelector((state) => state.classes);
  const [selectValue, setSelectValue] = useState()
  const [selected, setSelected] = useState(classes[Object.keys(classes)[0]])

  const { t } = useTranslation()

  function onSet(e) {
    let selectedOption = e.target.options.selectedIndex
    setSelectValue(e.target.value)
    setSelected(JSON.parse(e.target.options[selectedOption].id))
  }

  return (
    <Modal
    classNames={{ modal: "print-class" }}
    open={printClassesModal}
    onClose={() => closePrintClassesModal('classes')}
    center
    >
    <span className="class-select">
        {t('classes')}:
        <select className="OSstyle" value={selectValue} onChange={onSet}>
        {Object.entries(classes).map((item) => {
          return (
          <option id={JSON.stringify(item[1])} key={item[0]} value={item[1].longName}>
            {item[1].longName}
          </option>
          )
        })}
        </select>
    </span>
    <PrintComponent lessonsData={selected} section='classes'/>
    </Modal>
  )
}
export default PrintClasses
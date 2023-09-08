import { useImmer } from "use-immer";
import { useContext } from 'react'
import { TimeTableContext } from '../../context/TimeTableContext'
import { Modal } from "react-responsive-modal";
import { GiGreekTemple } from "react-icons/gi";
import { LiaTableSolid } from "react-icons/lia";
import "react-responsive-modal/styles.css";
import "./style.scss";

function selectionOptions(info) {
  let result = [];

  if (Array.isArray(info)) {
    return info.map(item => {
        return <option key={item} value={item}>{item}</option>;
    })
  }

  for (let i = 1; i <= info; i++) {
    result.push(<option key={i} value={i}>{i}</option>);
  }

  return result;
}

let initialValue = {
  nameOfSchool: '',
  year: '',
  registrationName: '',
  periodsPerDay: 1,
  numberOfDays: 1,
  weekend: 'Saturday - Sunday'
} 

function SchoolSettings({ schoolModal, closeSchoolModal }) {
  let [state, setState] = useContext(TimeTableContext)
  let [value, setValue] = useImmer(initialValue)
  let [contextValue, setContextValue] = useImmer({})

  function setContext() {
    setState((prev) => {
      prev.timeTable = {...prev.timeTable, ...contextValue}
    })
    closeSchoolModal('school')
    setValue(initialValue)
    setContextValue({})
  }

  function onSet(e) {
    setValue((prev) => {
      prev[e.target.name] = e.target.value
    })
    setContextValue((prev) => {
      prev[e.target.name] = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)
    })
  }

  function onClose() {
    closeSchoolModal('school')
    setValue(initialValue)
    setContextValue({})
  }

  return (
    <Modal
      classNames={{ modal: "school-settings" }}
      open={schoolModal}
      onClose={() => closeSchoolModal('school')}
      center
    >
      <section className="school-settings__schoolName-section">
        <GiGreekTemple className="icon" />
        <div className="text-block">
          <label>Name of school:</label>
          <label>Academic year:</label>
          <label>Registration name:</label>
        </div>
        <div className="input-block">
          <input value={value.nameOfSchool} onChange={onSet} name="nameOfSchool" type="text" placeholder="Name of school"/>
          <input value={value.year} onChange={onSet} name="year" type="text" placeholder="Academic year 2023/2024" />
          <div className="wrapper">
            <input value={value.registrationName} onChange={onSet} name="registrationName" type="text" placeholder="Registration name"/>
            <button className="OSstyle">Change</button>
          </div>
        </div>
      </section>

      <section className="school-settings__days-section">
        <LiaTableSolid className="icon" />
        <div className="text-block">
          <label>Periods per day:</label>
          <label>Number of days:</label>
          <label>Weekend:</label>
        </div>
        <div className="selection-block">
          <select value={value.periodsPerDay} onChange={onSet} className="OSstyle" name="periodsPerDay">
            {selectionOptions(31)}
          </select>
          <select value={value.numberOfDays} onChange={onSet} className="OSstyle" name="numberOfDays">
            {selectionOptions(10)}
          </select>
          <select value={value.weekend} onChange={onSet} className="OSstyle" name="weekend">
            {selectionOptions(['Saturday - Sunday', 'Friday - Saturday', 'Thursday - Friday'])}
          </select>
        </div>
        <div className="button-block">
          <button className="OSstyle">Bell Times/Rename periods</button>
          <button className="OSstyle">Rename days</button>
        </div>
      </section>
      <div className="confirm-button-block">
        <button className="OSstyle" onClick={setContext}>OK</button>
        <button className="OSstyle" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

export default SchoolSettings;

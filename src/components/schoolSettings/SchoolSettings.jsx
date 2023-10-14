import { updateTable } from "../../features/timTableSlice";
import { useDispatch } from "react-redux";
import { useImmer } from "use-immer";
import { useTranslation } from 'react-i18next'
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
  name: '',
  year: '',
  // registrationName: '',
  hours: 1,
  days: 1,
  // weekend: 'Saturday - Sunday'
} 

function SchoolSettings({ schoolModal, closeSchoolModal }) {
  let [value, setValue] = useImmer(initialValue)
  let [contextValue, setContextValue] = useImmer({})
  const dispatch = useDispatch()
  
  const { t } = useTranslation()

  function passAction(action, payload) {
    dispatch(action(payload))
  }

  function setContext() {
    passAction(updateTable, contextValue)
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
      onClose={onClose}
      center
    >
      <section className="school-settings__schoolName-section">
        <GiGreekTemple className="icon" />
        <div className="text-block">
          <label>{t('name of school')}:</label>
          <label>{t('academic year')}:</label>
          {/* <label>Registration name:</label> */}
        </div>
        <div className="input-block">
          <input value={value.name} onChange={onSet} name="name" type="text" placeholder={t('name of school')}/>
          <input value={value.year} onChange={onSet} name="year" type="text" placeholder={t('academic year')} />
          {/* <div className="wrapper"> */}
            {/* <input value={value.registrationName} onChange={onSet} name="registrationName" type="text" placeholder="Registration name"/> */}
            {/* <button className="OSstyle">Change</button> */}
          {/* </div> */}
        </div>
      </section>

      <section className="school-settings__days-section">
        <LiaTableSolid className="icon" />
        <div className="text-block">
          <label>{t('periods per day')}:</label>
          <label>{t('number of days')}:</label>
          {/* <label>Weekend:</label> */}
        </div>
        <div className="selection-block">
          <select value={value.hours} onChange={onSet} className="OSstyle" name="hours">
            {selectionOptions(8)}
          </select>
          <select value={value.days} onChange={onSet} className="OSstyle" name="days">
            {selectionOptions(7)}
          </select>
          {/* <select value={value.weekend} onChange={onSet} className="OSstyle" name="weekend">
            {selectionOptions(['Saturday - Sunday', 'Friday - Saturday', 'Thursday - Friday'])}
          </select> */}
        </div>
        {/* <div className="button-block">
          <button className="OSstyle">Bell Times/Rename periods</button>
          <button className="OSstyle">Rename days</button>
        </div> */}
      </section>
      <div className="confirm-button-block">
        <button className="OSstyle" onClick={setContext}>{t("ok")}</button>
        <button className="OSstyle" onClick={onClose}>{t("cancel")}</button>
      </div>
    </Modal>
  );
}

export default SchoolSettings;

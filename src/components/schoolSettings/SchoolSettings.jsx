import { useState, useContext } from "react";
import { updateTable } from "../../features/timTableSlice";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";
import { useTranslation } from 'react-i18next'
import { Modal } from "react-responsive-modal";
import { GiGreekTemple } from "react-icons/gi";
import { LiaTableSolid } from "react-icons/lia";
import { GlobalContext } from "../../App";
import Loader from "../ui/loader/Loader";
import "react-responsive-modal/styles.css";
import "./style.scss";

function selectionOptions(info) {
  let result = [];

  // if (Array.isArray(info)) {
  //   return info.map(item => {
  //       return <option key={item} value={item}>{item}</option>;
  //   })
  // }

  if (info == 55) {
    for (let i = 0; i <= info; i+=5) {
      result.push(<option key={i} value={i}>{i}</option>);
    }
    return result
  }

  if (info == 23) {
    for (let i = 0; i <= info; i++) {
      result.push(<option key={i} value={i}>{i}</option>);
    }
    return result
  }

  for (let i = 1; i <= info; i++) {
    result.push(<option key={i} value={i}>{i}</option>);
  }

  return result;
}

let modalStates = {
  bell: false,
  editBell: false,
  days: false,
  editDays: false,
};

function SchoolSettings({ schoolModal, closeSchoolModal }) {
  const initialFetch = useContext(GlobalContext)
  const table = useSelector((state) => state.timeTable);
  const dispatch = useDispatch()

  let initialValue = {
    name: table.name,
    year: table.year,
    hours: table.daysHours,
    days: table.weekDaysCount,
    timeInfo: false,
    daysInfo: false,
  } 
  
  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue)
  let [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)

  const { t } = useTranslation()

  function getFormatTime(type, typeOfTime) {
    let newTime = (value.timeInfo[type]?.replace(':', ' '))?.split(' ')
    if (!newTime) return ' '

    if (typeOfTime == 'hour') {
      return parseInt(newTime[0], 10) 
    } 

    if (typeOfTime == 'minute') {
      return parseInt(newTime[1], 10) 
    }

    return `
    Something passed wrong ! 
    Passed parameters: ${type}, ${typeOfTime}
    Expected: newTimeStart, hour or minute 
    or
    Expected: newTimeEnd, hour or minute
    `
  }

  async function passAction(action, payload) {
    setLoading(true)
    await dispatch(action(payload))
    await dispatch(initialFetch())
    setLoading(false)
  }

  function onOpen(name) {
    // name = name.toLowerCase();
    if (name == 'editBell') {
      setValue((draft) => {
        draft.timeInfo = selected
      })
    }
    if (name == 'editDays') {
      setValue((draft) => {
        draft.daysInfo = selected
      })
    }
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    // name = name.toLowerCase();
    setModal({ ...modal, [name]: false });
    setSelected(false)
    setValue(initialValue)
  }

  function onSet(e) {
    setValue((prev) => {
      if (!e.target.dataset.location) {
        prev[e.target.name] = isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value)
        return
      }

      if (!/newTimeStart|newTimeEnd/.test(e.target.name)) {
        prev[e.target.dataset.location][e.target.name] = e.target.value
        return
      }
      
      let newTime = prev.timeInfo[e.target.name].replace(':', ' ').split(' ')

      if (e.target.dataset.typeoftime == 'hour') {
        let start = e.target.value < 10 ? '0' + e.target.value : e.target.value
        prev.timeInfo[e.target.name] = start + ':' + newTime[1]
      }

      if (e.target.dataset.typeoftime == 'minute') {
        let end = e.target.value < 10 ? '0' + e.target.value : e.target.value
        prev.timeInfo[e.target.name] = newTime[0] + ':' + end
      }
    })
  }

  function setContext(name) {
    passAction(updateTable, value)
    onClose(name)
  }

  return (
    loading ?
    <Loader /> :
    <>
    <Modal
        classNames={{ modal: "school-settings" }}
        open={schoolModal}
        onClose={() => {closeSchoolModal('school'), setValue(initialValue)}}
        center
      >
        <section className="school-settings__schoolName-section">
          <GiGreekTemple className="icon" />
          <div className="text-block">
            <label>{t('name of school')}:</label>
            <label>{t('academic year')}:</label>
          </div>
          <div className="input-block">
            <input value={value.name || ''} onChange={onSet} name="name" type="text" placeholder={t('name of school')}/>
            <input value={value.year || ''} onChange={onSet} name="year" type="text" placeholder={t('academic year')} />
          </div>
        </section>
  
        <section className="school-settings__days-section">
          <LiaTableSolid className="icon" />
          <div className="text-block">
            <label>{t('periods per day')}:</label>
            <label>{t('number of days')}:</label>
          </div>
  
          <div className="selection-block">
            <select value={value.hours} onChange={onSet} className="OSstyle" name="hours">
              {selectionOptions(8)}
            </select>
            <select value={value.days} onChange={onSet} className="OSstyle" name="days">
              {selectionOptions(7)}
            </select>
          </div>
  
          <div className="modals-block">
            <button 
            className="OSstyle"
            onClick={() => onOpen('bell')}
            >
              {t("bell times / rename periods")}
            </button>
            <button 
            className="OSstyle"
            onClick={() => onOpen('days')}
            >
              {t("rename days")}
            </button>
          </div>
        </section>
        <div className="confirm-button-block">
          <button 
          className="OSstyle" 
          onClick={()=>{
          passAction(updateTable, value), 
          closeSchoolModal('school')
          }}
          >
            {t("ok")}
          </button>
          <button className="OSstyle" onClick={()=>{
            closeSchoolModal('school')
            setValue(initialValue)
          }}>
            {t("cancel")}
          </button>
        </div>
    </Modal>

    <Modal
    classNames={{modal: 'bells-modal modals-action'}} 
    open={modal.bell} 
    onClose={() => onClose("bell")} 
    center
    >
      <main className='container'>
        <table className='bells-list'>
          <thead>
            <tr>
            {['Name','Short-Name','Start time','End time'].map((item) => {
                return <th key={item}>{t(item.toLowerCase())}</th>
            })}
            </tr>
          </thead>
          <tbody>
          {Object.values(table?.weekDays[1]?.hours).map(({
            hourId, 
            name: newName, 
            shortName: newShortName, 
            timeStart: newTimeStart, 
            timeEnd: newTimeEnd
          }) => {
                return (
                <tr 
                className={selected.hourId == hourId ? 'selected-row' : ''} 
                key={hourId} 
                onClick={() => setSelected({hourId, newName, newShortName, newTimeStart, newTimeEnd})}
                >
                  <td>{newName}</td>
                  <td>{newShortName}</td>
                  <td>{newTimeStart}</td>
                  <td>{newTimeEnd}</td>
                </tr>
              )
          })}
          </tbody>
        </table>

      <aside className="right-sidebar">
          <button
            className='OSstyle'
            onClick={() => onOpen('editBell')}
            disabled={!selected ? true : false}
          >
            {t('edit')}
          </button>
      </aside>
      </main>
    </Modal>
          
    <Modal 
    classNames={{modal: 'edit-bells modals-action'}} 
    open={modal.editBell} 
    onClose={() => onClose("editBell")} 
    center
    >
      <div className="container">
      <div className="text-block">
        <label>{t("name of the period")}:</label>
        <label>{t("short-name")}:</label>
        <label>{t("start time")}:</label>
        <label>{t("end time")}:</label>
      </div>
      <div className="input-block">
        <input data-location='timeInfo' name='newName' value={value.timeInfo.newName || ''} onChange={onSet} type="text" placeholder={t("name of the period")}/>
        <input data-location='timeInfo' name='newShortName' value={value.timeInfo.newShortName || ''} onChange={onSet} type="text" placeholder={t("short-name")}/>
       
        <div className="selection-block">
        <select
        data-location='timeInfo'
        name="newTimeStart"
        data-typeoftime='hour'
        className="OSstyle" 
        value={getFormatTime('newTimeStart', 'hour') || ''} 
        onChange={onSet} 
        >
          {selectionOptions(23)}
        </select>

        <select
        data-location='timeInfo'
        name="newTimeStart"
        data-typeoftime='minute'
        className="OSstyle" 
        value={getFormatTime('newTimeStart', 'minute') || ''} 
        onChange={onSet} 
        >
          {selectionOptions(55)}
        </select>
        </div>

        <div className="selection-block">
        <select
        data-location='timeInfo'
        name="newTimeEnd"
        data-typeoftime='hour'
        className="OSstyle" 
        value={getFormatTime('newTimeEnd', 'hour') || ''} 
        onChange={onSet} 
        >
          {selectionOptions(23)}
        </select>

        <select
        data-location='timeInfo'
        name="newTimeEnd"
        data-typeoftime='minute'
        className="OSstyle" 
        value={getFormatTime('newTimeEnd', 'minute') || ''} 
        onChange={onSet} 
        >
          {selectionOptions(55)}
        </select>
        </div>
      </div>
      <div className="button-block">
        <button className="OSstyle" onClick={()=>setContext('editBell')}>{t("ok")}</button>
        <button className="OSstyle" onClick={()=>onClose('editBell')}>{t("cancel")}</button>
      </div>
      </div>
    </Modal>

    <Modal
    classNames={{modal: 'days-modal modals-action'}} 
    open={modal.days} 
    onClose={() => onClose("days")} 
    center
    >
      <main className='container'>
        <table className='days-list'>
          <thead>
            <tr>
            {['Name','Short-Name'].map((item) => {
                return <th key={item}>{t(item.toLowerCase())}</th>
            })}
            </tr>
          </thead>
          <tbody>
          {Object.entries(table.weekDays).map((item) => {
                return (
                <tr 
                className={selected.dayId == item[1].dayId ? 'selected-row' : ''} 
                key={item[1].dayId} 
                onClick={() => setSelected({
                  dayId: item[1].dayId, 
                  newDayName: item[1].name, 
                  newShortName: item[1].shortName
                  })}>
                  <td>{item[1].name}</td>
                  <td>{item[1].shortName}</td>
                </tr>
              )
          })}
          </tbody>
        </table>

      <aside className="right-sidebar">
          <button
            className='OSstyle'
            onClick={() => onOpen('editDays')}
            disabled={!selected ? true : false}
          >
            {t('edit')}
          </button>
      </aside>
      </main>
    </Modal>

    <Modal 
    classNames={{modal: 'edit-days modals-action'}} 
    open={modal.editDays} 
    onClose={() => onClose("editDays")} 
    center
    >
      <div className="container">
      <div className="text-block">
        <label>{t("name")}:</label>
        <label>{t("short-name")}:</label>
      </div>
      <div className="input-block">
        <input data-location='daysInfo' name='newDayName' value={value.daysInfo.newDayName || ''} onChange={onSet} type="text" placeholder={t("name")}/>
        <input data-location='daysInfo' name='newShortName' value={value.daysInfo.newShortName || ''} onChange={onSet} type="text" placeholder={t("short-name")}/>
      </div>
      <div className="button-block">
        <button className="OSstyle" onClick={()=>setContext('editDays')}>{t("ok")}</button>
        <button className="OSstyle" onClick={()=>onClose('editDays')}>{t("cancel")}</button>
      </div>
      </div>
    </Modal>
    </>
  ); 
}

export default SchoolSettings;

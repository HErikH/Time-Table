import { addSubject, editSubject, deleteSubject } from "../../features/subjectsSlice";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useImmer } from "use-immer";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { BiPlusCircle } from "react-icons/bi";
import { PiNotebook } from "react-icons/pi";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import './style.scss'

let buttonData = [
  {
    icon: <BiPlusCircle style={{ fill: "#009879" }} />,
    className: "OSstyle",
    text: "New",
  },
  {
    icon: <PiNotebook style={{ fill: "#EDC369" }} />,
    className: "OSstyle",
    text: "Edit",
  },
  {
    icon: <MdOutlineRemoveCircleOutline style={{ fill: "red" }} />,
    className: "OSstyle",
    text: "Delete",
  },
];

let modalStates = {
  new: false,
  edit: false,
  delete: false,
  error: false,
};

let initialValue = {
  longName: "",
  shortName: "",
};

function SubjectsSettings({ subjectsModal, closeSubjectsModal }) {
  const subjects = useSelector(state => state.subjects)
  const dispatch = useDispatch()

  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue);
  let [selected, setSelected] = useState(false)

  let { t } = useTranslation();

  function passAction(action, payload) {
    dispatch(action(payload))
  }
  
  function onOpen(name) {
    name = name.toLowerCase();
    if (name == 'edit') {
      setValue((prev) => {
        prev.longName = selected[1].longName
        prev.shortName = selected[1].shortName
      })
    }
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    setModal({ ...modal, [name]: false });
    setSelected(false)
    setValue(initialValue)
  }

  function onSet(e) {
    setValue((prev) => {
      prev[e.target.name] = e.target.value
    })
  }

  function setContext(name) {
    if (name == 'new') {
      for (const key in subjects) {
        if (
          String(subjects[key].longName.toLowerCase()) == value.longName.toLowerCase()
          ) {       
          onOpen('error')
          return
        } 
      }
      passAction(addSubject, value)
      onClose(name)
      return
    } else if (name == 'edit') {
      for (const key in subjects) {
        if (
          String(subjects[key].longName).toLowerCase() == value.longName.toLowerCase() && 
          subjects[key].subjectId != selected[0]
          ) {          
          onOpen('error')
          return
        } 
      }
      passAction(editSubject, {subjectId: selected[0], data: value})
      onClose(name)
      return
    } else if (name == 'delete') {
      passAction(deleteSubject, selected[0])
      onClose(name)
      return
    } else {
      return
    }
  }

  return (
    <>
    <Modal
      classNames={{ modal: 'subjects-settings' }}
      open={subjectsModal}
      onClose={() => {closeSubjectsModal('subjects'); setSelected(false)}}
      center
    >
      <main className='container'>
        <table className='subjects-list'>
          <thead>
            <tr>
            {['Name','Short-Name','Count','Time off'].map((item) => {
                return <th key={item}>{t(item.toLocaleLowerCase())}</th>
            })}
            </tr>
          </thead>
          <tbody>
          {Object.entries(subjects).map((item) => {
            return (
            <tr 
            className={selected[0] == item[0] ? 'selected-row' : ''} 
            key={item[0]} 
            onClick={() => setSelected(item)}
            >
              <td>{item[1].longName}</td>
              <td>{item[1].shortName}</td>
              <td></td>
              <td></td>
            </tr>
          )})}
          </tbody>
        </table>

      <aside className="right-sidebar">
        {buttonData.map(({ icon, className, text }) => {
          return (
            <button
              key={text}
              className={className}
              onClick={() => onOpen(text)}
              disabled={text != 'New' && !selected ? true : false}
            >
              <span style={{opacity: text != 'New' && !selected ? 0.5 : 1}}>
                {icon}
              </span>
              {t(text.toLocaleLowerCase())}
            </button>
          );
        })}
      </aside>
      </main>

    </Modal>

    <Modal classNames={{modal: 'create-subject subjects-action'}} open={modal.new} onClose={() => onClose("new")} center>
      <div className="container">
      <div className="text-block">
        <label>{t("subject title")}:</label>
        <label>{t("short-name")}:</label>
      </div>
      <div className="input-block">
        <input name='longName' value={value.longName} onChange={onSet} type="text" placeholder={t("subject title")}/>
        <input name='shortName' value={value.shortName} onChange={onSet} type="text" placeholder={t("short-name")}/>
      </div>
      <div className="button-block">
        <button className="OSstyle" onClick={()=>setContext('new')}>{t("ok")}</button>
        <button className="OSstyle" onClick={()=>onClose('new')}>{t("cancel")}</button>
      </div>
      </div>
    </Modal>

    <Modal classNames={{modal: 'edit-subject subjects-action'}} open={modal.edit} onClose={() => onClose("edit")} center>
      <div className="container">
      <div className="text-block">
        <label>{t("subject title")}:</label>
        <label>{t("short-name")}:</label>
      </div>
      <div className="input-block">
        <input name='longName' value={value.longName} onChange={onSet} type="text" placeholder={t("subject title")}/>
        <input name='shortName' value={value.shortName} onChange={onSet} type="text" placeholder={t("short-name")}/>
      </div>
      <div className="button-block">
        <button className="OSstyle" onClick={()=>setContext('edit')}>{t("ok")}</button>
        <button className="OSstyle" onClick={()=>onClose('edit')}>{t("cancel")}</button>
      </div>
      </div>
    </Modal>

    <Modal classNames={{modal: 'delete-subject'}} open={modal.delete} onClose={() => onClose("delete")} center>
      <div className="button-block">
        <button className="OSstyle" onClick={()=>setContext('delete')}>{t("ok")}</button>
        <button className="OSstyle" onClick={()=>onClose('delete')}>{t("cancel")}</button>
      </div>
    </Modal>
        
    <Modal 
    classNames={{modal: 'subject-exists'}} 
    open={modal.error} 
    onClose={()=>onClose('error')} 
    center
    >
      {t("subject exists")}
    </Modal>
  </> 
  );
}

export default SubjectsSettings;

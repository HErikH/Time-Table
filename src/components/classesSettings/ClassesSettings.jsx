import { addClass, editClass, deleteClass } from '../../features/classesSlice';
import { useSelector, useDispatch } from 'react-redux/es/exports'
import { useImmer } from 'use-immer';
import { useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { BiPlusCircle } from "react-icons/bi";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import './style.scss'

let buttonData = [
  {
    icon: <BiPlusCircle style={{ fill: "#009879" }} />,
    className: "OSstyle",
    text: "New",
  },
  { 
    icon: <BsPeople style={{ fill: "#EDC369" }}/>, 
    className: "OSstyle", 
    text: "Edit" 
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
}

let initialValue = {
  longName: '', 
  shortName: ''
}

function ClassesSettings({ classesModal, closeClassesModal }) {
  const classes = useSelector(state => state.classes)
  const dispatch = useDispatch()

  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue);
  let [selected, setSelected] = useState(false)
  
  function passAction(action, payload) {
    dispatch(action(payload))
  }

  function onOpen(name) {
    name = name.toLowerCase();
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
      for (const key in classes) {
        if (classes[key].longName == value.longName) {          
          onOpen('error')
          return
        } else {
          passAction(addClass, value)
          onClose(name)
          return
        }
      }
    } else if (name == 'edit') {
      for (const key in classes) {
        if (classes[key].longName == value.longName) {          
          onOpen('error')
          return
        } else {
          passAction(editClass, {classId: selected[0], data: value})
          onClose(name)
          return
        }
      }
    } else if (name == 'delete') {
      passAction(deleteClass, selected[0])
      onClose(name)
      return
    } else {
      return
    }
  }

  return (
    <>
      <Modal
        classNames={{ modal: 'classes-settings' }}
        open={classesModal}
        onClose={() => closeClassesModal('classes', setSelected)}
        center
      >
        <main className='container'>
          <table className='classes-list'>
            <thead>
              <tr>
              {['Name','Short-Name','Count','Time off'].map((item) => {
                  return <th key={item}>{item}</th>
              })}
              </tr>
            </thead>
            <tbody>
            {Object.entries(classes).map((item) => {
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
                {text}
              </button>
            );
          })}
        </aside>
        </main>

      </Modal>

      <Modal classNames={{modal: 'create-classes classes-action'}} open={modal.new} onClose={() => onClose("new")} center>
        <div className="container">
        <div className="text-block">
          <label>Class name:</label>
          <label>Short name:</label>
        </div>
        <div className="input-block">
          <input name='longName' value={value.longName} onChange={onSet} type="text" placeholder="Class name"/>
          <input name='shortName' value={value.shortName} onChange={onSet} type="text" placeholder="Short name"/>
        </div>
        <div className="button-block">
          <button className="OSstyle" onClick={()=>setContext('new')}>OK</button>
          <button className="OSstyle" onClick={()=>onClose('new')}>Cancel</button>
        </div>
        </div>
      </Modal>

      <Modal classNames={{modal: 'edit-classes classes-action'}} open={modal.edit} onClose={() => onClose("edit")} center>
        <div className="container">
        <div className="text-block">
          <label>Class name:</label>
          <label>Short:</label>
        </div>
        <div className="input-block">
          <input name='longName' value={value.longName} onChange={onSet} type="text" placeholder="Class name"/>
          <input name='shortName' value={value.shortName} onChange={onSet} type="text" placeholder="Short"/>
        </div>
        <div className="button-block">
          <button className="OSstyle" onClick={()=>setContext('edit')}>OK</button>
          <button className="OSstyle" onClick={()=>onClose('edit')}>Cancel</button>
        </div>
        </div>
      </Modal>

      <Modal classNames={{modal: 'delete-class'}} open={modal.delete} onClose={() => onClose("delete")} center>
        <div className="button-block">
          <button className="OSstyle" onClick={()=>setContext('delete')}>Confirm</button>
          <button className="OSstyle" onClick={()=>onClose('delete')}>Cancel</button>
        </div>
      </Modal>
          
      <Modal 
      classNames={{modal: 'class-exists'}} 
      open={modal.error} 
      onClose={()=>onClose('error')} 
      center
      >
        The class already exists !
      </Modal>
    </>
  );
}

export default ClassesSettings;

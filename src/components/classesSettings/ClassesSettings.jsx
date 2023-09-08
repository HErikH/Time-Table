import { useContext } from 'react'
import { useImmer } from 'use-immer';
import { useState } from "react";
import { TimeTableContext } from '../../context/TimeTableContext'
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
    text: "Remove",
  },
];

let modalStates = {
  new: false,
  edit: false,
  remove: false,
  error: false,
}

let initialValue = {
    className: '', 
    short: ''
}

function ClassesSettings({ classesModal, closeClassesModal }) {
  let [state, setState] = useContext(TimeTableContext)
  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue);
  let [selected, setSelected] = useState(false)

  function onOpen(name) {
    name = name.toLowerCase();
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    setModal({ ...modal, [name]: false });
    setValue(initialValue)
  }

  function onSet(e) {
    setValue((prev) => {
      prev[e.target.name] = e.target.value
    })
  }

  function setContext(name) {
    if (name == 'new' && state.classes[value.className]) {
      onOpen('error')
      return
    } else if (name == 'edit') {
      setState((prev) => {
        prev.classes[selected[0]] = {
           className: value.className, 
           short: value.short 
        }}) 
      onClose(name)
      return
    } else if (name == 'remove') {
      setState(prev => {delete prev.classes[selected[0]]}) 
      setSelected(false)
      onClose(name)
      return
    }

    setState((prev) => {
      prev.classes[value.className] = {
         className: value.className, 
         short: value.short 
    }})

    setSelected(false)
    onClose(name)
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
              {['Name','Short','Count','Time off'].map((item) => {
                  return <th key={item}>{item}</th>
              })}
              </tr>
            </thead>
            <tbody>
            {Object.entries(state.classes).map((item) => {
              return (
              <tr 
              className={selected[0] == item[0] ? 'selected-row' : ''} 
              key={item[0]} 
              onClick={() => setSelected(item)}
              >
                <td>{item[1].className}</td>
                <td>{item[1].short}</td>
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
          <label>Short:</label>
        </div>
        <div className="input-block">
          <input name='className' value={value.className} onChange={onSet} type="text" placeholder="Class name"/>
          <input name='short' value={value.short} onChange={onSet} type="text" placeholder="Short"/>
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
          <input name='className' value={value.className} onChange={onSet} type="text" placeholder="Class name"/>
          <input name='short' value={value.short} onChange={onSet} type="text" placeholder="Short"/>
        </div>
        <div className="button-block">
          <button className="OSstyle" onClick={()=>setContext('edit')}>OK</button>
          <button className="OSstyle" onClick={()=>onClose('edit')}>Cancel</button>
        </div>
        </div>
      </Modal>

      <Modal classNames={{modal: 'remove-classes'}} open={modal.remove} onClose={() => onClose("remove")} center>
        <div className="button-block">
          <button className="OSstyle" onClick={()=>setContext('remove')}>Confirm</button>
          <button className="OSstyle" onClick={()=>onClose('remove')}>Cancel</button>
        </div>
      </Modal>
          
      <Modal 
      classNames={{modal: 'class-created'}} 
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

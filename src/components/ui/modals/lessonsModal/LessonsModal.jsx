import { useState, useContext } from "react";
import { GlobalContext } from "../../../../App";
import { useImmer } from "use-immer";
import { Modal } from "react-responsive-modal";
import { addLesson, editLesson, deleteLesson } from "../../../../features/lessonsSlice";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useTranslation } from "react-i18next";
import "react-responsive-modal/styles.css";
import "./style.scss";

function selectionOptions(info) {
  let result = [];

  if (Array.isArray(info)) {
    return info.map((item) => {
      return (
        <option 
        id={item.teacherId || item.subjectId || item.classId || item.classRoomId} 
        key={item.teacherId || item.subjectId || item.classId || item.classRoomId} 
        value={item.name || item.longName}
        >
          {item.name || item.longName}
        </option>
      );
    });
  }

  for (let i = 1; i <= info; i++) {
    result.push(
      <option key={i} value={i}>
        {i}
      </option>
    );
  }

  return result;
}

let buttonData = [
  {
    className: "OSstyle",
    text: "New lesson",
    modalState: "new",
  },
  {
    className: "OSstyle",
    text: "Edit lesson",
    modalState: "edit",
  },
  {
    className: "OSstyle",
    text: "Delete",
    modalState: "delete",
  },
  // {
  //   className: "OSstyle",
  //   text: "Close",
  //   modalState: "close",
  // },
];

let modalStates = {
  new: false,
  edit: false,
  delete: false,
};

let initialValue = {
  teacher: "",
  subject: "",
  class: "",
  classroom: '',
  count: 1,
};

function LessonsModal({ section, lessonsModal, closeLessonsModal }) {
  const initialFetch = useContext(GlobalContext)
  const teachers = useSelector((state) => state.teachers);
  const subjects = useSelector((state) => state.subjects);
  const classes = useSelector((state) => state.classes);
  const classrooms = useSelector((state) => state.classrooms);
  const lessons = useSelector((state) => state.lessons);
  const dispatch = useDispatch();

  let collectiveInitialValue = {
    teachersId: {},
    subjectId: '',
    classesId: {},
    classRoomsId: {},
    lessonsCount: 1,
  }

  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue);
  let [collective, setCollective] = useImmer(collectiveInitialValue);
  let [selected, setSelected] = useState(false);

  let { t } = useTranslation()

  async function passAction(action, payload = "Haven't been passed any value") {
    await dispatch(action(payload));
    await initialFetch()
  }

  function onOpen(name) {
    if (name == "edit") {
      setCollective((prev) => {
        prev.teachersId[Object.keys(selected[1].teachersId)[0]] = Object.keys(selected[1].teachersId)[0]
        prev.subjectId = selected[1].subjectId
        prev.classesId[Object.keys(selected[1].classesId)[0]] = Object.keys(selected[1].classesId)[0]
        prev.classRoomsId[Object.keys(selected[1].classRoomsId)[0]] = Object.keys(selected[1].classRoomsId)[0]
        prev.lessonsCount = selected[1].lessonsCount
      })
      setValue((prev) => {
        prev.teacher = teachers[Object.keys(selected[1].teachersId)[0]].name
        prev.subject = subjects[selected[1].subjectId].longName
        prev.class = classes[Object.keys(selected[1].classesId)[0]].longName
        prev.classroom = classrooms[Object.keys(selected[1].classRoomsId)[0]].longName
        prev.count = selected[1].lessonsCount
      });
    }
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    name && setModal({ ...modal, [name]: false });
    closeLessonsModal("lessons")
    setSelected(false);
    setCollective(collectiveInitialValue)
    setValue(initialValue);
  }

  function onSet(e) {
    let selectedOption = e.target.options.selectedIndex
    setValue((prev) => {
      prev[e.target.name] = e.target.value;
    });

    setCollective((prev) => {
        switch(e.target.name) {
            case 'teacher':
                // ! for many teachers
                // prev.teachersId[e.target.options[selectedOption].id] = e.target.options[selectedOption].id
                prev.teachersId = { [e.target.options[selectedOption].id]: e.target.options[selectedOption].id }
                break
            case 'subject':
                prev.subjectId = e.target.options[selectedOption].id
                break
            case 'class':
                // ! for many classes
                // prev.classesId[e.target.options[selectedOption].id] = e.target.options[selectedOption].id
                prev.classesId = { [e.target.options[selectedOption].id]: e.target.options[selectedOption].id }
                break
            case 'classroom':
                // ! for many classrooms
                // prev.classRoomsId[e.target.options[selectedOption].id] = e.target.options[selectedOption].id
                prev.classRoomsId = { [e.target.options[selectedOption].id]: e.target.options[selectedOption].id }
                break
            case 'count':
                prev.lessonsCount = +e.target.value
                break
        }
    })
  }

  function setContext(name) {
    if (name == "new") {
    if(!value.teacher || !value.subject || !value.class || !value.classroom) {
        onOpen("error");
        return;
    }
    //   for (const key in classes) {
    //     if (
    //       String(classes[key].longName).toLowerCase() == value.longName.toLowerCase()
    //       ) {
    //       onOpen("error");
    //       return;
    //     }
    //   }
      passAction(addLesson, collective)
      onClose(name);
      return;
    } else if (name == "edit") {
      // for (const key in classes) {
      //   if (
      //     String(classes[key].longName).toLowerCase() == value.longName.toLowerCase() &&
      //     classes[key].classId != selected[0]
      //   ) {
      //     onOpen("error");
      
      //     return;
      //   }
      // }
      passAction(editLesson, { ...collective, lessonId: selected[0]});
      onClose(name);
      return;
    } else if (name == "delete") {
      passAction(deleteLesson, selected[0]);
      onClose(name);
      return;
    } else {
      return;
    }
  }

  return (
    <>
      <Modal
        classNames={{ modal: "lessons-settings" }}
        open={lessonsModal}
        onClose={onClose}
        center
      >
        <main className="container">
          <table className="lessons-list">
            <thead>
              <tr>
                {["Subject", "Teacher", "Class", "Count", "Classroom name"].map((item) => {
                  return <th key={item}>{t(item.toLowerCase())}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {section && Object.values(section?.lessons).map((id) => {
                return Object.entries({[id]: lessons[id]}).map((item) => {
                  return (
                    <tr
                      className={selected[0] == item[0] ? "selected-row" : ""}
                      key={item[0]}
                      onClick={() => setSelected(item)}
                    >
                      <td>{subjects[item[1]?.subjectId]?.longName}</td>
                      <td>{
                      item[1]?.teachersId && 
                      teachers[Object.keys(item[1]?.teachersId)[0]]?.name
                      }</td>
                      <td>{
                      item[1]?.classesId && 
                      classes[Object.keys(item[1]?.classesId)[0]]?.longName
                      }</td>
                      <td>{item[1]?.lessonsCount}</td>
                      <td>{
                      item[1]?.classRoomsId && 
                      classrooms[Object.keys(item[1]?.classRoomsId)[0]]?.longName
                      }</td>
                    </tr>
                  );
                })
              })} 
            </tbody>
          </table>

          <div className="button-block">
            {buttonData.map(({ className, text, modalState }) => {
              return (
                <button
                  key={modalState}
                  className={className}
                  onClick={() => onOpen(modalState)}
                  disabled={modalState != "new" && !selected ? true : false}
                >
                  {t(text.toLocaleLowerCase())}
                </button>
              );
            })}
          </div>
        </main>
      </Modal>

      <Modal
        classNames={{ modal: "create-lesson lessons-action" }}
        open={modal.new}
        onClose={() => onClose("new")}
        center
      >
        <div className="container">
          <div className="selection-block">
              <label>
                {t("teacher")}
                  <select
                    value={value.teacher}
                    onChange={onSet}
                    className="OSstyle"
                    name="teacher"
                    collective=''
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(teachers))}
                  </select>
              </label>
            <label>
              {t("subject")}
                  <select
                    value={value.subject}
                    onChange={onSet}
                    className="OSstyle"
                    name="subject"
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(subjects))}
                  </select>
            </label>
            <label>
              {t("class")}
                  <select
                    value={value.class}
                    onChange={onSet}
                    className="OSstyle"
                    name="class"
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(classes))}
                  </select>
            </label>
            <label>
              {t("classroom name")}
                  <select
                    value={value.classroom}
                    onChange={onSet}
                    className="OSstyle"
                    name="classroom"
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(classrooms))}
                  </select>
            </label>
            <label>
              {t("lessons/week")}
                  <select
                    value={value.count}
                    onChange={onSet}
                    className="OSstyle"
                    name="count"
                  >
                    {selectionOptions(9)}
                  </select>
            </label>
          </div>

          <div className="button-block">
            <button className="OSstyle" onClick={() => setContext("new")}>
              {t("ok")}
            </button>
            <button className="OSstyle" onClick={() => onClose("new")}>
              {t("cancel")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        classNames={{ modal: "edit-lesson lessons-action" }}
        open={modal.edit}
        onClose={() => onClose("edit")}
        center
      >
        <div className="container">
        <div className="selection-block">
              <label>
                {t("teacher")}
                  <select
                    value={value.teacher}
                    onChange={onSet}
                    className="OSstyle"
                    name="teacher"
                    collective=''
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(teachers))}
                  </select>
              </label>
            <label>
                {t("subject")}
                  <select
                    value={value.subject}
                    onChange={onSet}
                    className="OSstyle"
                    name="subject"
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(subjects))}
                  </select>
            </label>
            <label>
                {t("class")}
                  <select
                    value={value.class}
                    onChange={onSet}
                    className="OSstyle"
                    name="class"
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(classes))}
                  </select>
            </label>
            <label>
              {t("classroom name")}
                  <select
                    value={value.classroom}
                    onChange={onSet}
                    className="OSstyle"
                    name="classroom"
                  >
                    <option value=""></option>
                    {selectionOptions(Object.values(classrooms))}
                  </select>
            </label>
            <label>
                {t("lessons/week")}
                  <select
                    value={value.count}
                    onChange={onSet}
                    className="OSstyle"
                    name="count"
                  >
                    {selectionOptions(9)}
                  </select>
            </label>
          </div>

          <div className="button-block">
            <button className="OSstyle" onClick={() => setContext("edit")}>
              {t("ok")}
            </button>
            <button className="OSstyle" onClick={() => onClose("edit")}>
              {t("cancel")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        classNames={{ modal: "delete-lesson" }}
        open={modal.delete}
        onClose={() => onClose("delete")}
        center
      >
        <div className="button-block">
          <button className="OSstyle" onClick={() => setContext("delete")}>
            {t("ok")}
          </button>
          <button className="OSstyle" onClick={() => onClose("delete")}>
            {t("cancel")}
          </button>
        </div>
      </Modal>

      <Modal
        classNames={{ modal: "error" }}
        open={modal.error}
        onClose={() => onClose("error")}
        center
      >
        {t("necessary inputs")}
      </Modal>
    </>
  );
}

export default LessonsModal;

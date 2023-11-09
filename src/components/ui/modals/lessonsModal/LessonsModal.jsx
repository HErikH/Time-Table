import { useState, useContext } from "react";
import { GlobalContext } from "../../../../App";
import { useImmer } from "use-immer";
import { Modal } from "react-responsive-modal";
import { addLesson, editLesson, deleteLesson } from "../../../../features/lessonsSlice";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useTranslation } from "react-i18next";
import Loader from "../../loader/Loader";
import "react-responsive-modal/styles.css";
import "./style.scss";

import { getFooterStacks } from "../../../../features/dragDropSlice";


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
  error: false,
};

let initialValue = {
  teacher: "",
  subject: "",
  class: "",
  classroom: '',
  count: 1,
};

function LessonsModal({ sectionData: {data, section}, lessonsModal, closeLessonsModal }) {
  const initialFetch = useContext(GlobalContext)
  const table = useSelector((state) => state.timeTable)
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
  let [errorText, setErrorText] = useState('');
  let [errorButtons, setErrorButtons] = useState(false);
  const [loading, setLoading] = useState(false)

  let { t } = useTranslation()

  async function passAction(action, payload = "Haven't been passed any value") {
    setLoading(true)
    await dispatch(action(payload));
    await initialFetch()
    setLoading(false)
  }

  function onOpen(name) {
    if (name == 'new') {
      setCollective((prev) => {
        section == "subjects" ?
        prev.subjectId = data.subjectId :
        section == "classes" ?
        prev.classesId[data.classId] = data.classId :
        section == "classrooms" ?
        prev.classRoomsId[data.classRoomId] = data.classRoomId :
        section == "teachers" ?
        prev.teachersId[data.teacherId] = data.teacherId : 
        ''
      })
      setValue((prev) => {
        section == "subjects" ?
        prev.subject = subjects[data.subjectId].longName :
        section == "classes" ?
        prev.class = classes[data.classId].longName :
        section == "classrooms" ?
        prev.classroom = classrooms[data.classRoomId].longName :
        section == "teachers" ?
        prev.teacher = teachers[data.teacherId].name : 
        ''
      }) 
    }

    if (name == "edit") {
      setCollective((prev) => {
        prev.teachersId[Object.keys(selected[1].teachersId)[0]] = Object.keys(selected[1].teachersId)[0]
        prev.subjectId = selected[1].subjectId
        prev.classesId[Object.keys(selected[1].classesId)[0]] = Object.keys(selected[1].classesId)[0]
        prev.classRoomsId[Object.keys(selected[1].classRoomsId)[0]] = Object.keys(selected[1].classRoomsId).length ? 
        Object.keys(selected[1].classRoomsId)[0] : ''
        prev.lessonsCount = selected[1].lessonsCount
      })
      setValue((prev) => {
        prev.teacher = teachers[Object.keys(selected[1].teachersId)[0]].name
        prev.subject = subjects[selected[1].subjectId].longName
        prev.class = classes[Object.keys(selected[1].classesId)[0]].longName
        prev.classroom = Object.keys(selected[1].classRoomsId).length ? 
        classrooms[Object.keys(selected[1].classRoomsId)[0]].longName : ''
        prev.count = selected[1].lessonsCount 
      });
    }
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    if (name != 'error') {
      setSelected(false)
      setCollective(collectiveInitialValue)
      setValue(initialValue)
    }
    setModal({ ...modal, [name]: false })
    setErrorButtons(false)
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

  function setContextImmediately() {
    passAction(addLesson, collective)
    onClose('error')
  }

  function setContext(name) {
    if (name == 'delete') {
      passAction(deleteLesson, selected[0]);
      onClose(name);
      return
    }
    if(!value.teacher || !value.subject || !value.class) {
      setErrorText(t("necessary inputs"))
      onOpen("error");
      return;
    } else if (value.subject && section == "subjects" && value.subject != subjects[data.subjectId].longName) {
      setErrorText(`
      ${t('you are currently editing lesson for subject')}(${subjects[data.subjectId].longName})
      ${t('however you have just inputted a subject')}(${value.subject})
      ${t('do you want to continue and add this lesson anyway ?')}
      `)
      setErrorButtons(true)
      onOpen("error")
      return
    } else if (value.class && section == "classes" && value.class != classes[data.classId].longName) {
      setErrorText(`
      ${t('you are currently editing lesson for class')}(${classes[data.classId].longName})
      ${t('however you have just inputted a class')}(${value.class})
      ${t('do you want to continue and add this lesson anyway ?')}
      `)
      setErrorButtons(true)
      onOpen("error")
      return
    } else if (value.classroom && section == "classrooms" && value.classroom != classrooms[data.classRoomId].longName) {
      setErrorText(`
      ${t('you are currently editing lesson for classroom')}(${classrooms[data.classRoomId].longName})
      ${t('however you have just inputted a classroom')}(${value.classroom})
      ${t('do you want to continue and add this lesson anyway ?')}
      `)
      setErrorButtons(true)
      onOpen("error")
      return
    } else if (value.teacher && section == "teachers" && value.teacher != teachers[data.teacherId].name) {
      setErrorText(`
      ${t('you are currently editing lesson for teacher')}(${teachers[data.teacherId].name})
      ${t('however you have just inputted a teacher')}(${value.teacher})
      ${t('do you want to continue and add this lesson anyway ?')}
      `)
      setErrorButtons(true)
      onOpen("error")
      return
    } else {
      passAction(
      name == 'new' ? addLesson : editLesson, 
      name == 'new' ? collective : { ...collective, lessonId: selected[0]}
      )
      onClose(name);
    }
  }

  return (
    loading ?
    <Loader /> :
    <>
      <Modal
        classNames={{ modal: "lessons-settings" }}
        open={lessonsModal}
        onClose={() => {
        closeLessonsModal('lessons')
        setSelected(false)
        setCollective(collectiveInitialValue)
        setValue(initialValue)
        }}
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
              {data && Object.values(data?.lessons).map((id) => {
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
                    {selectionOptions(table.weekDaysCount * table.daysHours)}
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
                    {selectionOptions(table.weekDaysCount * table.daysHours)}
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
        {errorText}
        {errorButtons && (
          <div className="button-block">
          <button className="OSstyle" onClick={setContextImmediately}>
            {t("ok")}
          </button>
          <button className="OSstyle" onClick={() => onClose("error")}>
            {t("cancel")}
          </button>
          </div>
        )
        }
      </Modal> 
    </>
  );
}

export default LessonsModal;

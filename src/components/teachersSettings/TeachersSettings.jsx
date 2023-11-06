import { addTeacher, editTeacher, deleteTeacher } from '../../features/teachersSlice'
import { GlobalContext } from "../../App";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useState, useContext } from "react";
import { useImmer } from "use-immer";
import { useTranslation } from 'react-i18next';
import { Modal } from "react-responsive-modal";
import LessonsModal from "../ui/modals/lessonsModal/LessonsModal";
import Loader from '../ui/loader/Loader';
import "react-responsive-modal/styles.css";
import { BiPlusCircle } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { HiOutlineSquare2Stack } from "react-icons/hi2"
// import hexRgb from "hex-rgb";
// import rgbHex from 'rgb-hex';
import "./style.scss";

let buttonData = [
  {
    icon: <BiPlusCircle style={{ fill: "#009879" }} />,
    className: "OSstyle",
    text: "New",
  },
  {
    icon: <FaGraduationCap style={{ fill: "#213458" }} />,
    className: "OSstyle",
    text: "Edit",
  },
  {
    icon: <MdOutlineRemoveCircleOutline style={{ fill: "red" }} />,
    className: "OSstyle",
    text: "Delete",
  },
  {
    icon: <HiOutlineSquare2Stack style={{ fill: "pink" }} />,
    className: "OSstyle",
    text: "Lessons",
  },
];

let modalStates = {
  new: false,
  edit: false,
  delete: false,
  lessons: false,
  error: false,
};

let initialValue = {
  name: "",
  lastName: "",
  shortName: "",
  email: "",
  phone: "",
  gender: "",
  supervisor: "",
  classIdWhoesSupervisor: {},
  // color: "#000000"
};

function TeachersSettings({ teachersModal, closeTeachersModal }) {
  const teachers = useSelector((state) => state.teachers);
  const classes = useSelector((state) => state.classes);
  const dispatch = useDispatch();

  const initialFetch = useContext(GlobalContext)
  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue);
  let [selected, setSelected] = useState(false);
  let [errorText, setErrorText] = useState('')
  const [loading, setLoading] = useState(false)

  let { t } = useTranslation();

  async function passAction(action, payload) {
    setLoading(true)
    await dispatch(action(payload));
    await initialFetch()
    setLoading(false)
  }

  function onOpen(name) {
    name = name.toLowerCase();
    if (name == "edit") {
      setValue((prev) => {
        prev.name = selected[1].name;
        prev.lastName = selected[1].lastName;
        prev.shortName = selected[1].shortName;
        prev.phone = selected[1].phone;
        // prev.color = '#' + rgbHex(selected[1].color)
        prev.gender = selected[1].gender;
        prev.email = selected[1].email;
        prev.supervisor = classes?.[Object.keys(selected[1].classIdWhoesSupervisor)[0]]?.longName
        prev.classIdWhoesSupervisor = { [Object.keys(selected[1].classIdWhoesSupervisor)[0]]: Object.keys(selected[1].classIdWhoesSupervisor)[0] }
      });
    }
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    setModal({ ...modal, [name]: false });
    setSelected(false);
    setValue(initialValue);
  }

  function onSet(e) {
    if (e.target.name == 'supervisor') {
      let selectedOption = e.target.options.selectedIndex
      setValue((prev) => {
        prev.supervisor = e.target.value
        prev.classIdWhoesSupervisor = { [e.target.options[selectedOption].id]: e.target.options[selectedOption].id };
      });
      return
    } else {
      setValue((prev) => {
        prev[e.target.name] = e.target.value;
      });
    }
  }

  function setContext(name) {
    if (name == "new") {
      if(!value.name || !value.lastName || !value.gender) {
        setErrorText(
          t("the name last name and gender must be entered")
        )
        onOpen("error");
        return
      }
      for (const key in teachers) {
        if (
          String(teachers[key].name.toLowerCase()) ==
          value.name.toLowerCase() &&
          String(teachers[key].lastName.toLowerCase()) ==
          value.lastName.toLowerCase()
        ) {
          setErrorText(
            t("teacher exists")
          )
          onOpen("error");
          return;
        }
      }
      // const [r, g, b] = hexRgb(value.color, {format: 'array'}).slice(0, -1)

      passAction(addTeacher, value);
      onClose(name);
      return;
    } else if (name == "edit") {
      if(!value.name || !value.lastName || !value.gender) {
        setErrorText(
          t("the name last name and gender must be entered")
        )
        onOpen("error");
        return
      }
      for (const key in teachers) {
        if (
          String(teachers[key].name.toLowerCase()) ==
          value.name.toLowerCase() &&
          String(teachers[key].lastName.toLowerCase()) ==
          value.lastName.toLowerCase() &&
          teachers[key].teacherId != selected[0]
        ) {
          setErrorText(
            t("teacher exists")
          )
          onOpen("error");
          return;
        }
      }
      // const [r, g, b] = hexRgb(value.color, {format: 'array'}).slice(0, -1)

      passAction(editTeacher, { teacherId: selected[0], data: value });
      onClose(name);
      return;
    } else if (name == "delete") {
      passAction(deleteTeacher, selected[0]);
      onClose(name);
      return;
    } else {
      return;
    }
  }

  return (
    loading ?
    <Loader /> :
    <>
      <Modal
        classNames={{ modal: "teachers-settings" }}
        open={teachersModal}
        onClose={() => {closeTeachersModal("teachers"); setSelected(false)}}
        center
      >
        <main className="container">
          <table className="teachers-list">
            <thead>
              <tr>
                {["Name", "Last Name", "Count", "Class of supervisor", 
                "Gender", "Phone", "Email"].map((item) => {
                  return <th key={item}>{t(item.toLocaleLowerCase())}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Object.entries(teachers).map((item) => {
                return (
                  <tr
                    className={selected[0] == item[0] ? "selected-row" : ""}
                    key={item[0]}
                    onClick={() => setSelected(item)}
                  >
                    <td>{item[1].name}</td>
                    <td>{item[1].lastName}</td>
                    <td>{item[1].wholeLessonsCount}</td>
                    <td>
                      {classes?.[Object.keys(item[1].classIdWhoesSupervisor)[0]]?.longName}
                    </td>
                    <td>{t(item[1].gender)}</td>
                    <td>{item[1].phone}</td>
                    <td>{item[1].email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <aside className="right-sidebar">
            {buttonData.map(({ icon, className, text }) => {
              return (
                <button
                  key={text}
                  className={className}
                  onClick={() => onOpen(text)}
                  disabled={text != "New" && !selected ? true : false}
                >
                  <span
                    style={{ opacity: text != "New" && !selected ? 0.5 : 1 }}
                  >
                    {icon}
                  </span>
                  {t(text.toLocaleLowerCase())}
                </button>
              );
            })}
          </aside>
        </main>
      </Modal>

      <Modal
        classNames={{ modal: "create-teacher teachers-action" }}
        open={modal.new}
        onClose={() => onClose("new")}
        center
      >
        <div className="container">
          <div className="text-block">
            <label>{t("first name")}:</label>
            <label>{t("last name")}:</label>
            <label>{t("short-name")}:</label>
            <label>{t("gender")}:</label>
            <label>{t("class of supervisor")}:</label>
            <label>{t("phone")}:</label>
            <label>{t("email")}:</label>
            {/* <label>{t("color")}:</label> */}
          </div>
          <div className="input-block">
            <input
              name="name"
              value={value.name}
              onChange={onSet}
              type="text"
              placeholder={t("first name")}
            />
            <input
              name="lastName"
              value={value.lastName}
              onChange={onSet}
              type="text"
              placeholder={t("last name")}
            />
            <input
              name="shortName"
              value={value.shortName}
              onChange={onSet}
              type="text"
              placeholder={t("short-name")}
            />
            <div className='radio-block'>
            <span>
              <input
                name="gender"
                value='male'
                type="radio"
                checked={value.gender == 'male'}
                onChange={onSet}
              />{t('male')}
            </span>
            <span>
              <input
                name="gender"
                value='female'
                type="radio"
                checked={value.gender == 'female'}
                onChange={onSet}
              />{t('female')}
            </span>
            </div>
            <select
            value={value.supervisor}
            onChange={onSet}
            className="OSstyle"
            name="supervisor"
            >
            <option value=""></option>
            {Object.values(classes).map((item) => {
            return <option 
              id={item.classId} 
              key={item.classId} 
              value={item.longName}
              >
                {item.longName}
              </option>
            })}
            </select>
            <input
              name="phone"
              value={value.phone}
              onChange={onSet}
              type="tel"
              placeholder={t("phone")}
            />
            <input
              name="email"
              value={value.email}
              onChange={onSet}
              type="email"
              placeholder={t("email")}
            />
          {/* <input name="color" value={value.color} onChange={onSet} type="color"/> */}
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
        classNames={{ modal: "edit-teacher teachers-action" }}
        open={modal.edit}
        onClose={() => onClose("edit")}
        center
      >
        <div className="container">
          <div className="text-block">
            <label>{t("first name")}:</label>
            <label>{t("last name")}:</label>
            <label>{t("short-name")}:</label>
            <label>{t("gender")}:</label>
            <label>{t("class of supervisor")}:</label>
            <label>{t("phone")}:</label>
            <label>{t("email")}:</label>
            {/* <label>{t("color")}:</label> */}
          </div>
          <div className="input-block">
            <input
              name="name"
              value={value.name}
              onChange={onSet}
              type="text"
              placeholder={t("first name")}
            />
            <input
              name="lastName"
              value={value.lastName}
              onChange={onSet}
              type="text"
              placeholder={t("last name")}
            />
            <input
              name="shortName"
              value={value.shortName}
              onChange={onSet}
              type="text"
              placeholder={t("short-name")}
            />
            <div className='radio-block'>
            <span>
              <input
                name="gender"
                value='male'
                type="radio"
                checked={value.gender == 'male'}
                onChange={onSet}
              />{t('male')}
            </span>
            <span>
              <input
                name="gender"
                value='female'
                type="radio"
                checked={value.gender == 'female'}
                onChange={onSet}
              />{t('female')}
            </span>
            </div>
            <select
            value={value.supervisor}
            onChange={onSet}
            className="OSstyle"
            name="supervisor"
            >
            <option value=""></option>
            {Object.values(classes).map((item) => {
            return <option 
              id={item.classId} 
              key={item.classId} 
              value={item.longName}
              >
                {item.longName}
              </option>
            })}
            </select>
            <input
              name="phone"
              value={value.phone}
              onChange={onSet}
              type="tel"
              placeholder={t("phone")}
            />
            <input
              name="email"
              value={value.email}
              onChange={onSet}
              type="email"
              placeholder={t("email")}
            />
          {/* <input name="color" value={value.color} onChange={onSet} type="color"/> */}
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
        classNames={{ modal: "delete-teacher" }}
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
      
      <LessonsModal 
      sectionData={selected && {data: selected[1], section: 'teachers'}}
      lessonsModal={modal.lessons} 
      closeLessonsModal={onClose}
      />

      <Modal
        classNames={{ modal: "error" }}
        open={modal.error}
        onClose={() => onClose("error")}
        center
      >
        {errorText}
      </Modal>
    </>
  );
}

export default TeachersSettings;

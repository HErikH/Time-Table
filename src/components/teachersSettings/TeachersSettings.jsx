import { addTeacher, editTeacher, deleteTeacher } from '../../features/teachersSlice'
import { useSelector, useDispatch } from "react-redux/es/exports";
import { useState } from "react";
import { useImmer } from "use-immer";
import { useTranslation } from 'react-i18next';
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { BiPlusCircle } from "react-icons/bi";
import { FaGraduationCap } from "react-icons/fa";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
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
];

let modalStates = {
  new: false,
  edit: false,
  delete: false,
  error: false,
};

let initialValue = {
  name: "",
  lastName: "",
};

function TeachersSettings({ teachersModal, closeTeachersModal }) {
  const teachers = useSelector((state) => state.teachers);
  const dispatch = useDispatch();

  let [modal, setModal] = useState(modalStates);
  let [value, setValue] = useImmer(initialValue);
  let [selected, setSelected] = useState(false);

  let { t } = useTranslation();

  function passAction(action, payload) {
    dispatch(action(payload))
  }
  
  function onOpen(name) {
    name = name.toLowerCase();
    if (name == "edit") {
      setValue((prev) => {
        prev.longName = selected[1].longName;
        prev.shortName = selected[1].shortName;
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
    setValue((prev) => {
      prev[e.target.name] = e.target.value;
    });
  }

  function setContext(name) {
    if (name == "new") {
      for (const key in teachers) {
        if (
          String(teachers[key].name.toLowerCase()) ==
          value.name.toLowerCase()
        ) {
          onOpen("error");
          return;
        }
      }
      passAction(addTeacher, value);
      onClose(name);
      return;
    } else if (name == "edit") {
      for (const key in teachers) {
        if (
          String(teachers[key].name).toLowerCase() ==
            value.name.toLowerCase() &&
            teachers[key].teacherId != selected[0]
        ) {
          onOpen("error");
          return;
        }
      }
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
                {["Name", "Last Name", "Count", "Time off"].map((item) => {
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
                    <td></td>
                    <td></td>
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
            <label>{t("short-name")}:</label>
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

      <Modal
        classNames={{ modal: "teacher-exists" }}
        open={modal.error}
        onClose={() => onClose("error")}
        center
      >
        {t("teacher exists")}
      </Modal>
    </>
  );
}

export default TeachersSettings;

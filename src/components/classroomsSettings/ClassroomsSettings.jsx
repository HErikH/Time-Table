import { addClassroom, editClassroom, deleteClassroom } from "../../features/classroomsSlice";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { GlobalContext } from "../../App";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";
import { useState, useContext } from "react";
import LessonsModal from "../ui/modals/lessonsModal/LessonsModal";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { BiPlusCircle } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { HiOutlineSquare2Stack } from "react-icons/hi2"
import Loader from "../ui/loader/Loader";
import "./style.scss";

let buttonData = [
  {
    icon: <BiPlusCircle style={{ fill: "#009879" }} />,
    className: "OSstyle",
    text: "New",
  },
  {
    icon: <BsPeople style={{ fill: "#EDC369" }} />,
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
  longName: "",
  shortName: "",
};

function ClassroomsSettings({ classroomsModal, closeClassroomsModal }) {
  const classrooms = useSelector((state) => state.classrooms);
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
        prev.longName = selected[1].longName;
        prev.shortName = selected[1].shortName;
      });
    }
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    if (name != 'error') {
      setValue(initialValue)
      setSelected(false)
    }
    setModal({ ...modal, [name]: false });
  }

  function onSet(e) {
    setValue((prev) => {
      prev[e.target.name] = e.target.value;
    });
  }

  function setContext(name) {
    if (name == "new") {
      if(!value.longName || !value.shortName) {
        setErrorText(
          t("the classroom name and short name must be entered")
        )
        onOpen("error");
        return
      }
      for (const key in classrooms) {
        if (
          String(classrooms[key].longName).toLowerCase() == value.longName.toLowerCase()
          ) {
          setErrorText(
            t("classroom exists")
          )
          onOpen("error");
          return;
        }
      }
      passAction(addClassroom, value);
      onClose(name);
      return;
    } else if (name == "edit") {
      if(!value.longName || !value.shortName) {
        setErrorText(
          t("the classroom name and short name must be entered")
        )
        onOpen("error");
        return
      }
      for (const key in classrooms) {
        if (
          String(classrooms[key].longName).toLowerCase() == value.longName.toLowerCase() &&
          classrooms[key].classRoomId != selected[0]
        ) {
          setErrorText(
            t("classroom exists")
          )
          onOpen("error");
          return;
        }
      }
      passAction(editClassroom, { classRoomId: selected[0], data: value });
      onClose(name);
      return;
    } else if (name == "delete") {
      passAction(deleteClassroom, selected[0]);
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
        classNames={{ modal: "classrooms-settings" }}
        open={classroomsModal}
        onClose={() => {closeClassroomsModal("classrooms"); setSelected(false)}}
        center
      >
        <main className="container">
          <table className="classrooms-list">
            <thead>
              <tr>
                {["Name", "Short-Name", "Count"].map((item) => {
                  return <th key={item}>{t(item.toLocaleLowerCase())}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {Object.entries(classrooms).map((item) => {
                return (
                  <tr
                    className={selected[0] == item[0] ? "selected-row" : ""}
                    key={item[0]}
                    onClick={() => setSelected(item)}
                  >
                    <td>{item[1].longName}</td>
                    <td>{item[1].shortName}</td>
                    <td>{item[1].wholeLessonsCount}</td>
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
                  {t((text.toLocaleLowerCase()))}
                </button>
              );
            })}
          </aside>
        </main>
      </Modal>

      <Modal
        classNames={{ modal: "create-classroom classrooms-action" }}
        open={modal.new}
        onClose={() => onClose("new")}
        center
      >
        <div className="container">
          <div className="text-block">
            <label>{t("classroom name")}:</label>
            <label>{t("short-name")}:</label>
          </div>
          <div className="input-block">
            <input
              name="longName"
              value={value.longName}
              onChange={onSet}
              type="text"
              placeholder={t("classroom name")}
            />
            <input
              name="shortName"
              value={value.shortName}
              onChange={onSet}
              type="text"
              placeholder={t("short-name")}
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
        classNames={{ modal: "edit-classroom classrooms-action" }}
        open={modal.edit}
        onClose={() => onClose("edit")}
        center
      >
        <div className="container">
          <div className="text-block">
            <label>{t("classroom name")}:</label>
            <label>{t("short-name")}:</label>
          </div>
          <div className="input-block">
            <input
              name="longName"
              value={value.longName}
              onChange={onSet}
              type="text"
              placeholder={t("classroom name")}
            />
            <input
              name="shortName"
              value={value.shortName}
              onChange={onSet}
              type="text"
              placeholder={t("short-name")}
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
        classNames={{ modal: "delete-classroom" }}
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
      sectionData={selected && {data: selected[1], section: 'classrooms'}}
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

export default ClassroomsSettings;

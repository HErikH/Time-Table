import { useState, useRef, createContext } from "react";
import { useReactToPrint } from "react-to-print"
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import PrintClasses from "./printClasses/PrintClasses";
import PrintTeachers from "./printTeachers/PrintTeachers";
import { useTranslation } from "react-i18next";
import "./style.scss";

let modalStates = {
  classes: false,
  teachers: false,
};

export const PrintContext = createContext()

function PrintSettings({ printSettingsModal, closePrintSettingsModal }) {
  let [modal, setModal] = useState(modalStates);
  let [documentTitle, setDocumentTitle] = useState('')

  let { t } = useTranslation();

  const printRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: documentTitle,
  });

  function onOpen(name) {
    setModal({ ...modal, [name]: true });
  }

  function onClose(name) {
    setModal({ ...modal, [name]: false });
  }

  return (
    <>
      <Modal
        classNames={{ modal: "print-settings" }}
        open={printSettingsModal}
        onClose={() => closePrintSettingsModal("print")}
        center
      >
        <div className="button-block">
          <button className="OSstyle" onClick={() => onOpen('classes')}>{t('timetable for each class')}</button>
          <button className="OSstyle" onClick={() => onOpen('teachers')}>{t('timetable for each teacher')}</button>
        </div>
      </Modal>
      <PrintContext.Provider value={{ printRef, handlePrint, setDocumentTitle }}>
        <PrintClasses printClassesModal={modal.classes} closePrintClassesModal={onClose}/>
        <PrintTeachers printTeachersModal={modal.teachers} closePrintTeachersModal={onClose}/>
      </PrintContext.Provider>
    </>
  );
}
export default PrintSettings;

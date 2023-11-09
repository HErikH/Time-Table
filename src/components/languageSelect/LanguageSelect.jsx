import { useSelector } from "react-redux";
import { Modal } from "react-responsive-modal";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import Flags from "country-flag-icons/react/3x2";
import { useCookies } from 'react-cookie';
import "./style.scss";

const flags = [
    {flagCode: 'GB', buttonClass: 'flag-button', name: 'English', code: 'en'},
    {flagCode: 'RU', buttonClass: 'flag-button', name: 'Русский', code: 'ru'},
    {flagCode: 'AM', buttonClass: 'flag-button', name: 'Հայերեն', code: 'am'},
]

function LanguageSelect({lngModal, closeLngModal}) {
  const table = useSelector((state) => state.timeTable)
  let [cookies] = useCookies(['i18next']) || 'en'
  
  const { t } = useTranslation()

  document.title = table.name ? 
  table.name + '-' + t('timetable') : 
  t('timetable')

  return (
    <Modal     
    classNames={{ modal: "language-settings" }}
    open={lngModal}
    onClose={() => closeLngModal('lng')}
    center
    >
        <div className="container">
        {flags.map(({flagCode, buttonClass, name, code}) => {
            let Flag = Flags[flagCode]

            return (
                <button 
                className={buttonClass} 
                key={code} 
                onClick={() => {i18next.changeLanguage(code); closeLngModal('lng')}}
                disabled={code === cookies?.i18next}
                >
                    <Flag style={{opacity: code === cookies?.i18next ? 0.5 : 1}} />
                    <label>{name}</label>
                </button>
            )
        })}
        </div>
    </Modal>
  )
}

export default LanguageSelect
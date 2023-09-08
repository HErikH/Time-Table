import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BsGlobe } from "react-icons/bs";
import LanguageSelect from "../../components/languageSelect/LanguageSelect";
import "./style.scss";

function Help() {
  let [modal, setModal] = useState({lng: false})
  const { t } = useTranslation();

  function onClose(name) {
    setModal({...modal, [name]: false});
  }

  function onOpen(name) {
    setModal({...modal, [name]: true});
  }

  return (
    <>
    <nav className="help-navbar">
      <Link className="help-navbar__item" onClick={() => onOpen('lng')}>
        <BsGlobe className="icon"/>
        <span className="text">{t('lng')}</span>
      </Link>
    </nav>
    <LanguageSelect lngModal={modal.lng} closeLngModal={onClose}/>
    </>
  );
}

export default Help;

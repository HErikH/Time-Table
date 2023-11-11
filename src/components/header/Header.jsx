import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { useCookies } from 'react-cookie';
import './style.scss'

function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(["uid"]);

  const { t } = useTranslation();

  return (
    <header className="header">
        <div className="header__link-block">
        {/* <Link to='/' className='header__link'>{t('main')}</Link> */}
        <Link to='/' className='header__link' onClick={() => removeCookie('uid')}>{t('logout')}</Link>
        {/* <Link to='/help' className='header__link'>{t('help')}</Link> */}
        </div>
    </header>
  )
}

export default Header
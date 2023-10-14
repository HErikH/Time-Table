import LessonsStack from "./lessonsStack/LessonsStack";
import './style.scss'

function Footer({ setAvailable }) {
  return (
    <div className="footer">
      <LessonsStack 
      setAvailable={setAvailable}
      />
    </div>
  );
}

export default Footer;

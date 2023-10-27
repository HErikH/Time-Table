import LessonsStack from "./lessonsStack/LessonsStack";
import './style.scss'

function Footer({ available, setAvailable, lessonPeriod }) {
  return (
    <div className="footer">
      <LessonsStack 
      available={available}
      setAvailable={setAvailable}
      lessonPeriod={lessonPeriod}
      />
    </div>
  );
}

export default Footer;

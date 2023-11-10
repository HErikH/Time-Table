import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";
import { setError } from "../../../../features/dragDropSlice";
import Modal from "react-responsive-modal";
import { useTranslation } from "react-i18next";
import "react-responsive-modal/styles.css";
import './style.scss'

function ErrorModal() {
  let putError = useSelector(state => state.dragDrop.error.errorsWithTeachers)
  const table = useSelector((state) => state.timeTable.weekDays);
  const teachers = useSelector(state => state.teachers)
  const [modal, setModal] = useState(false)
  const [errorData, setErrorData] = useState(false)
  const dispatch = useDispatch()

  let { t } = useTranslation();

  useEffect(() => {
    if (putError) {
      setModal(true)
      setErrorData({
        teacherName: teachers[Object.keys(putError[0].teachersId)[0]].name,
        dayName: table[putError[0].places[putError[0].placeId].dayId].name,
        hourName: table[putError[0].places[putError[0].placeId].dayId].hours[putError[0].places[putError[0].placeId].hourId].shortName
      })
    }
  }, [])

  return (
    <Modal
    classNames={{ modal: "error-modal" }}
    open={modal}
    onClose={() => {
      setModal(false), 
      dispatch(setError(false))
    }}
    center
    >
        {putError ?
        <span>
        {t('this lesson teacher')}
        ({errorData.teacherName})<br/>
        {t('already have lesson in this day')}
        ({t(errorData.dayName?.toLowerCase())})<br/>
        {t('and hour')}
        {'('+errorData.hourName+')' + ' !'}
        </span> :
        ''}
    </Modal>
  )
}
export default ErrorModal
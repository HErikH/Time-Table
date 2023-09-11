import { useSelector } from 'react-redux/es/exports'
import { useTranslation } from 'react-i18next'
import './style.scss'

let weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

function Timetable() {
    const table = useSelector(state => state.timeTable.table)
    let { t } = useTranslation()

    function createWeekDays() {
        let result = []
    
        for (let i = 0; i < table.numberOfDays; i++) {
            result.push(
                <th key={i}>{t(weekDays[i].toLowerCase())}</th>
            )
        }

        return result
    }

    function createPeriodsPerDay() {
        let result = []

        for (let i = 0; i < table.numberOfDays; i++) {
            result.push(
                <td className="per-days" key={i}>
                    {[...Array(table.periodsPerDay)].map((_, index) => {
                        return <td className="per-days__day" key={index}>{index + 1}</td>
                    })}
                </td>
            )
        }

        return result
    }

  return (
    <table className="time-table">
        <thead>
            <tr>
                {createWeekDays()}
            </tr>
        </thead>

        <tbody>
            <tr>
                {createPeriodsPerDay()}
            </tr>
        </tbody>
    </table>
  )
}

export default Timetable
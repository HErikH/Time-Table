import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { TimeTableContext } from '../../context/TimeTableContext'
import './style.scss'

let weekDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']


function Timetable() {
    let [state, setState] = useContext(TimeTableContext)
    let { t } = useTranslation()

    function createWeekDays() {
        let result = []
    
        for (let i = 0; i < state.timeTable.numberOfDays; i++) {
            result.push(
                <th key={i}>{t(weekDays[i].toLowerCase())}</th>
            )
        }

        return result
    }

    function createPeriodsPerDay() {
        let result = []

        for (let i = 0; i < state.timeTable.numberOfDays; i++) {
            result.push(
                <td className="per-days" key={i}>
                    {[...Array(state.timeTable.periodsPerDay)].map((_, index) => {
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
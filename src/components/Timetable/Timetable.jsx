import { useSelector } from 'react-redux/es/exports'
import { useTranslation } from 'react-i18next'
import './style.scss'

function Timetable() {
    const table = useSelector(state => state.timeTable.weekDays)
    let { t } = useTranslation()

    function createWeekDays() {
        let result = []
    
         for (const item in table) {
            result.push(
                <th key={table[item].dayId}>{t(table[item].name.toLowerCase())}</th>
            )
        }

        return result
    }
    
    function createPeriodsPerDay() {
        let result = []

        for (const item in table) {
            result.push(
              <td key={table[item].dayId} className="per-days">
              {Object.values(table[item].hours).map(h => {
                  return <td key={h.hourId} className="per-days__hour">{h.name}</td>
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
                <th style={{backgroundColor: 'white',}}></th>
                {createWeekDays()}
            </tr>
        </thead>

        <tbody>
            <tr>
                <td style={{width: '50px', textAlign: 'center', border: '1px solid #00739a'}}>             
                </td>
                {createPeriodsPerDay()}
            </tr>
        </tbody>
    </table>
  )
}

export default Timetable
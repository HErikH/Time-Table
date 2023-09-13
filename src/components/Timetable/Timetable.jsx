import { useSelector } from 'react-redux/es/exports'
import { useTranslation } from 'react-i18next'
import './style.scss'

function Timetable() {
    const table = useSelector(state => state.timeTable.table.weekDays)

    // function test(days=5, hours=7) {
    //     let arr = {}
    //     let weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    //     for (let i = 0; i < days; i++) {
    //         arr[i+1] = {dayId: i+1, name: weekDays[i], hours: {}}
    //         for (let j = 0; j < hours; j++) {
    //             arr[i+1].hours[j+1] = {hourId: j+1, name: j+1, shortName: j+1}
    //         }
    //     }
    //     return arr
    // }
    // console.log(test())

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
                  return <td key={h.hourId} className="per-days__day">{h.name}</td>
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
                <th style={{backgroundColor: 'white', borderRight: '1px solid #EDC369'}}></th>
                {createWeekDays()}
            </tr>
        </thead>

        <tbody>
            <tr>
                <td style={{width: '50px', borderBottom: '1px solid #EDC369'}}></td>
                {createPeriodsPerDay()}
            </tr>
        </tbody>
    </table>
  )
}

export default Timetable
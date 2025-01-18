import { format, addDays } from "date-fns"

const date = new Date
const currentDate = format(date, 'yyyy-MM-dd')
const tomorrow = format(addDays(date, 1), 'yyyy-MM-dd')

export const getHours = () => {
    const hours = new Date().getHours()
    if(hours < 12) return 'Buenos dias'
    if(hours < 18) return 'Buenas tardes'
    return 'Buenas noches'
}

export const formatDate = (activities) => {
    activities.map((activitie, key) => {
        const { date } = activitie
        if (date == currentDate) {
            const newActivtie = {
                ...activitie,
                date: 'Hoy'
            }
            activities[key] = newActivtie 
        } else if (date == tomorrow) {
            const newActivtie = {
                ...activitie,
                date: 'Mañana'
            }
            activities[key] = newActivtie 
        }
    })
}

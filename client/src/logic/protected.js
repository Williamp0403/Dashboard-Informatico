export const getHours = () => {
    const hours = new Date().getHours()
    if(hours < 12) return 'Buenos dias'
    if(hours < 18) return 'Buenas tardes'
    return 'Buenas noches'
}

import '../ContainerActivitie.css'

export function ContainerActivitie ({ title, description, court, date, value})  {
    return (
        <section className="activitie">
            <p className='activitie-date'>{date}</p>
            <h1 className='activitie-title'>{title}</h1>
            <p className='activitie-description'>{description}</p>
            <p className='activitie-court'>{court}</p>
            <p className='activitie-value'>{value}%</p>
        </section>
    )
}
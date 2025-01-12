export function Sections ( { index, click ,title , d, activateOption, setActivateOption} ) {

    const execute = () => {
        click()
        setActivateOption(index)
    }
   
    return (
        <div className={`option ${activateOption ? 'active': ''}`} onClick={execute}>
            <svg fill="none" viewBox="0 0 24 24"  stroke="currentColor">
                <path strokeLinecap="round" strokeWidth="2" d={d}>
                </path>
            </svg>
            <p>{title}</p>
        </div>
    )
}
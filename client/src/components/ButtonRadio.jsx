
export function ButtonRadio ({getData,setCharge,value,name,type}) {
    
    const execute = () => {
        getData()
    }

    return (
        <label className="mydict-label">
            <input onClick= { (event) => { 
                    setCharge(event.target.value) 
                    if (type == "show-data") execute()                   
                }
                }value={value} type="radio" name="radio"/>
            <span>{name}</span>
        </label>        
    )
}

export function ButtonRadio ({getMatters,setCharge,value,name,id}) {
    
    const execute = () => {
        getMatters()
    }

    return (
        <label className="mydict-label">
            <input onClick= { (event) => { 
                    setCharge(event.target.value) 
                    if (id == "register_teacher") execute()                   
                }
                }value={value} type="radio" name="radio"/>
            <span>{name}</span>
        </label>        
    )
}
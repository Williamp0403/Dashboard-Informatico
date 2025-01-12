export function Options ({title, getData, getID ,showData}) {
    return (
        <div className="container-data"> 
            <label className="container-data-label" htmlFor="data">{title}</label>
                <select onClick={(event) => {
                    getData(event.target.selectedOptions[0].value);
                    getID(event.target.selectedOptions[0].getAttribute('data_id'));
                }} 
                className="container-data-select" name="data"> 
                {
                    showData.map((data,key) => {
                        return <option key={data.id_data} data_id={data.id_data} value={data.data_name}>{data.data_name}</option>
                    })
                }
                </select>
        </div>
    )
}
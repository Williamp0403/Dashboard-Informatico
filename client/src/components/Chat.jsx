import '../Chat.css'

export function Chat ({ message, mesagges, setMessage, sendMessage, nameGroup, messageBoxRef }) {
    return (
            <div className='chat'>               
                <p className='name-group'>{nameGroup}</p>
                <div className='container-messages' ref={messageBoxRef} >
                    {mesagges.map((msg,index) => {
                        return <li className={'message'} key={index}> 
                                    <div> 
                                        <p>{msg.content}</p> 
                                        <span>{msg.username}</span>
                                    </div>  
                                    <span className='hour'> {msg.hour} </span>
                                </li>
                    })}
                </div>
                <form className='message-box' onSubmit={sendMessage}>
                    <input className='message-input' onChange={(event) => setMessage(event.target.value)} placeholder='Mensaje...' value={message} type='text'></input>
                    <button className='message-button' type='submit'>
                        <div className="svg-wrapper-1">
                            <div className="svg-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path fill="currentColor" d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                                </svg>
                            </div>
                        </div>
                        <span>Enviar</span>   
                    </button>
                </form>        
            </div>          
    )
}
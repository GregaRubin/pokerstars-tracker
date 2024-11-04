import { useState, useEffect } from 'react';
import Session from './Session';

function Sessions() {
    const [sessions, setSessions] = useState([]);
    useEffect(function () {
        const getSessions = async function () {
            const res = await fetch("http://localhost:3001/sessions/listOwn", {credentials: "include"});
            const data = await res.json();
            console.log(res.body)
            console.log(data)
            setSessions(data);
        }
        getSessions();
    }, []);

    return (
        <div class='container' style={{marginTop:"20px"}}>
            <div class="row">          
                {sessions.map(session => (<Session session={session} key={session._id}></Session>))}
            </div>
        </div>
        
    );
}

export default Sessions;
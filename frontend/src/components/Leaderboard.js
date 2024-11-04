import { useState, useEffect } from 'react';
import LeaderboardEntry from './LeaderboardEntry';

function Sessions() {
    const [users, getUsers] = useState([]);
    useEffect(function () {
        const getSessions = async function () {
            const res = await fetch("http://localhost:3001/users/leaderboards", { credentials: "include" });
            const data = await res.json();
            console.log(res.body)
            console.log(data)
            getUsers(data);
        }
        getSessions();
    }, []);

    return (
        <div class="container" style={{marginTop: "20px"}}>
            <div class="row">
                <div class="col-xl-6 mb-3 mb-lg-5 mx-auto">
                    <div class="card">
                        <div class="d-flex card-header justify-content-between">
                            <h5 class="me-3 mb-0"><b>Best players</b></h5>
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                {users.map(user => (<LeaderboardEntry user={user}></LeaderboardEntry>))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Sessions;
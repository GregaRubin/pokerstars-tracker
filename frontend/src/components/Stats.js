import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SessionLineChart from './SessionLineChart';

function Stats() {
    const [startDate, setStartDate] = useState(new Date('2000-01-01'));
    const [endDate, setEndDate] = useState(new Date());
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch(`http://localhost:3001/sessions/stats/?start_date=${startDate}&end_date=${endDate}`, { credentials: "include" });
                const data = await response.json();

                setSessions(data);
            } catch (error) {
                console.error('Error fetching session data', error);
            }
        };

        fetchSessions();
    }, [startDate, endDate]);

    return (
        <div class="container" style={{ marginTop: "20px" }}>
            <div class="row">
                <div class="col-xl-13 mb-3 mb-lg-5 mx-auto">
                    <div class="card">
                        <div>
                            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                            <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                            <SessionLineChart sessions={sessions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Stats;
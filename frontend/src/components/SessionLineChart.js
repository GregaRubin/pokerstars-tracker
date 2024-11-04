import React, { useState, useEffect } from 'react';
import { Cell, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SessionLineChart = ({ sessions }) => {
    const [pieData1, setPieData1] = useState([]);
    const [pieData2, setPieData2] = useState([]);
    const [detailsData, setDetailsData] = useState({
        hands: 0,
        profit: 0,
        vpip_percent: 0,
        pfr_percent: 0,
        wtsd_percent: 0,
        wonsd_percent: 0,
        agg_percent: 0
    });
    const COLORS = ['#8884d8', '#82ca9d', "#dc143c", '#ffc658',];
    const COLORS2 = ['#8884d8', '#82ca9d'];


    useEffect(() => {
        if (sessions.length > 0) {
            const aggregatedStats = sessions.reduce((acc, session) => {
                return {
                    bet: acc.bet + session.bet,
                    fold: acc.fold + session.fold,
                    raise: acc.raise + session.raise,
                    call: acc.call + session.call,
                    showdown: acc.showdown + session.showdown,
                    wonShowdown: acc.wonShowdown + session.wonShowdown,
                    hands: acc.hands + session.hands,
                    profit: acc.profit + session.profit,
                    vpip: acc.vpip + session.vpip,
                    pfr: acc.pfr + session.pfr,

                };
            }, { bet: 0, fold: 0, raise: 0, call: 0, showdown: 0, wonShowdown: 0, hands: 0, profit: 0, vpip: 0, pfr: 0 });

            const chartData1 = [
                { name: 'Raises', value: aggregatedStats.raise },
                { name: 'Bets', value: aggregatedStats.bet },
                { name: 'Folds', value: aggregatedStats.fold },
                { name: 'Calls', value: aggregatedStats.call },
            ];

            const chartData2 = [
                { name: 'Showdowns', value: aggregatedStats.showdown },
                { name: 'Showdowns won', value: aggregatedStats.wonShowdown },
            ];

            const calcs = {
                hands: aggregatedStats.hands,
                profit: aggregatedStats.profit,
                vpip_percent: (aggregatedStats.vpip / aggregatedStats.hands),
                pfr_percent: (aggregatedStats.pfr / aggregatedStats.hands),
                wonsd_percent: (aggregatedStats.wonShowdown / aggregatedStats.showdown) * 100,
                wtsd_percent: (aggregatedStats.showdown / aggregatedStats.hands) * 100,
                agg_percent: ((aggregatedStats.bet + aggregatedStats.raise) / (aggregatedStats.bet + aggregatedStats.raise + aggregatedStats.fold + aggregatedStats.call)),
            };
            console.log(aggregatedStats)
            setPieData1(chartData1);
            setPieData2(chartData2);
            setDetailsData(calcs);
        }
    }, [sessions]);


    return (
        <div>

            <div class="container">
                <div class="row">


                    <div width="" class="col-lg-6">
                        <h2>Profit</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={sessions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-UB')} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />

                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div class="col-lg-6">
                        <h2>Hands played</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={sessions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-UB')} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="hands" stroke="#82ca9d" />

                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div class="col-lg-6">
                        <h2>Vpip/Pfr</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={sessions}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('en-UB')} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="vpip_percent" stroke="#ffc658" />
                                <Line type="monotone" dataKey="pfr_percent" stroke="#dc143c" />

                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div class="col-lg-6">
                        <h2>Play patterns</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={pieData1}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                    label
                                >
                                    {pieData1.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                    </div>

                    <h2>Details</h2>
                    <div class="col-md-8">
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Vpip</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.vpip_percent.toFixed(2)}
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Pfr</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.pfr_percent.toFixed(2)}
                                    </div>
                                </div>
                                <hr></hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Agg</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.agg_percent.toFixed(2)}
                                    </div>
                                </div>
                                <hr></hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Wtsd %</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.wtsd_percent.toFixed(2)} %
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">W$sd %</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.wonsd_percent.toFixed(2)} %
                                    </div>
                                </div>
                                <hr></hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Profit</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.profit.toFixed(2)} $
                                    </div>
                                </div>

                                <hr></hr>
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 class="mb-0">Hands played</h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        {detailsData.hands.toFixed(2)}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SessionLineChart;
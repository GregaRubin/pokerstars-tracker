
import { Link } from "react-router-dom";
import table_logo from './poker_table.png'


function Session(props) {
    const date = new Date(props.session.date);
    const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    console.log(props.session.bbprofit);


    return (
        <div class="col-lg-4">
        <div class="card card-margin">
            <div class={"card " + (props.session.bbprofit >= 0 ? ("card-headerGreen"): ("card-headerRed"))}>
                <h5 class="card-title">{props.session.tableName}</h5>
                <h6 class="card-title">{props.session.type + " " +props.session.blinds}</h6>
            </div>
            <div class="card-body pt-0">
                <div class="widget-49">
                    <div class="widget-49-title-wrapper">
                        <div class="widget-49-date-primary">
                            
                            <img width="50" height="50"src={table_logo}></img>
                            
                        </div>
                        <div class="widget-49-meeting-info">
                            <p></p>
                            <span class="widget-49-pro-title"><b>{props.session.hands}</b> hands played</span>
                            <span class="widget-49-pro-title"><b>{props.session.bbprofit}</b> big blinds {props.session.bbprofit >= 0 ? ("won"): ("lost")} </span>
                            <span class="widget-49-meeting-time">{dateStr}</span>
                        </div>
                    </div>
                    <ol class="widget-49-meeting-points">
                        <p></p>
                        <li class="widget-49-meeting-item"><span>Vpip: {props.session.vpip_percent}</span></li>
                        <li class="widget-49-meeting-item"><span>Pfr: {props.session.pfr_percent}</span></li>
                        <li class="widget-49-meeting-item"><span>Agg: {props.session.agg_percent}</span></li>
                        <li class="widget-49-meeting-item"><span>Wtsd: {props.session.wtsd_percent}</span></li>
                        <li class="widget-49-meeting-item"><span>W$sd: {props.session.wonsd_percent}</span></li>
                    </ol>
                    
                        <a href={"http://localhost:3001/"+props.session.filePath} >Download</a>
                    
                </div>
            </div>
        </div>
    </div>
        
    );
}

export default Session;
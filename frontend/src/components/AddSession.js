import { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { UserContext } from '../userContext';
import MuiAlert from '@mui/material/Alert';


function AddSession(props) {
    const userContext = useContext(UserContext);
    const [pokerstarsUsername, setPokerstarsUsername] = useState('');
    const [files, setFiles] = useState([]);
    const [uploaded, setUploaded] = useState(false);
    const [err, setErr] = useState({});
    const [alert, setAlert] = useState(false);
    const [error, setError] = useState("");

    const handleFileChanges =(e)=>{
        setFiles(e.target.files);
    }

    async function onSubmit(e) {
        e.preventDefault();

        if (!pokerstarsUsername) {
            window.alert("Fill out all fields");
            return;
        }

        const formData = new FormData();
        formData.append('username', pokerstarsUsername);
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        const res = await fetch('http://localhost:3001/sessions', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        const data = await res.json();
        
        console.log("error data ", data);
        console.log("error code ", data.status);
        //this doesn't work
        if (data.exists != undefined) {
            setAlert(true);
            setPokerstarsUsername("");
            setErr(data);
            console.log("Error: ", err);
            
        } else {
            
            setAlert(false);
            setError("Logs didn't upload successfully");
        }

    }

    return (
        <div class='container'>
            
            <div class="py-5 text-center">
                <h2>Upload Pokerstars logs</h2>
            </div>
            <div class="col d-flex justify-content-center">
                <div class="card" style={{ width: '50rem' }}>
                    <div class="card-body">
                        <form className="form-group" onSubmit={onSubmit}>
                            {!userContext.user ? <Navigate replace to="/login" /> : ""}

                            <div class="mb-3">
                                <label for="exampleFormControlInput1" class="form-label">Pokerstars username</label>
                                <input type="text" className="form-control" name="username" placeholder="Example username" value={pokerstarsUsername} onChange={(e) => { setPokerstarsUsername(e.target.value) }} />
                            </div>


                            <div>
                                <div class="mb-3">
                                    <label for="session" class="form-label">Session Logs</label>
                                    <input className="form-control" type="file" multiple accept=".txt" id="session" required onChange={handleFileChanges}/>
                                </div>
                            </div>

                            <div>
                                <input className="btn btn-primary" type="submit" name="submit" value="Submit" />
                            </div>
                            <label>{error}</label>
                            {!alert ? "" : ( err.succes != 0 ?
                            <MuiAlert severity="success">{err.succes} file(s) successfully uploaded</MuiAlert> : ""
                            )}
                            {!alert ? "" : ( err.exists != 0 ?
                            <MuiAlert severity="info">{err.exists} file(s) already exist</MuiAlert> : ""
                            )}
                            {!alert ? "" : ( err.error != 0 ?
                            <MuiAlert severity="warning">{err.error} file(s) unsuccessfully uploaded</MuiAlert> : ""
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSession;
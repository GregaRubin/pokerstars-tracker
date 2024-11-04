import { useContext, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const userContext = useContext(UserContext);

    async function Login(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users/login", {
            method: "POST",
            credentials: "include",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if (data._id !== undefined) {
            userContext.setUserContext(data);
        } else {
            setUsername("");
            setPassword("");
            setError("Invalid username or password");
        }
    }

    return (
        <div class='container'>
            <div class="py-5 text-center">
                <h2>Login</h2>
            </div>
            <div class="col d-flex justify-content-center">
                <div class="card" style={{ width: '50rem' }}>
                    <div class="card-body">
                        <form onSubmit={Login}>
                            {userContext.user ? <Navigate replace to="/" /> : ""}

                            <div class="mb-3">
                                <label for="inputUsername" class="sr-only">Username</label>
                                <input type="text" id="inputUsername" class="form-control" placeholder="Enter username" autofocus value={username} onChange={(e) => (setUsername(e.target.value))} />
                            </div>

                            <div class="mb-3">
                                <label for="inputPassword" class="sr-only">Password</label>
                                <input type="password" id="inputPassword" class="form-control" placeholder="Enter password" required value={password} onChange={(e) => (setPassword(e.target.value))} />
                            </div>

                            <div class="mb-3">
                                <input className="btn btn-primary" type="submit" name="submit" value="Submit" />
                            </div>
                            <label>{error}</label>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
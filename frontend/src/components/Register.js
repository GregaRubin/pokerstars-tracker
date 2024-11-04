import { useState } from 'react';

function Register() {
    const [username, setUsername] = useState([]);
    const [password, setPassword] = useState([]);
    const [email, setEmail] = useState([]);
    const [error, setError] = useState([]);

    async function Register(e) {
        e.preventDefault();
        const res = await fetch("http://localhost:3001/users", {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                username: username,
                password: password
            })
        });
        const data = await res.json();
        if (data._id !== undefined) {
            window.location.href = "/login";
        }
        else {
            setUsername("");
            setPassword("");
            setEmail("");
            setError("Registration failed");
        }
    }

    return (
        <div class='container'>
            <div class="py-5 text-center">
                <h2>Register</h2>
            </div>
            <div class="col d-flex justify-content-center">
                <div class="card" style={{ width: '50rem' }}>
                    <div class="card-body">
                        <form onSubmit={Register}>
                    

                            <div class="mb-3">
                                <label for="inputUsername" class="sr-only">Username</label>
                                <input type="text" id="inputUsername" class="form-control" placeholder="Enter username" autofocus value={username} onChange={(e) => (setUsername(e.target.value))} />
                            </div>

                            <div class="mb-3">
                                <label for="inputEmail" class="sr-only">Email</label>
                                <input type="email" id="inputEmail" class="form-control" placeholder="Enter email" autofocus value={email} onChange={(e) => (setEmail(e.target.value))} />
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

export default Register;
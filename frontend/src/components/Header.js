import { useContext } from "react";
import { UserContext } from "../userContext";
import { Link } from "react-router-dom";

function Header(props) {
    return (
        <header class="p-3 bg-dark text-white">
            <div class="container">
                <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><Link class="nav-link px-2 text-secondary" to='/'>Home</Link></li>
                        <li><Link class="nav-link px-2 text-secondary" to='/leaderboard'>Leaderboard</Link></li>

                        <UserContext.Consumer>
                            {context => (
                                context.user ?
                                    <>
                                        <li><Link class="nav-link px-2 text-secondary" to='/upload'>Upload</Link></li>
                                        <li><Link class="nav-link px-2 text-secondary" to='/profile'>Profile</Link></li>
                                        <li><Link class="nav-link px-2 text-secondary" to='/sessions'>History</Link></li>
                                    </>
                                    :
                                    <>
                                    </>

                            )}
                        </UserContext.Consumer>
                    </ul>

                    <div class="text-end">
                        <UserContext>
                            {context => (
                                context.user ?
                                    <>
                                        <Link to='/logout'><button type="button" class="btn btn-outline-light me-2">Logout</button></Link>
                                    </>
                                    :
                                    <>
                                        <Link to='/login'><button type="button" class="btn btn-outline-light me-2">Login</button></Link>
                                        <Link to='/register'><button type="button" class="btn btn-warning">Register</button></Link>
                                    </>
                            )}
                        </UserContext>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
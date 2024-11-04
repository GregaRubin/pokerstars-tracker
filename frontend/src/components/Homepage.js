import { Link } from "react-router-dom";


function Homepage() {
    return (
        <main role="main">

            <div class="jumbotron">
                <div class="container">
                    <h1 class="display-3">PokerStars Tracker</h1>
                    <p>A simple website for all PokerStars enthuisiasts trying to improve their play</p>
                    <p><Link class="nav-link px-2 text-secondary" to='/register'><a class="btn btn-primary btn-lg" href="#" role="button">Register &raquo;</a></Link></p>
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-md-4">
                        <h2>Session History</h2>
                        <p>Upload your PokerStars logs and have a nice overview over all session you played. You can always download them to your PC if your local copies get lost.</p>
                        
                    </div>
                    <div class="col-md-4">
                        <h2>Statistical analisys</h2>
                        <p>Keep track of your profits and how many hands you played on your journey. Learn and improve from studying your poker stats such as your aggresion factor (agg), preflop raise (PFR), voluntarily put money in the pot (VPIP) and many more!</p>
                
                    </div>
                    <div class="col-md-4">
                        <h2>Rankings</h2>
                        <p>Compare yourself to other users on this site. You can always make your account private if you are shy. </p>
                        
                    </div>
                </div>
                <hr></hr>
            </div> 
        </main>
    );
}

export default Homepage;
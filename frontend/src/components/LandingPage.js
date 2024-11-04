import { UserContext } from '../userContext';
import Homepage from './Homepage';
import Stats from './Stats';

function LandingPage() {
    return (
        <UserContext.Consumer>
            {context => (
                context.user ?
                    <>
                        <Stats></Stats>
                    </>
                    :
                    <>
                        <Homepage></Homepage>
                    </>

            )}
        </UserContext.Consumer>
    );
}

export default LandingPage;
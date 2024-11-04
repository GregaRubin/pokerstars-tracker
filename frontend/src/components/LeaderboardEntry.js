function LeaderboardEntry(props) {


    return (
        <li class="list-group-item pt-0">
            <div class="d-flex align-items-center">
                <div class="flex-shrink-0 me-3">
                    <img src={"http://localhost:3001/" + props.user.imagePath} alt=""  class="avatar rounded-circle" />
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-0">{props.user.username}</h6>
                    <p class="mb-0 text-muted">{props.user.hands} Hands played</p>
                </div>
                <div class="flex-shrink-0 text-end">
                    <span>
                        ${props.user.profit.toFixed(2)}
                    </span>
                </div>
            </div>
        </li>
    );
}

export default LeaderboardEntry;
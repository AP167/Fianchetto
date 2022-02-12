import { setOpponent } from './Chessboard'
import { setUsername } from './Chessboard';

const createGame = (user1, user2) => {
//     var requestOptions = {
//      method: 'POST',
//      redirect: 'follow'
//    };
   
//    fetch(`http://taytay.pythonanywhere.com/challenge?opponent_username=${user2}&username=${user1}`, requestOptions)
//      .then(response => response.text())
//      .then(result => createWebsocket(user1, user2, result))
//      .catch(error => console.log('error', error));
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };


    fetch(`http://taytay.pythonanywhere.com/challenge?username=${user1}&opponent_username=${user2}`, requestOptions)
    .then(response => response.text())
    .then(result => joinAsChallenger(user1, user2, result))
    .catch(error => console.log('error', error));
    
}


const joinAsChallenger = (user1, user2, gameId) => {
    console.log("Me", user1)
    setOpponent("b", "m", gameId, user2)
    setUsername(user1)
}

// const sendMove = (move, outcome, opp) => {
//     if (opp==="b")
//         createWebsocket.sendMoveToOpp(move, outcome)
//     else
//         joinGame.sendMoveToChallenger(move, outcome)
// }


const joinAsOpponent = (user1, user2, gameId) => {
    console.log("Me", user1)
    setOpponent("w", "m", gameId, user2)
    setUsername(user1)
}



   
export { createGame, joinAsOpponent }
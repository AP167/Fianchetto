const getGameId = (user1, user2) => {
    var url = `taytay.pythonanywhere.com/challenge?opponent_username=${user2}`
    var data = { username : user1.toString() }
    fetch(url, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
}


export { getGameId }
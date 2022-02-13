import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import GamePage from "./components/GamePage"
import HomePage from "./components/HomePage"
import SignInPage from "./components/SignInPage"

var myUid, myUsername
const getMyUid = () => myUid
const getMyUsername = () => myUsername
const changeUser = (newUid, newUsername) => {
    myUid = newUid
    myUsername = newUsername
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path ='/' element={<HomePage />} />
                <Route path = '/sign-up' element={<SignInPage sign="Up" />} />
                <Route path = '/sign-in' element={<SignInPage sign="In" />} />
                <Route path = '/game-page' element={<GamePage />} />
            </Routes>
        </Router>
    )
}


export { getMyUid, getMyUsername, changeUser }
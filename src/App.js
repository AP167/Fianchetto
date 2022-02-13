import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import GamePage from "./components/GamePage"
import HomePage from "./components/HomePage"
import SignInPage from "./components/SignInPage"

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
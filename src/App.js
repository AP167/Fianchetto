import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import GamePage from "./components/GamePage"
import HomePage from "./components/HomePage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path ='/' element={<HomePage />} />
                <Route path = '/sign-up' element={<SignUp />} />
                <Route path = '/sign-in' element={<SignIn />} />
                <Route path = '/game-page' element={<GamePage />} />
            </Routes>
        </Router>
    )
}
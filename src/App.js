import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SignIn from "./components/SignIn";
// import SignUp from "./components/SignUp";
import GamePage from "./components/GamePage"

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path ='/' element={<SignIn />} />
                <Route path = '/signUp' element={<GamePage />} />
            </Routes>
        </Router>
    )
}
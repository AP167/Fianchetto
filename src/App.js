import './App.css'
import './components/Chessboard'
import Chessboard from './components/Chessboard'
import DialogBox from './components/PawnPromotionDialog'

function App() {
  return (
    <div className="App">
      <Chessboard />
      <DialogBox />
    </div>
  );
}

export default App

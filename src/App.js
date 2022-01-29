import './App.css'
import './components/Chessboard'
import Chessboard from './components/Chessboard'
import DialogBox from './components/PawnPromotionDialog'
import ResultDialog from './components/ResultDialog'

function App() {
  return (
    <div className="App">
      <Chessboard />
      <DialogBox />
      <ResultDialog />
    </div>
  );
}

export default App

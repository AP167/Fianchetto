import './App.css'
import './components/Chessboard'
import Chessboard from './components/Chessboard'
import DialogBox from './components/PawnPromotionDialog'
import ResultDialog from './components/ResultDialog'
import PlayMenu from './components/PlayMenu'
import StockfishDialog from './components/StockfishDialog'

function App() {
  return (
    <div className="App">
      <PlayMenu />
      <StockfishDialog />
      <Chessboard />
      <DialogBox />
      <ResultDialog />
    </div>
  );
}

export default App

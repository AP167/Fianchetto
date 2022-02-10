import './styles/GamePage.css'
import './Chessboard'
import Chessboard from './Chessboard'
import DialogBox from './PawnPromotionDialog'
import ResultDialog from './ResultDialog'
import PlayMenu from './PlayMenu'
import StockfishDialog from './StockfishDialog'

function GamePage() {
  return (
    <div className="GamePage">
      <PlayMenu />
      <StockfishDialog />
      <Chessboard />
      <DialogBox />
      <ResultDialog />
    </div>
  );
}

export default GamePage
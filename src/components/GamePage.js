import './styles/GamePage.css'
import './Chessboard'
import Chessboard from './Chessboard'
import DialogBox from './PawnPromotionDialog'
import ResultDialog from './ResultDialog'
import PlayMenu from './PlayMenu'
import StockfishDialog from './StockfishDialog'
import { useLocation } from 'react-router-dom'
import MultiplayerDialog from './MultiplayerDialog'
import GameIdDialog from './GameIdDialog'
import OfferDrawDialog from './OfferDrawDialog'

function GamePage() {
  const {state} = useLocation() 
  console.log("state : ", state)
  var uid = null
  if (state!==null)
    ({uid} = state)
  console.log("uid in gamepage : ", uid)
  console.log("state : ", state)
  if (uid===null){
    return <>Error : Invalid page</>
  }
  return (
    <div className="GamePage">
      <PlayMenu />
      <StockfishDialog />
      <MultiplayerDialog />
      <GameIdDialog />
      <Chessboard />
      <DialogBox />
      <OfferDrawDialog />
      <ResultDialog />
    </div>
  );
}

export default GamePage
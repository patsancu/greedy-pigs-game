import {useState} from "react";

function Message({
                   lastEvent,
                   player1turn,
                 }: {
  readonly lastEvent: string; // Replace 'string' with the actual type of lastEvent
  readonly player1turn: boolean; // Replace 'boolean' with the actual type of player1turn
})
 {
  const player1color = "#f1ff3b";
  const player2color = "#a7caff";
  const player1Text = "Player 1";
  const player2Text = "Player 2";

  function getUserColor(currentPlayer: string) {
    if (currentPlayer === player1Text) {
      return player1color;
    } else {
      return player2color;
    }
  }

  let bgColor = "";
  let textColor = "";
  console.log(`Last event is: ${lastEvent}`);
  let message = "";
  if (lastEvent === "GREEDY") {
    bgColor = "red";
    textColor = "white";
    // Users have switched turns
    const greedyPlayer = player1turn ? player2Text : player1Text;
    const currentPlayer = player1turn ? player1Text : player2Text;
    message = `${greedyPlayer} was too greedy! It's ${currentPlayer}'s turn`;
  } else if (lastEvent === "WIN") {
    bgColor = "lightgreen";
    // A game can only be won by a user ending their turn,
    // and having a total result bigger than the goal points,
    // which means that it will be the turn of the other player
    const winningPlayer = player1turn ? player2Text : player1Text;
    message = `${winningPlayer} is the winner!`;
  } else if (lastEvent === "TURN") {
    const currentPlayer = player1turn ? player1Text : player2Text;
    bgColor = getUserColor(currentPlayer);
    message = `it's ${currentPlayer}'s turn`;
  }

  return <div style={{
    backgroundColor: bgColor,
    color: textColor,
    marginLeft: "auto",
    textAlign: "center",
  }}>{message}</div>

}

export default function Game() {
  const DEFAULT_POINTS_GOAL = 10;

  const [player1totalWins, setPlayer1totalWins] = useState(0);
  const [player2totalWins, setPlayer2totalWins] = useState(0);
  const [generatedNumber, setGeneratedNumber] = useState(0);
  const [totalPlayer1, setTotalPlayer1] = useState(0);
  const [totalPlayer2, setTotalPlayer2] = useState(0);
  const [currentTotalPlayer, setCurrentTotalPlayer] = useState(0);
  const [player1turn, setPlayer1turn] = useState(true);
  const [lastEvent, setLastEvent] = useState("NEW_GAME");
  const [pointsGoal, setPointsGoal] = useState(DEFAULT_POINTS_GOAL);
  const [userPointsGoal, setUserPointsGoal] = useState(DEFAULT_POINTS_GOAL);

  const [currentNumberOfThrows, setCurrentNumberOfThrows] = useState(0);

  function getPlayerName() {
    if (player1turn) {
      return "player1";
    }
    return "player 2"
  }

  function generateD6number() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function switchPlayer() {
    setPlayer1turn(!player1turn);
  }

  function clearCurrentTotal() {
    setCurrentTotalPlayer(0);
  }

  function clearCurrentNumberOfThrows() {
    setCurrentNumberOfThrows(0);
  }

  function requestNewNumber() {
    const newNumber = generateD6number();
    setGeneratedNumber(newNumber);
    clearLastEvent();
    setCurrentNumberOfThrows(currentNumberOfThrows + 1);
    if (newNumber !== 1) {
      setLastEvent("TURN");
      console.log(`Will update total to: ${currentTotalPlayer + newNumber}`)
      setCurrentTotalPlayer(currentTotalPlayer + newNumber);
    } else {
      setLastEvent("GREEDY");
      clearCurrentTotal();
      switchPlayer();
      clearCurrentNumberOfThrows();
    }
  }

  function endTurn() {
    if (player1turn) {
      const newTotal = totalPlayer1 + currentTotalPlayer;
      setTotalPlayer1(newTotal);

      if (newTotal >= pointsGoal) {
        setLastEvent("WIN");
        setPlayer1totalWins(player1totalWins + 1);
        console.log(`Player 1 WON`);
      }
      console.log(`Player 1 now has ${newTotal} points`);
    } else {
      const newTotal = totalPlayer2 + currentTotalPlayer;
      setTotalPlayer2(newTotal);
      if (newTotal >= pointsGoal) {
        setPlayer2totalWins(player2totalWins + 1);
        setLastEvent("WIN");
        console.log(`Player 2 WON`);
      }
      console.log(`Player 2 now has ${newTotal} points`);
    }
    clearGeneratedNumber();
    switchPlayer();
    clearCurrentTotal();
  }

  function clearTotalPlayer1() {
    setTotalPlayer1(0);

  }

  function clearTotalPlayer2() {
    setTotalPlayer2(0);

  }

  function clearCurrentTotalPlayer() {
    setCurrentTotalPlayer(0);
  }

  function clearLastEvent() {
    setLastEvent("TURN");
  }

  function clearGeneratedNumber() {
    setGeneratedNumber(0);
  }

  function randomizePlayerTurn() {
    if (Math.random() < 0.5) {
      setPlayer1turn(true);
    } else {
      setPlayer1turn(false);
    }
  }

  function resetGame() {
    clearLastEvent();
    clearCurrentTotal();
    clearLastEvent();
    clearCurrentTotalPlayer();
    randomizePlayerTurn();
    clearTotalPlayer1();
    clearTotalPlayer2();
  }

  function handlePointGoalsChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === "") {
      setUserPointsGoal(0);
    } else {
      setUserPointsGoal(parseInt(e.target.value));
    }

  }

  function handleNewGameWithNewPoints() {
    if (isNaN(userPointsGoal)) {
      setPointsGoal(0);
    } else {
      setPointsGoal(userPointsGoal);
    }
    console.log(`Creating game with new points goal of: ${userPointsGoal}`);
    resetGame();
  }

  return (
      <div style=
               {{
                 maxWidth: "80%",
                 marginLeft: "auto",
                 marginRight: "auto"
               }}>
        <h1>Pigs</h1>
        <div>Points goal: {pointsGoal}</div>
        <div>New goal points?</div>
        <input value={userPointsGoal}
               onChange={handlePointGoalsChange}
        />
        <button onClick={handleNewGameWithNewPoints}>New game with this points goal</button>
        <hr/>
        <div>Total wins player 1: {player1totalWins}</div>
        <div>Total wins player 2: {player2totalWins}</div>
        <hr/>
        <h2>Status</h2>
        <Message lastEvent={lastEvent} player1turn={player1turn}/>

        <div>Total player 1: {totalPlayer1}</div>
        <div>Total player 2: {totalPlayer2}</div>
        <div>Current total: {currentTotalPlayer}</div>
        <div>
          <h4>Generated number: {generatedNumber}</h4>
          <button disabled={lastEvent === "WIN"} onClick={requestNewNumber}>Throw die</button>
        </div>
        <div>
          <button disabled={generatedNumber === 1 || lastEvent === "WIN"}
                  onClick={endTurn}>End turn for player {getPlayerName()}
          </button>
        </div>
        <div>
          <button onClick={resetGame}>New game</button>
        </div>

      </div>
  );
};
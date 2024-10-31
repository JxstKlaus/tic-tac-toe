const Player = (name, marker)=> {
    return { name, marker };
}

const GameBoard = (()=>{
    const board = ["", "", "", "", "", "", "", "", ""];

    const getField = (index) => board[index];
    const setField = (index, marker) => board[index] = marker;
    const resetBorad = () => board = ["", "", "", "", "", "", "", "", ""];
    const displayBoard = () => console.log(Array.from({ length: board.length / 3 }, (_, i) => board.slice(i * 3, i * 3 + 3)));

    return {getField, setField, resetBorad, displayBoard}


})();

const GameController = (()=>{
    const playerX = Player("player1", "X");
    const playerO = Player("player2", "O");

    let rounds = 1, isOver = false, turn = playerX, winner= "";

    const playRound = (fieldIndex)=>{
        GameBoard.setField(fieldIndex, turn.marker);
        checkForResult();
        changeTurn();
        rounds++ ;
        GameBoard.displayBoard()
    }

    const checkForResult = () =>{
        const isWin = ()=>{
            const winningCombinations = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8], 
                [2, 4, 6]
            ];
    
            return winningCombinations.map(combination => combination
                .filter(index => GameBoard.getField(index) !== "" && GameBoard.getField(index) === GameBoard.getField(combination[0]))
                .length === combination.length).includes(true);
        }
        if (isWin()){
            winner = turn.name;
            isOver = true
            console.log(`${turn.name} Wins!!`)
        }
        else if (rounds == 9) {
            isOver = true;
            return;
        }
    }
    
    const changeTurn = () =>{
        if (turn == playerX) turn = playerO
        else turn = playerX
        //console.log(`Now comes ${turn.name}`)
    }

    const restartGame = () => {
        rounds = 1;
        isOver = false;
        turn = playerX;
        winner = "";
    }

    const getTurn = () => turn;
    const getIsOver = () => isOver;

    //TEST

    //playRound(2, turn.marker);
    //playRound(4, turn.marker);
    //playRound(6, turn.marker);
    //playRound(5, turn.marker);
    //playRound(0, turn.marker);
    //playRound(8, turn.marker);
    //playRound(1, turn.marker);
    //GameBoard.displayBoard();

    return {rounds, getTurn, getIsOver, winner, playRound}

})();


const DisplayController = (()=>{
    const fields = document.querySelectorAll(".field");
    fields.forEach(field => field.addEventListener("click", () => updateBoard(field)))

    const updateBoard = (fieldElement) =>{
        if (!fieldElement.classList.contains("active")){
            fieldElement.textContent = GameController.getTurn().marker;
            setActive(fieldElement);
            GameController.playRound(parseInt(fieldElement.id));
        }
        
    }

    const setActive = (e) => e.classList.add("active")
})();
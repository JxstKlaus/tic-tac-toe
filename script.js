const Player = (name, marker)=> {
    return { name, marker };
}

const GameBoard = (()=>{
    const board = ["", "", "", "", "", "", "", "", ""];

    const getField = (index) => board[index];
    const setField = (index, marker) => board[index] = marker;
    const resetBorad = () => board.forEach((_,i) => board[i]="")
    const displayBoard = () => console.log(Array.from({ length: board.length / 3 }, (_, i) => board.slice(i * 3, i * 3 + 3)));

    return {getField, setField, resetBorad, displayBoard}


})();

const GameController = (()=>{
    const playerX = Player("player1", "X");
    const playerO = Player("player2", "O");

    let rounds = 1, isOver = false, turn = playerX, winner= "";
    
    const getTurn = () => turn;
    const getIsOver = () => isOver;
    const getMarker = () => turn.marker;

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
            GameBoard.resetBorad()
            console.log(`${turn.name} Wins!!`)
            DisplayController.resetBoard()
            restartGame()
        }
        else if (rounds == 9) {
            isOver = true;
            return;
        }
    }
    
    const changeTurn = () =>{
        if (turn == playerX) turn = playerO
        else turn = playerX
        console.log(`Now comes ${turn.name}`)
    }

    const restartGame = () => {
        rounds = 1;
        isOver = false;
        turn = playerO
        winner = "";
    }

    return {rounds, getTurn, getIsOver, getMarker, playRound}
})();


const DisplayController = (()=>{
    const fields = document.querySelectorAll(".field");
    const restartBtn = document.querySelector(".restart-btn")
    const endModal = document.querySelector(".end-modal")
    const endText = document.querySelector(".end-text")
    fields.forEach(field => field.addEventListener("click", () => updateBoard(field)))
    restartBtn.addEventListener("click", () => endModal.classList.remove("active"))

    const updateBoard = (fieldElement) =>{
        if (!fieldElement.classList.contains("active")){
            fieldElement.textContent = GameController.getTurn().marker;
            setActive(fieldElement);
            GameController.playRound(parseInt(fieldElement.id));
        }
    }

    const displayEndModal = () =>{
        setActive(endModal)
        endText.textContent = `Winner: ${GameController.getMarker()}`
    }

    const setActive = (e) => e.classList.add("active")
    const removeActive = (e) => e.classList.remove("active")

    const resetBoard = () => {fields.forEach(field => {
            removeActive(field)
            field.textContent = ""
        })

        displayEndModal()
    }
    
    return {resetBoard}
})();
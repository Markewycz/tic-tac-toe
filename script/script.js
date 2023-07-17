"use strict";

const fields = document.querySelectorAll(".field");

const Player = (sign, name) => {
  const getSign = () => sign;
  const getName = () => name;

  return { getSign, getName };
};

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const resetBoard = () => board.fill("");

  const setField = (playerSign, id) => {
    board[id - 1] = playerSign;
  };

  const renderBoard = () => {
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== "") {
        fields[i].textContent = board[i];
      }
    }
    console.log(board);
  };

  const removeFieldListener = (handler) => {
    fields.forEach((field) => {
      field.removeEventListener("click", handler, true);
    });
  };

  return { setField, renderBoard, resetBoard, removeFieldListener, board };
})();

const displayController = (() => {
  const menuContainer = document.querySelector(".menu-container");
  const hideMenu = () => {
    const menuContent = document.querySelector(".menu-content");
    menuContent.classList.remove("slide-in-left");
    menuContent.classList.add("slide-out-blurred-top");
    menuContainer.classList.add("hidden");
  };

  const showWinner = (winner, looser) => {
    menuContainer.innerHTML = "";
    menuContainer.classList.remove("hidden");
    menuContainer.innerHTML = `
    <div class="menu-content slide-in-left">
      <div class="welcome-message">
        <h1>🎉Congratulations!🎉 <br>${winner.getName()} you won!</h1>
        <h3>${looser.getName()} do you want a revenge?</h3>
      </div>
      
      <div class="start">
        <button
          type="button"
          class="button"
          onclick="displayController.hideMenu();gameController.playRound();"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
    `;
  };

  const showTie = () => {
    menuContainer.innerHTML = "";
    menuContainer.classList.remove("hidden");
    menuContainer.innerHTML = `
    <div class="menu-content slide-in-left">
      <div class="welcome-message">
        <h1>🤔Hmmm..🤔<br>Great minds think alike I guess</h1>
        <h3>Do you want to play again?</h3>
      </div>
      
      <div class="start">
        <button
          type="button"
          class="button"
          onclick="displayController.hideMenu();gameController.playRound();"
        >
          PLAY AGAIN
        </button>
      </div>
    </div>
    `;
  };
  const resetFields = () => {
    fields.forEach((field) => {
      field.textContent = "";
    });
  };
  return { resetFields, hideMenu, showWinner, showTie };
})();

const gameController = (() => {
  let activePlayer, player1, player2, handler;

  const winConditions = [
    // ROWS
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // COLS
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // DIAG
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWin = () => {
    const board = gameBoard.board;
    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      const combination = [board[a], board[b], board[c]];

      if (combination.every((mark) => mark === "X")) {
        console.log("X wins");
        displayController.showWinner(player1, player2);
        gameBoard.removeFieldListener(handler);
      } else if (combination.every((mark) => mark === "O")) {
        console.log("O wins");
        displayController.showWinner(player2, player1);
        gameBoard.removeFieldListener(handler);
      } else if (!board.includes("")) {
        console.log("TIE");
        displayController.showTie();
        gameBoard.removeFieldListener(handler);
      }
    }
  };

  const changePlayer = () => {
    return (activePlayer = player1 === activePlayer ? player2 : player1);
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    displayController.resetFields();
  };

  const playRound = () => {
    resetGame();

    if (!player1 || !player2) {
      const playerOneInput = document.getElementById("playerOne");
      const playerTwoInput = document.getElementById("playerTwo");
      player1 = Player("X", playerOneInput.value);
      player2 = Player("O", playerTwoInput.value);
    }

    activePlayer = player1;

    handler = (e) => {
      const id = +e.target.dataset.id;
      if (gameBoard.board[id - 1] === "") {
        gameBoard.setField(activePlayer.getSign(), id);
        gameBoard.renderBoard();
        checkWin();
        changePlayer();
      }
    };

    fields.forEach((field) => {
      field.addEventListener("click", handler, true);
    });
  };

  return { playRound };
})();

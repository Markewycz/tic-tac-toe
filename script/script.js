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
  const hideMenu = () => {
    const menuContainer = document.querySelector(".menu-container");
    const menuContent = document.querySelector(".menu-content");
    menuContent.classList.remove("slide-in-left");
    menuContent.classList.add("slide-out-blurred-top");
    menuContainer.classList.add("hidden");
  };

  const resetFields = () => {
    fields.forEach((field) => {
      field.textContent = "";
    });
  };
  return { resetFields, hideMenu };
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
        gameBoard.removeFieldListener(handler);
        setTimeout(() => {
          resetGame();
        }, 2000);
      } else if (combination.every((mark) => mark === "O")) {
        console.log("O wins");
        gameBoard.removeFieldListener(handler);
        setTimeout(() => {
          resetGame();
        }, 2000);
      } else if (!board.includes("")) {
        console.log("TIE");
        gameBoard.removeFieldListener(handler);
        setTimeout(() => {
          resetGame();
        }, 2000);
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
    const playerOneInput = document.getElementById("playerOne");
    const playerTwoInput = document.getElementById("playerTwo");
    player1 = Player("X", playerOneInput.value);
    player2 = Player("O", playerTwoInput.value);
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

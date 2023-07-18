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
    if (board[id] === "") {
      board[id] = playerSign;
      return true;
    } else {
      return false;
    }
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
  const selectEnemy = () => {
    const enemys = document.querySelectorAll(".enemy");
    const playerTwoInput = document.getElementById("playerTwo");

    enemys.forEach((enemy) => {
      enemy.addEventListener("click", (e) => {
        if (enemy.classList.contains("selected")) return;
        if (!enemy.classList.contains("selected")) {
          enemys.forEach((enemy) => {
            enemy.classList.remove("selected");
          });
          enemy.classList.add("selected");
        }

        if (enemys[1].classList.contains("selected")) {
          gameController.setVsAi(true);
          playerTwoInput.classList.add("disable");
          playerTwoInput.value = "";
        } else {
          gameController.setVsAi(false);
          playerTwoInput.classList.remove("disable");
        }
      });
    });
  };
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
    <div class="menu-content winner-content slide-in-left">
      <div class="welcome-message winner">
        <h1>🎉Congratulations!🎉 <br>${winner.getName()} you won!</h1>
        <h3>${looser.getName()} do you want a revenge?</h3>
      </div>
      
      <div class="start start-winner">
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
    <div class="menu-content winner-content slide-in-left">
      <div class="welcome-message winner">
        <h1>🤔Hmmm..🤔<br>Great minds think alike I guess</h1>
        <h3>Do you want to play again?</h3>
      </div>
      
      <div class="start start-winner">
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
  return { resetFields, hideMenu, showWinner, showTie, selectEnemy };
})();

const gameController = (() => {
  let activePlayer, player1, player2, handler;
  let vsAi = false;
  let isAITurn = false;
  let isUserTurn = true;

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

  const setVsAi = (value) => (vsAi = value);

  const gameInit = () => {
    displayController.selectEnemy(vsAi);
  };
  const playersInit = () => {
    if (vsAi && !player1) {
      const playerOneInput = document.getElementById("playerOne");
      player1 = Player("X", playerOneInput.value);
      player2 = Player("O", "Artificial Intelligence");
    } else {
      if (!player1 || !player2) {
        const playerOneInput = document.getElementById("playerOne");
        const playerTwoInput = document.getElementById("playerTwo");
        player1 = Player("X", playerOneInput.value);
        player2 = Player("O", playerTwoInput.value);
      }
    }
    activePlayer = player1;
  };

  const aiMove = () => {
    if (isAITurn) {
      let indexes = [];
      gameBoard.board.forEach((el, index) => {
        if (el === "") indexes.push(index);
      });

      const randomId = Math.floor(Math.random() * indexes.length);
      gameBoard.setField(activePlayer.getSign(), indexes[randomId]);
      isUserTurn = true;
    }
  };

  const checkWin = () => {
    const board = gameBoard.board;
    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      const combination = [board[a], board[b], board[c]];

      if (combination.every((mark) => mark === "X")) {
        console.log("X wins");
        displayController.showWinner(player1, player2);
        gameBoard.removeFieldListener(handler);
        return true;
      } else if (combination.every((mark) => mark === "O")) {
        console.log("O wins");
        displayController.showWinner(player2, player1);
        gameBoard.removeFieldListener(handler);
        return true;
      } else if (
        !combination.every((mark) => mark === "X") &&
        !combination.every((mark) => mark === "O") &&
        !board.includes("")
      ) {
        console.log("TIE");
        displayController.showTie();
        gameBoard.removeFieldListener(handler);
        return true;
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
    playersInit();

    handler = (e) => {
      if (!isUserTurn) return; // PREVENT USER CLICKING WHEN AI TURN
      const id = +e.target.dataset.id - 1;

      // PLAYER VS PLAYER
      if (
        (activePlayer === player1 &&
          gameBoard.setField(activePlayer.getSign(), id)) ||
        (activePlayer === player2 &&
          gameBoard.setField(activePlayer.getSign(), id))
      ) {
        gameBoard.renderBoard();
        if (checkWin()) return;
        changePlayer();
        if (vsAi) isUserTurn = false;
      }

      // VS AI
      if (vsAi && activePlayer === player2) {
        isAITurn = true;
        const timeoutDuration = Math.floor(Math.random() * 1400) + 700;

        setTimeout(() => {
          aiMove();
          gameBoard.renderBoard();
          if (checkWin()) return;
          changePlayer();
          isAITurn = false;
        }, timeoutDuration);
      }
    };

    fields.forEach((field) => {
      field.addEventListener("click", handler, true);
    });
  };

  return { playRound, gameInit, setVsAi };
})();

gameController.gameInit();

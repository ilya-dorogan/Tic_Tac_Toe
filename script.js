"use strict";

window.addEventListener('DOMContentLoaded', () => {
	let origBoard,
		huPlayer,
		aiPlayer;
	const	winCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[6, 4, 2]
		],
		cells = document.querySelectorAll('.cell'),
		restartBtn = document.querySelectorAll('.restart_btn'),
		modal = document.querySelector('.modal'),
		chooseCross = document.querySelector('.cross'),
		chooseCircle =document.querySelector('.circle');

	startGame();

	chooseSign();

function chooseSign(){
	chooseCross.addEventListener('click',()=>{
		huPlayer = 'X';
		aiPlayer ='O';
		modal.style.display='none';
	});
	chooseCircle.addEventListener('click',()=>{
		huPlayer = 'O';
		aiPlayer ='X';
		modal.style.display='none';
	});


}


	restartBtn.forEach((btn) => {
		btn.addEventListener('click', startGame);
	});

	function startGame() {
		modal.style.display ='flex';
		document.querySelector('.result').style.display = 'none';
		origBoard = Array.from(Array(9).keys());
		for (let i = 0; i < cells.length; i++) {
			cells[i].innerText = '';
			cells[i].style.removeProperty('background-color');
			cells[i].addEventListener('click', turnClick, false);
		}
	}

	function turnClick(square) {
		if (typeof origBoard[square.target.id] == 'number') {
			turn(square.target.id, huPlayer);
			if (!checkTie()) {
				turn(bestSpot(), aiPlayer);
			}
		}
	}

	function turn(squareId, player) {
		origBoard[squareId] = player;
		document.getElementById(squareId).innerText = player;
		let gameWon = checkWin(origBoard, player);
		if (gameWon) {
			gameOver(gameWon);
		}
	}

	function checkWin(board, player) {
		let plays = board.reduce((a, e, i) =>
			(e === player) ? a.concat(i) : a, []);
		let gameWon = null;
		for (let [index, win] of winCombos.entries()) {
			if (win.every(elem => plays.indexOf(elem) > -1)) {
				gameWon = {
					index: index,
					player: player
				};
				break;
			}
		}
		return gameWon;
	}

	function gameOver(gameWon) {
		for (let index of winCombos[gameWon.index]) {
			document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "green" : "red";
		}
		for (let i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner(gameWon.player == huPlayer ? "Ты победил!" : "Ты проиграл.");
	}

	function declareWinner(who) {
		document.querySelector('.result').style.display = 'flex';
		document.querySelector('.message').innerText = who;
	}

	function emptySquares() {
		return origBoard.filter(s => typeof s === 'number');
	}

	function bestSpot() {
		return minimax(origBoard, aiPlayer).index;
	}

	function checkTie() {
		if (emptySquares().length == 0) {
			for (let i = 0; i < cells.length; i++) {
				cells[i].style.backgroundColor = "yellow";
				cells[i].removeEventListener('click', turnClick, false);
			}
			declareWinner("Ничья, попробуй ещё раз.");
			return true;
		}
		return false;
	}

	function minimax(newBoard, player) {
		let availSpots = emptySquares();

		if (checkWin(newBoard, huPlayer)) {
			return {
				score: -10
			};
		} else if (checkWin(newBoard, aiPlayer)) {
			return {
				score: 10
			};
		} else if (availSpots.length === 0) {
			return {
				score: 0
			};
		}
		let moves = [];
		for (let i = 0; i < availSpots.length; i++) {
			let move = {};
			move.index = newBoard[availSpots[i]];
			newBoard[availSpots[i]] = player;

			if (player == aiPlayer) {
				let result = minimax(newBoard, huPlayer);
				move.score = result.score;
			} else {
				let result = minimax(newBoard, aiPlayer);
				move.score = result.score;
			}

			newBoard[availSpots[i]] = move.index;

			moves.push(move);
		}

		let bestMove;

		if (player === aiPlayer) {
			let bestScore = -10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			let bestScore = 10000;
			for (let i = 0; i < moves.length; i++) {
				if (moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}

		}
		return moves[bestMove];
	}




});
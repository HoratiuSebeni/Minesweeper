let boardDimension = 0;
let totalBombs = 0;
let timeSeconds = 0;
let timeMinutes = 0;
let timeCounter;
let discoveredCells = 0;
let totalFlag = 0;

function verifyOption() {
    if (document.getElementById('inputDimension').value == "") {
        alert('Please choose an option');
    } else {
        boardDimension = document.getElementById('inputDimension').value;
        startGame();
    }
}

function startGame() {
    displaySection('startContainer', 'none');
    displaySection('gameCard', '');
    calculateNumberBombs();
    generateBoard();
    generateBombs();
    document.getElementById('timer').innerHTML = '00:00';
    if (!timeCounter) {
        timeCounter = setInterval(increaseTime, 1000)   
    }
    document.getElementById('resultButton').innerHTML = `&#10068`;
}

function displaySection(containerID, type) {
    document.getElementById(containerID).style.display= type;
}

function calculateNumberBombs() {
    if (boardDimension == 9) {
        totalBombs = 10;
    } else if (boardDimension == 10) {
        totalBombs  = 20;
    } else if (boardDimension == 15) {
        totalBombs = 50;
    } else if (boardDimension == 20) {
        totalBombs = 100;
    }
    totalFlag = totalBombs;
    counterBombs(totalBombs);
}

function counterBombs(noBombs) {
    document.getElementById('remainingBombs').innerHTML= noBombs;
}

function generateBoard() {
    const noContext = document.getElementById('gameBoard');
    noContext.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    for (let x = 0; x < boardDimension; ++ x) {
        document.getElementById('gameBoard').innerHTML += `
        <tr id="row${x}"></tr>
        `;
        for (let y = 0; y < boardDimension; ++y) {
            document.getElementById('row'+x).innerHTML += `
            <td>
                <button type=button id="button${x}${y}" class="unchecked" value="" onclick="checkCell(${x}, ${y})" oncontextmenu="flag('button${x}${y}')"></button>
                <div id="cell${x}${y}" class="checked" data-value="0" data-discovered="" style="display: none"></div>
            </td>
            `;
        }
    }
}

function generateBombs() {
    let idBomb = [];
    for (let i = 0; i < totalBombs; ++i) {
        while (idBomb[i] == undefined) {
            let aux = Math.floor(Math.random() * (boardDimension * boardDimension));
            let find = 0;
            for (let j = 0; j < idBomb.length; ++j) {
                if (aux == idBomb[j]) {
                    ++find;
                }
            }
            if (find == 0) {
                idBomb[i] = aux;
                asignBombs(idBomb[i]);
            }
        }
    }
}

function asignBombs(idBomb) {
    let noCell = 0;
    for (let x = 0; x < boardDimension; ++x) {
        for (let y = 0; y < boardDimension; ++y) {
            ++noCell;
            if (noCell == idBomb) {
                document.getElementById('cell' + x + y).dataset.value = '-1';
                document.getElementById('cell' + x + y).innerHTML = `&#128163`;
                increaseCellsValue(x, y);
                return;
            }
        }
    }
}

function increaseCellsValue(x, y) {
    if (x > 0 && parseInt(document.getElementById('cell' + (x - 1) + y).dataset.value) >= 0) {
        modifyCells((x - 1), y);
    }
    if (x > 0 && y < (boardDimension - 1) && parseInt(document.getElementById('cell' + (x - 1) + (y + 1)).dataset.value) >= 0) {
        modifyCells((x - 1), (y + 1));
    }
    if (y < (boardDimension - 1) && parseInt(document.getElementById('cell' + x + (y + 1)).dataset.value) >= 0) {
        modifyCells(x, (y + 1));
    }
    if (x < (boardDimension - 1) && y < (boardDimension - 1) && parseInt(document.getElementById('cell' + (x + 1) + (y + 1)).dataset.value) >= 0) {
        modifyCells((x + 1), (y + 1));
    }
    if (x < (boardDimension - 1) && parseInt(document.getElementById('cell' + (x + 1) + y).dataset.value) >= 0) {
        modifyCells((x + 1), y);
    }
    if (x < (boardDimension - 1) && y > 0 && parseInt(document.getElementById('cell' + (x + 1) + (y - 1)).dataset.value) >= 0) {
        modifyCells((x + 1), (y - 1));
    }
    if (y > 0 && parseInt(document.getElementById('cell' + x + (y - 1)).dataset.value) >= 0) {
        modifyCells(x, (y - 1));
    }
    if (x > 0 && y > 0 && parseInt(document.getElementById('cell' + (x - 1) + (y - 1)).dataset.value) >= 0) {
        modifyCells((x - 1), (y - 1));
    }
}

function modifyCells(x, y) {
    let aux = parseInt(document.getElementById('cell' + x + y).dataset.value);
    ++aux;
    document.getElementById('cell' + x + y).dataset.value = aux;
    document.getElementById('cell' + x + y).innerHTML = aux;
    if (aux <= 4) {
        document.getElementById('cell' + x + y).className = 'checked'+aux;
    }
}

function flag(id) {
    if (document.getElementById(id).value == ""){
        document.getElementById(id).value= "flag";
        document.getElementById(id).innerHTML= `&#128681`;
        --totalFlag;
        counterBombs(totalFlag);
    } else {
        document.getElementById(id).value = "";
        document.getElementById(id).innerHTML= ``;
        ++totalFlag;
        counterBombs(totalFlag);
    }
}

function checkCell(x, y) {
    let aux = parseInt(document.getElementById('cell' + x + y).dataset.value);
    if (aux >= 0 && document.getElementById('button' + x + y).value == "") {
        discoverCell(x, y);
    }
    if (aux == 0 && document.getElementById('button' + x + y).value == "") {
        automaticCheckCell(x, y);   
    }
    if (aux == -1 && document.getElementById('button' + x + y).value == "") {
        document.getElementById('cell' + x + y).style.backgroundColor= "red";
        stopGame('&#128549');
    }
    if (discoveredCells == (boardDimension * boardDimension) - totalBombs) {
        stopGame('&#128516');
    }
}

function discoverCell(x, y) {
    if (document.getElementById('cell' + x + y).dataset.discovered == "") {
        displaySection('button' + x + y, 'none');
        displaySection('cell' + x + y, '');
        document.getElementById('cell' + x + y).dataset.discovered = "1";
        ++discoveredCells;
    }
}

function checkPerimetralCell(x, y) {
    let aux = parseInt(document.getElementById('cell' + x + y).dataset.value);
    if (aux == 0 && document.getElementById('cell' + x + y).dataset.discovered == "" && document.getElementById('button' + x + y).value == "") {
        return 0;
    } else if (aux == 0 && document.getElementById('cell' + x + y).dataset.discovered == "" && document.getElementById('button' + x + y).value != "") {
        return 1;
    } else if (aux >= 0 && document.getElementById('cell' + x + y).dataset.discovered == "" && document.getElementById('button' + x + y).value == "") {
        return 2;
    } else {
        return -1;
    }
}

function automaticCheckCell(positionX, positionY) {
    let coordX = [];
    let coordY = [];
    coordX[0] = positionX;
    coordY[0] = positionY;
    let valuePerimetralCell;
    for (let i = 0, length = 1; i < length; ++i) {
        let x = coordX[i];
        let y = coordY[i];
        if (x > 0) {
            valuePerimetralCell = checkPerimetralCell((x - 1), y);
            if (valuePerimetralCell == 0) {
                coordX[length] = (x - 1); 
                coordY[length] = y;
                ++length;
                discoverCell((x - 1), y);
            } else if (valuePerimetralCell == 1) {
                coordX[length] = (x - 1); 
                coordY[length] = y;
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell((x - 1), y);
            }
        }
        if (x > 0 && y < (boardDimension - 1)) {
            valuePerimetralCell = checkPerimetralCell((x - 1), (y + 1));
            if (valuePerimetralCell == 0) {
                coordX[length] = (x - 1);
                coordY[length] = (y + 1);
                ++length;
                discoverCell((x - 1), (y + 1));
            } else if (valuePerimetralCell == 1) {
                coordX[length] = (x - 1);
                coordY[length] = (y + 1);
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell((x - 1), (y + 1));
            }
        }
        if (y < (boardDimension - 1)) {
            valuePerimetralCell = checkPerimetralCell(x , (y + 1));
            if (valuePerimetralCell == 0) {
                coordX[length] = x;
                coordY[length] = (y + 1);
                ++length;
                discoverCell(x, (y + 1));
            } else if (valuePerimetralCell == 1) {
                coordX[length] = x;
                coordY[length] = (y + 1);
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell(x, (y + 1));
            }
        }
        if (x < (boardDimension - 1) && y < (boardDimension - 1)) {
            valuePerimetralCell = checkPerimetralCell((x + 1), (y + 1));
            if (valuePerimetralCell == 0) {
                coordX[length] = (x + 1);
                coordY[length] = (y + 1);
                ++length;
                discoverCell((x + 1), (y + 1));
            } else if (valuePerimetralCell == 1) {
                coordX[length] = (x + 1);
                coordY[length] = (y + 1);
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell((x + 1), (y + 1));
            }
        }
        if (x < (boardDimension - 1)) { 
            valuePerimetralCell = checkPerimetralCell((x + 1), y);
            if (valuePerimetralCell == 0) {
                coordX[length] = (x + 1);
                coordY[length] = y;
                ++length;
                discoverCell((x + 1), y);
            } else if (valuePerimetralCell == 1) {
                coordX[length] = (x + 1);
                coordY[length] = y;
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell((x + 1), y);
            }
        }
        if (x < (boardDimension - 1) && y > 0) {
            valuePerimetralCell = checkPerimetralCell((x + 1), (y - 1));
            if (valuePerimetralCell == 0) {
                coordX[length] = (x + 1);
                coordY[length] = (y - 1);
                ++length;
                discoverCell((x + 1), (y - 1));
            } else if (valuePerimetralCell == 1) {
                coordX[length] = (x + 1);
                coordY[length] = (y - 1);
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell((x + 1), (y - 1));
            }
        }
        if (y > 0) {
            valuePerimetralCell = checkPerimetralCell(x, (y - 1));
            if (valuePerimetralCell == 0) {
                coordX[length] = x;
                coordY[length] = (y - 1);
                ++length;
                discoverCell(x, (y - 1));
            } else if (valuePerimetralCell == 1) {
                coordX[length] = x;
                coordY[length] = (y - 1);
                ++length;
            } else if  (valuePerimetralCell == 2) {
                discoverCell(x, (y - 1));
            }
        }
        if (x > 0 && y > 0) {
            valuePerimetralCell = checkPerimetralCell((x - 1), (y - 1));
            if (valuePerimetralCell == 0) {
                coordX[length] = (x - 1);
                coordY[length] = (y - 1);
                ++length;
                discoverCell((x - 1), (y - 1));
            } else if (valuePerimetralCell == 1) {
                coordX[length] = (x - 1);
                coordY[length] = (y - 1);
                ++length;
            } else if (valuePerimetralCell == 2) {
                discoverCell((x - 1), (y - 1));
            }
        }
    }
}

function increaseTime() {
    ++timeSeconds;
    if (timeSeconds == 60) {
        ++timeMinutes;
        timeSeconds = 0;
    }
    if (timeSeconds < 10 && timeMinutes < 10) {
        document.getElementById('timer').innerHTML= '0' + timeMinutes + ':' + '0' + timeSeconds;
    } else if (timeSeconds < 10) {
        document.getElementById('timer').innerHTML= timeMinutes + ':' + '0' + timeSeconds;
    } else if (timeMinutes < 10) {
        document.getElementById('timer').innerHTML= '0' + timeMinutes + ':' + timeSeconds;
    } else {
        document.getElementById('timer').innerHTML= timeMinutes + ':' + timeSeconds;
    }
}


function stopGame(result) {
    for (let i = 0; i < boardDimension; ++i) {
        for (let j = 0; j < boardDimension; ++j) {
            document.getElementById('button' + i + j).removeAttribute('onclick');
            if (document.getElementById('cell' + i + j).dataset.value == -1) {
                discoverCell(i, j);
            }
        }
    }
    document.getElementById('resultButton').innerHTML = result;
    clearInterval(timeCounter);
}

function restartGame() {
    resetGame();
    startGame();
}

function changeDimension() {
    resetGame();
    displaySection('startContainer', '');
    displaySection('gameCard', 'none');
    document.getElementById('inputDimension').value= "";
}

function resetGame() {
    for (let i = 0; i < boardDimension; ++i) {
        document.getElementById('row'+i).remove();
    }
    clearInterval(timeCounter);
    timeCounter = null;
    timeMinutes = 0;
    timeSeconds = 0;
    discoveredCells = 0;
}
document.addEventListener('DOMContentLoaded', ()=> {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const submarine = document.querySelector('.submarine-container');
    const cruiser = document.querySelector('.cruiser-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');
    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turndisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');
    const userSquares = [];
    const computerSquares = [];
    let isHorizontal = true;
    const width = 10;
    let isGameOver = false;
    let currentPlayer = 'user';

    //Create board
    function createBoard(grid, squares) {
        for (let i = 0; i < width*width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard(userGrid, userSquares);
    createBoard(computerGrid, computerSquares);

    //Ships
    const shipsArray = [
        {
            name: 'destroyer',
            directions: [
             [0, 1],
             [0, width],
            ]
        },
        {   
            name: 'submarine',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {   
            name: 'cruiser',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {   
            name: 'battleship',
            directions: [
                [0, 1, 2, 3],
                [0, width, width*2, width*3]
            ]
        },
        {   
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4],
                [0, width, width*2, width*3, width*4]
            ]
        }
    ];

    //Draw the computer ships in random locations
    function generate(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection];
        if(randomDirection === 0) direction = 1;
        if(randomDirection === 1) direction = 10;
        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)));

        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);

        if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))
        else generate(ship);
    }

    generate(shipsArray[0]);
    generate(shipsArray[1]);
    generate(shipsArray[2]);
    generate(shipsArray[3]);
    generate(shipsArray[4]);

    //rotate sips
    function rotate() {
        if (isHorizontal) {
            destroyer.classList.remove('destroyer-container');
            submarine.classList.remove('submarine-container');
            cruiser.classList.remove('cruiser-container');
            battleship.classList.remove('battleship-container');
            carrier.classList.remove('carrier-container');
            destroyer.classList.add('destroyer-container-vertical');
            submarine.classList.add('submarine-container-vertical');
            cruiser.classList.add('cruiser-container-vertical');
            battleship.classList.add('battleship-container-vertical');
            carrier.classList.add('carrier-container-vertical');
            isHorizontal = false;
            return;
        }
        if (!isHorizontal) {
            destroyer.classList.add('destroyer-container');
            submarine.classList.add('submarine-container');
            cruiser.classList.add('cruiser-container');
            battleship.classList.add('battleship-container');
            carrier.classList.add('carrier-container');
            destroyer.classList.remove('destroyer-container-vertical');
            submarine.classList.remove('submarine-container-vertical');
            cruiser.classList.remove('cruiser-container-vertical');
            battleship.classList.remove('battleship-container-vertical');
            carrier.classList.remove('carrier-container-vertical');
            isHorizontal = true;
            return;
        }
    }

    rotateButton.addEventListener('click', rotate);

    //move around user ship
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
    userSquares.forEach(square => addEventListener('dragStart', dragStart))
    userSquares.forEach(square => addEventListener('dragover', dragOver))
    userSquares.forEach(square => addEventListener('dragenter', dragEnter))
    userSquares.forEach(square => addEventListener('dragleave', dragLeave))
    userSquares.forEach(square => addEventListener('drop', dragDrop))
    userSquares.forEach(square => addEventListener('dragend', dragEnd))

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id;
        console.log(selectedShipNameWithIndex);
    }))

    function dragStart() {
        draggedShip = this;
        draggedShipLength = this.childNodes.length;        
        console.log(draggedShip)
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {

    }

    function dragDrop(e) {
        let shipNameWithLastId = draggedShip.lastChild.id;        
        let shipClass = shipNameWithLastId.slice(0,-2);
        console.log(shipClass);
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
        let shipLastId = lastShipIndex + parseInt(e.target.dataset.id);       
        const notAllowedHorizontal = [0,10,20,30,40,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,12,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]; //you can drop ships in 99 square even if they stick out of the grid
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);
        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));        

        shipLastId = shipLastId - selectedShipIndex;
        


        if(isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i=0; i < draggedShipLength; i++) {
                userSquares[parseInt(e.target.dataset.id) - selectedShipIndex +i].classList.add('taken', shipClass);
            }
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i=0; i < draggedShipLength; i++) {
                userSquares[parseInt(e.target.dataset.id) - selectedShipIndex*width +i*width].classList.add('taken', shipClass);
            }
        } else return;

        displayGrid.removeChild(draggedShip);
    }

    function dragEnd() {
        console.log('dragend')
    }

    //Game Logic

    function playGame() {
        if (isGameOver) return;
        if (currentPlayer === 'user') {
            turndisplay.innerHTML = 'Your go';
            computerSquares.forEach(square => square.addEventListener('click', function(e) {
                revealSquare(square);
            }))
        }
        if (currentPlayer === 'computer') {
            turndisplay.innerHTML = 'Computers go';
            //computer go
        }
    }

    startButton.addEventListener('click', playGame);

    let destroyerCount = 0;
    let submarineCount = 0;
    let cruiserCount = 0;
    let battleshipCount = 0;
    let carrierCount = 0;

    function revealSquare(square) {
        if (square.classList.contains('destroyer')) destroyerCount++;         
        if (square.classList.contains('submarine')) submarineCount++;
        if (square.classList.contains('cruiser')) cruiserCount++;
        if (square.classList.contains('battleship')) battleshipCount++;
        if (square.classList.contains('carrier')) carrierCount++;

        if (square.classList.contains('taken')) {
            square.classList.add('boom');
        } else {
            square.classList.add('miss')
        }
    }

})
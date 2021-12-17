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
})
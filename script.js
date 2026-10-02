// ==========================================
// MAZE SETTINGS
// ==========================================

const ROWS = 20;
const COLS = 20;

let grid = [];

let start = {
    row: 0,
    col: 0
};

let end = {
    row: ROWS - 1,
    col: COLS - 1
};

let solving = false;


// ==========================================
// ALGORITHM INFORMATION
// ==========================================

const algorithmInfo = {

    bfs: `
        <strong>BFS:</strong>
        Explores the maze level by level.
        It guarantees the shortest path in an
        unweighted maze.
        Time Complexity: O(V + E)
    `,

    dfs: `
        <strong>DFS:</strong>
        Explores as far as possible before
        backtracking.
        It does not always produce the shortest path.
        Time Complexity: O(V + E)
    `,

    dijkstra: `
        <strong>Dijkstra:</strong>
        Finds the shortest path using the minimum
        distance node.
        Time Complexity: O(V²)
    `,

    astar: `
        <strong>A*:</strong>
        Uses distance and heuristic information
        to efficiently search for the shortest path.
        Time Complexity: O(V log V)
    `
};


// ==========================================
// CREATE MAZE
// ==========================================

function createMaze() {

    grid = [];

    const maze =
        document.getElementById("maze");

    maze.innerHTML = "";


    for (let r = 0; r < ROWS; r++) {

        grid[r] = [];

        for (let c = 0; c < COLS; c++) {

            const cell = {
                row: r,
                col: c,
                wall: false
            };

            grid[r][c] = cell;


            const element =
                document.createElement("div");

            element.className = "cell";

            element.id =
                `cell-${r}-${c}`;


            // Click to create wall
            element.addEventListener(
                "click",
                () => toggleWall(r, c)
            );


            maze.appendChild(element);
        }
    }


    updateSpecialCells();
}


// ==========================================
// UPDATE START AND END
// ==========================================

function updateSpecialCells() {

    const startElement =
        document.getElementById(
            `cell-${start.row}-${start.col}`
        );

    const endElement =
        document.getElementById(
            `cell-${end.row}-${end.col}`
        );


    startElement.classList.add("start");

    endElement.classList.add("end");
}


// ==========================================
// TOGGLE WALL
// ==========================================

function toggleWall(row, col) {

    if (solving) {
        return;
    }


    if (
        (row === start.row &&
            col === start.col) ||

        (row === end.row &&
            col === end.col)
    ) {
        return;
    }


    grid[row][col].wall =
        !grid[row][col].wall;


    const element =
        document.getElementById(
            `cell-${row}-${col}`
        );


    element.classList.toggle("wall");
}


// ==========================================
// RANDOM MAZE
// ==========================================

function generateMaze() {

    if (solving) {
        return;
    }


    // Clear first
    createMaze();


    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            // Keep start and end clear
            if (
                (r === start.row &&
                    c === start.col) ||

                (r === end.row &&
                    c === end.col)
            ) {
                continue;
            }


            // Random walls
            if (Math.random() < 0.28) {

                grid[r][c].wall = true;

                document
                    .getElementById(
                        `cell-${r}-${c}`
                    )
                    .classList.add("wall");
            }
        }
    }


    // Make sure some direct route remains
    for (let c = 0; c < COLS; c++) {

        grid[0][c].wall = false;

        document
            .getElementById(`cell-0-${c}`)
            .classList.remove("wall");
    }


    for (let r = 0; r < ROWS; r++) {

        grid[r][COLS - 1].wall = false;

        document
            .getElementById(
                `cell-${r}-${COLS - 1}`
            )
            .classList.remove("wall");
    }


    setStatus(
        "Random maze generated.",
        "black"
    );
}


// ==========================================
// GET NEIGHBORS
// ==========================================

function getNeighbors(node) {

    const directions = [

        [-1, 0],

        [1, 0],

        [0, -1],

        [0, 1]

    ];


    const neighbors = [];


    for (const [dr, dc] of directions) {

        const nr = node.row + dr;

        const nc = node.col + dc;


        if (
            nr >= 0 &&
            nr < ROWS &&
            nc >= 0 &&
            nc < COLS
        ) {

            if (!grid[nr][nc].wall) {

                neighbors.push(
                    grid[nr][nc]
                );
            }
        }
    }


    return neighbors;
}


// ==========================================
// DELAY
// ==========================================

function sleep(ms) {

    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}


// ==========================================
// VISIT CELL
// ==========================================

async function visit(node) {

    if (
        !(node.row === start.row &&
            node.col === start.col) &&

        !(node.row === end.row &&
            node.col === end.col)
    ) {

        const element =
            document.getElementById(
                `cell-${node.row}-${node.col}`
            );

        element.classList.add("visited");

        await sleep(20);
    }
}


// ==========================================
// BFS
// ==========================================

async function bfs() {

    const queue = [grid[start.row][start.col]];

    const visited = new Set();

    const parent = new Map();


    visited.add(
        `${start.row},${start.col}`
    );


    while (queue.length > 0) {

        const current =
            queue.shift();


        if (
            current.row === end.row &&
            current.col === end.col
        ) {

            return parent;
        }


        await visit(current);


        for (
            const neighbor
            of getNeighbors(current)
        ) {

            const key =
                `${neighbor.row},${neighbor.col}`;


            if (!visited.has(key)) {

                visited.add(key);

                parent.set(
                    key,
                    current
                );

                queue.push(neighbor);
            }
        }
    }


    return null;
}


// ==========================================
// DFS
// ==========================================

async function dfs() {

    const stack = [
        grid[start.row][start.col]
    ];

    const visited = new Set();

    const parent = new Map();


    visited.add(
        `${start.row},${start.col}`
    );


    while (stack.length > 0) {

        const current =
            stack.pop();


        if (
            current.row === end.row &&
            current.col === end.col
        ) {

            return parent;
        }


        await visit(current);


        for (
            const neighbor
            of getNeighbors(current)
        ) {

            const key =
                `${neighbor.row},${neighbor.col}`;


            if (!visited.has(key)) {

                visited.add(key);

                parent.set(
                    key,
                    current
                );

                stack.push(neighbor);
            }
        }
    }


    return null;
}


// ==========================================
// DIJKSTRA
// ==========================================

async function dijkstra() {

    const distances = {};

    const parent = new Map();

    const visited = new Set();

    const nodes = [];


    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            const key = `${r},${c}`;

            distances[key] = Infinity;

            nodes.push(grid[r][c]);
        }
    }


    const startKey =
        `${start.row},${start.col}`;


    distances[startKey] = 0;


    while (nodes.length > 0) {

        nodes.sort(
            (a, b) =>
                distances[
                    `${a.row},${a.col}`
                ]
                -
                distances[
                    `${b.row},${b.col}`
                ]
        );


        const current =
            nodes.shift();


        const currentKey =
            `${current.row},${current.col}`;


        if (
            distances[currentKey] === Infinity
        ) {
            break;
        }


        if (visited.has(currentKey)) {
            continue;
        }


        visited.add(currentKey);


        if (
            current.row === end.row &&
            current.col === end.col
        ) {

            return parent;
        }


        await visit(current);


        for (
            const neighbor
            of getNeighbors(current)
        ) {

            const key =
                `${neighbor.row},${neighbor.col}`;


            if (visited.has(key)) {
                continue;
            }


            const newDistance =
                distances[currentKey] + 1;


            if (
                newDistance <
                distances[key]
            ) {

                distances[key] =
                    newDistance;

                parent.set(
                    key,
                    current
                );
            }
        }
    }


    return null;
}


// ==========================================
// A* ALGORITHM
// ==========================================

async function aStar() {

    const openSet = [];

    const parent = new Map();

    const gScore = {};

    const fScore = {};


    for (let r = 0; r < ROWS; r++) {

        for (let c = 0; c < COLS; c++) {

            const key = `${r},${c}`;

            gScore[key] = Infinity;

            fScore[key] = Infinity;
        }
    }


    const startKey =
        `${start.row},${start.col}`;


    gScore[startKey] = 0;

    fScore[startKey] =
        heuristic(start, end);


    openSet.push(
        grid[start.row][start.col]
    );


    const closedSet = new Set();


    while (openSet.length > 0) {

        openSet.sort(
            (a, b) =>
                fScore[
                    `${a.row},${a.col}`
                ]
                -
                fScore[
                    `${b.row},${b.col}`
                ]
        );


        const current =
            openSet.shift();


        const currentKey =
            `${current.row},${current.col}`;


        if (closedSet.has(currentKey)) {
            continue;
        }


        closedSet.add(currentKey);


        if (
            current.row === end.row &&
            current.col === end.col
        ) {

            return parent;
        }


        await visit(current);


        for (
            const neighbor
            of getNeighbors(current)
        ) {

            const key =
                `${neighbor.row},${neighbor.col}`;


            if (closedSet.has(key)) {
                continue;
            }


            const tentativeG =
                gScore[currentKey] + 1;


            if (
                tentativeG <
                gScore[key]
            ) {

                parent.set(
                    key,
                    current
                );

                gScore[key] =
                    tentativeG;

                fScore[key] =
                    tentativeG +
                    heuristic(
                        neighbor,
                        end
                    );


                openSet.push(neighbor);
            }
        }
    }


    return null;
}


// ==========================================
// MANHATTAN DISTANCE
// ==========================================

function heuristic(a, b) {

    return Math.abs(
        a.row - b.row
    )
    +
    Math.abs(
        a.col - b.col
    );
}


// ==========================================
// DRAW PATH
// ==========================================

async function drawPath(parent) {

    if (!parent) {
        return false;
    }


    let current =
        grid[end.row][end.col];


    const startKey =
        `${start.row},${start.col}`;


    while (
        `${current.row},${current.col}`
        !== startKey
    ) {

        const key =
            `${current.row},${current.col}`;


        const previous =
            parent.get(key);


        if (!previous) {

            return false;
        }


        const element =
            document.getElementById(
                `cell-${current.row}-${current.col}`
            );


        element.classList.remove("visited");

        element.classList.add("path");


        await sleep(40);


        current = previous;
    }


    return true;
}


// ==========================================
// CLEAR PREVIOUS SOLUTION
// ==========================================

function clearVisited() {

    document
        .querySelectorAll(".visited, .path")
        .forEach(cell => {

            cell.classList.remove(
                "visited",
                "path"
            );
        });
}


// ==========================================
// SOLVE MAZE
// ==========================================

async function solveMaze() {

    if (solving) {
        return;
    }


    solving = true;


    clearVisited();


    const selectedAlgorithm =
        document.getElementById(
            "algorithm"
        ).value;


    document.getElementById(
        "algorithmInfo"
    ).innerHTML =
        algorithmInfo[selectedAlgorithm];


    setStatus(
        "Solving maze...",
        "#007bff"
    );


    let parent = null;


    if (selectedAlgorithm === "bfs") {

        parent = await bfs();

    }
    else if (selectedAlgorithm === "dfs") {

        parent = await dfs();

    }
    else if (selectedAlgorithm === "dijkstra") {

        parent = await dijkstra();

    }
    else if (selectedAlgorithm === "astar") {

        parent = await aStar();
    }


    const pathFound =
        await drawPath(parent);


    if (pathFound) {

        setStatus(
            "✅ Path found successfully!",
            "green"
        );

    } else {

        setStatus(
            "❌ No path exists!",
            "red"
        );
    }


    solving = false;
}


// ==========================================
// CLEAR MAZE
// ==========================================

function clearMaze() {

    if (solving) {
        return;
    }


    createMaze();


    setStatus(
        "Maze cleared.",
        "black"
    );


    document.getElementById(
        "algorithmInfo"
    ).innerHTML =
        "Select an algorithm and solve the maze.";
}


// ==========================================
// STATUS MESSAGE
// ==========================================

function setStatus(message, color) {

    const status =
        document.getElementById("status");


    status.textContent = message;

    status.style.color = color;
}


// ==========================================
// INITIALIZE
// ==========================================

createMaze();

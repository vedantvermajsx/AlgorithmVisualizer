
export const numRows = Math.floor((window.innerHeight * 0.8) / 22)-4;

export const numCols = Math.floor(document.documentElement.clientWidth / 22) - 4;

export function createCell(row, col) {
    return {
        row,
        col,
        isStart: false,
        isEnd: false,
        isWall: false,
        visited: false,
        distance: Infinity,
        previous: null,
        neighbors: [],
        f: Infinity,
        g: Infinity,
        h: 0,
    };
}

export function setStartNode(cell, div) {
    cell.isStart = true;
    div.classList.add('start');
}

export function setEndNode(cell, div) {
    cell.isEnd = true;
    div.classList.add('end');
}

export function toggleWall(cell, div) {
    cell.isWall = !cell.isWall;
    div.classList.toggle('wall', cell.isWall);
}

export function handleCellDrag(div, cell) {
    if (!cell.isStart && !cell.isEnd && !cell.isWall) {
        cell.isWall = true;
        div.classList.add('wall');
    }
}

export function createCellDiv(cell, gridContainer, isRunning, isMouseDown, handleCellClick) {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.dataset.row = cell.row;
    div.dataset.col = cell.col;
    div.addEventListener("click", () => !isRunning() && handleCellClick(div, cell));
    div.addEventListener(
        "mousemove",
        () => !isRunning() && isMouseDown() && handleCellDrag(div, cell)
    );
    return div;
}

export function assignNeighbors(grid, numRows, numCols) {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const node = grid[row][col];

            if (row > 0) node.neighbors.push(grid[row - 1][col]); 
            if (row < numRows - 1) node.neighbors.push(grid[row + 1][col]); 
            if (col > 0) node.neighbors.push(grid[row][col - 1]); 
            if (col < numCols - 1) node.neighbors.push(grid[row][col + 1]);             

            if (row > 0 && col > 0) node.neighbors.push(grid[row - 1][col - 1]); 
            if (row > 0 && col < numCols - 1) node.neighbors.push(grid[row - 1][col + 1]); 
            if (row < numRows - 1 && col > 0) node.neighbors.push(grid[row + 1][col - 1]); 
            if (row < numRows - 1 && col < numCols - 1) node.neighbors.push(grid[row + 1][col + 1]); 
        }
    }
}

export function reconstructPath(endNode, startNode, debugText, isRunningFn) {
    const finalNodes = [];
    let curr = endNode.previous;

    while (curr !== startNode && curr !== null) {
        finalNodes.unshift(curr);
        curr = curr.previous;
    }

    finalNodes.unshift(startNode);
    finalNodes.push(endNode);

    finalNodes.forEach((node, index) => {
        setTimeout(() => {
            if (isRunningFn && !isRunningFn()) return;
            const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
            if (nodeDiv) {
                nodeDiv.classList.add("path");
                nodeDiv.style.transition = "background-color 0.4s ease, transform 0.4s ease";
                nodeDiv.style.backgroundColor = "rgba(0, 0, 255, 0.9)";
                
                if (node !== startNode && node !== endNode) {
                    nodeDiv.style.transform = "scale(1.25)";
                    setTimeout(() => {
                        nodeDiv.style.transform = "scale(1)";
                    }, 400);
                }
            }
        }, index * 20); // Faster draw
    });

    if (debugText) debugText.innerText = `Shortest Path rendered!`;
}

export function markAsHead(node) {

    if (node.isStart || node.isEnd) return;
    const cellDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
    if (cellDiv) {
        cellDiv.classList.add("head");
    }
}

export function markAsVisited(node) {
    if (node.isStart || node.isEnd) return;
    const cellDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
    if (cellDiv) {
        cellDiv.classList.remove("head"); 
        cellDiv.classList.add("visited");
    }
}

export function generateMaze(numRows, numCols, grid) {

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = grid[row][col];
            if (!cell.isStart && !cell.isEnd) {
                cell.isWall = true;
                const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cellDiv) cellDiv.classList.add('wall');
            }
        }
    }

    const carve = (row, col) => {
        const cell = grid[row][col];
        if (!cell.isStart && !cell.isEnd) {
            cell.isWall = false;
            const cellDiv = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cellDiv) cellDiv.classList.remove('wall', 'visited', 'path');
        }
    };

    const visited = Array.from({length: numRows}, () => Array(numCols).fill(false));

    const isValid = (r, c) => r > 0 && r < numRows - 1 && c > 0 && c < numCols - 1 && !visited[r][c];

    const dfs = (r, c) => {
        visited[r][c] = true;
        carve(r, c);

        const dirs = [ [-2, 0], [2, 0], [0, -2], [0, 2] ];

        for (let i = dirs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
        }

        for (let [dr, dc] of dirs) {
            const nr = r + dr;
            const nc = c + dc;
            if (isValid(nr, nc)) {
                carve(r + dr/2, c + dc/2); 
                dfs(nr, nc);               
            }
        }
    };

    dfs(1, 1);

    grid.forEach(row => row.forEach(cell => {
        if (cell.isStart || cell.isEnd) {

            cell.neighbors.forEach(n => {
                if (Math.abs(n.row - cell.row) + Math.abs(n.col - cell.col) === 1) {
                    carve(n.row, n.col);
                }
            });
        }
    }));
}


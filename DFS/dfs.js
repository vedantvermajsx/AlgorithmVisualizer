import * as GridModule from "../modules/gridmodule.js";
import { ModulegenerateMaze } from "../modules/generatemaze.js";

const numRows = GridModule.numRows;
const numCols = GridModule.numCols;
let grid = [];
let startNode = null;
let endNode = null;
let stack = [];
let isMouseDown = false;
let isRunning = false;

const gridContainer = document.getElementById("grid-container");
const startButton = document.getElementById("start-automatic");
const resetButton = document.querySelectorAll(".controls .btn")[1]; 
const generateButton = document.querySelectorAll(".controls .btn")[2]; 
const debugText = document.getElementById("debug-text");

gridContainer.addEventListener("mousedown", () => (isMouseDown = true));
gridContainer.addEventListener("mouseup", () => (isMouseDown = false));
gridContainer.addEventListener("mouseleave", () => (isMouseDown = false));

startButton.addEventListener("click", startDFS);
resetButton.addEventListener("click", resetGrid);
generateButton.addEventListener("click", () => {
    ModulegenerateMaze(numRows, numCols, grid);
    debugText.innerText = "Random maze generated!";
});

function createGrid() {
    gridContainer.innerHTML = "";
    grid = [];
    gridContainer.style.gridTemplateColumns = `repeat(${numCols}, 18px)`;
    gridContainer.style.gridTemplateRows = `repeat(${numRows}, 18px)`;

    for (let row = 0; row < numRows; row++) {
        let gridRow = [];
        for (let col = 0; col < numCols; col++) {
            const cell = GridModule.createCell(row, col);
            gridRow.push(cell);
            const div = GridModule.createCellDiv(
                cell, 
                gridContainer, 
                () => isRunning, 
                () => isMouseDown, 
                handleCellClick
            );
            gridContainer.appendChild(div);
        }
        grid.push(gridRow);
    }
    GridModule.assignNeighbors(grid, numRows, numCols);
}

function handleCellClick(div, cell) {
    if (!startNode) {
        startNode = cell;
        GridModule.setStartNode(cell, div);
    } else if (!endNode) {
        endNode = cell;
        GridModule.setEndNode(cell, div);
    } else if (!cell.isStart && !cell.isEnd) {
        GridModule.toggleWall(cell, div);
    }
}

function resetGrid() {
    createGrid();
    isRunning = false;
    startNode = null;
    endNode = null;
    stack = [];
    startButton.disabled = false;
    debugText.innerText = 'Click "Start" to begin.';
}

async function startDFS() {
    if (!startNode || !endNode) {
        alert("Please select both start and end nodes.");
        return;
    }

    isRunning = true;
    stack = [startNode];
    startNode.visited = true;

    startButton.disabled = true;
    debugText.innerText = "DFS Algorithm started...";

    while (stack.length > 0) {
        if (!isRunning) return;
        const current = stack.pop();

        if (current === endNode) {
            GridModule.reconstructPath(endNode, startNode, debugText, () => isRunning);
            return;
        }

        updateNeighbors(current);
        GridModule.markAsVisited(current);
        debugText.innerText = `Visiting node at (${current.row}, ${current.col})`;

        await new Promise((resolve) => setTimeout(resolve, 48));
    }

    debugText.innerText = "No path found.";
    isRunning = false;
}

function updateNeighbors(current) {
    current.neighbors.forEach((neighbor) => {
        if (!neighbor.visited && !neighbor.isWall) {
            neighbor.visited = true;
            neighbor.previous = current;
            GridModule.markAsHead(neighbor);
            stack.push(neighbor);
        }
    });
}

createGrid();


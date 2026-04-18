import * as GridModule from "../modules/gridmodule.js";
import { ModulegenerateMaze } from "../modules/generatemaze.js";

const numRows = GridModule.numRows;
const numCols = GridModule.numCols;
let grid = [];
let startNode = null;
let endNode = null;
let queue = [];
let isMouseDown = false;
let isRunning = false;
let isSearching = false;

const gridContainer = document.getElementById("grid-container");
const startButton = document.getElementById("automatic");
const resetButton = document.getElementById("reset");
const generateButton = document.getElementById("generate");
const debugText = document.getElementById("debug-text");

gridContainer.addEventListener("mousedown", () => (isMouseDown = true));
gridContainer.addEventListener("mouseup", () => (isMouseDown = false));
gridContainer.addEventListener("mouseleave", () => (isMouseDown = false));
startButton.addEventListener("click", startBFS);
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
    isSearching = false;
    startNode = null;
    endNode = null;
    queue = [];
    startButton.disabled = false;
    debugText.innerText = 'Click "Start" to begin.';
}

async function startBFS() {
    if (!startNode || !endNode) {
        alert("Please select both start and end nodes.");
        return;
    }

    isRunning = true;
    isSearching = true;
    startNode.visited = true;
    startNode.distance = 0;

    startButton.disabled = true;
    debugText.innerText = "BFS Parallel Algorithm started...";

    // Start the first worker
    spawnWorker(startNode);
}

function spawnWorker(current) {
    if (!isRunning || !isSearching) return; // Halt if search is finished or cancelled

    if (current === endNode) {
        isSearching = false; // Signal all other workers to stop
        GridModule.reconstructPath(endNode, startNode, debugText, () => isRunning);
        return;
    }

    // Process nodes with a slight distributed delay
    setTimeout(() => {
        if (!isRunning || !isSearching) return;
        
        debugText.innerText = `Workers actively exploring...`;

        current.neighbors.forEach((neighbor) => {
            if (!neighbor.isWall) {
                let alt = current.distance + 1;
                if (alt < neighbor.distance) {
                    neighbor.distance = alt;
                    neighbor.previous = current;
                    if (!neighbor.visited) {
                        neighbor.visited = true;
                        GridModule.markAsHead(neighbor);
                        // Spawn an independent worker for this neighbor!
                        spawnWorker(neighbor);
                    }
                }
            }
        });
        
        GridModule.markAsVisited(current);
    }, 48);
}

createGrid();


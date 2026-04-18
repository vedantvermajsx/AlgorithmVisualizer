import * as GridModule from "../modules/gridmodule.js";
import { ModulegenerateMaze } from "../modules/generatemaze.js";

const numRows = GridModule.numRows;
const numCols = GridModule.numCols;
let grid = [];
let startNode = null;
let endNode = null;
let openSet = [];
let closedSet = [];
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
startButton.addEventListener("click", startAStar);
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
    openSet = [];
    closedSet = [];
    startButton.disabled = false;
    debugText.innerText = 'Click "Start" to begin.';
}

function heuristic(a, b) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

async function startAStar() {
    if (!startNode || !endNode) {
        alert("Please select both start and end nodes.");
        return;
    }

    isRunning = true;
    isSearching = true;
    startNode.g = 0;
    startNode.f = heuristic(startNode, endNode);
    startNode.visited = true;

    startButton.disabled = true;
    debugText.innerText = "A* Algorithm started...";

    spawnWorker(startNode);
}

function spawnWorker(current) {
    if (!isRunning || !isSearching) return;

    if (current === endNode) {
        isSearching = false;
        GridModule.reconstructPath(endNode, startNode, debugText, () => isRunning);
        return;
    }

    // Delay varies slightly by heuristic to give A* its "directed" organic feel
    const delay = 30 + (current.h * 1.5); 

    setTimeout(() => {
        if (!isRunning || !isSearching) return;
        
        debugText.innerText = `Workers actively exploring (A*)...`;

        current.neighbors.forEach((neighbor) => {
            if (!neighbor.isWall) {
                const tempG = current.g + 1;
                if (tempG < neighbor.g) {
                    neighbor.previous = current;
                    neighbor.g = tempG;
                    neighbor.h = heuristic(neighbor, endNode);
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!neighbor.visited) {
                        neighbor.visited = true;
                        GridModule.markAsHead(neighbor);
                        spawnWorker(neighbor);
                    }
                }
            }
        });

        GridModule.markAsVisited(current);
    }, delay);
}

createGrid();


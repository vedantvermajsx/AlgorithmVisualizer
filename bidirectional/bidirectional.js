import * as GridModule from "../modules/gridmodule.js";
import { ModulegenerateMaze } from "../modules/generatemaze.js";

const numRows = GridModule.numRows;
const numCols = GridModule.numCols;
let grid = [];
let startNode = null;
let endNode = null;
let isMouseDown = false;
let isRunning = false;
let isSearching = false;

const gridContainer = document.getElementById("grid-container");
const startButton = document.getElementById("start-automatic");
const resetButton = document.querySelectorAll(".controls .btn")[1];
const generateButton = document.querySelectorAll(".controls .btn")[2];
const debugText = document.getElementById("debug-text");

gridContainer.addEventListener("mousedown", () => (isMouseDown = true));
gridContainer.addEventListener("mouseup", () => (isMouseDown = false));
gridContainer.addEventListener("mouseleave", () => (isMouseDown = false));

startButton.addEventListener("click", startBidirectional);
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

      cell.distanceFromStart = Infinity;
      cell.distanceFromEnd = Infinity;
      cell.previousFromStart = null;
      cell.previousFromEnd = null;
      
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
  startButton.disabled = false;
  debugText.innerText = 'Click "Start" to begin.';
}

async function startBidirectional() {
  if (!startNode || !endNode) {
    alert("Please select both start and end nodes.");
    return;
  }

  isRunning = true;
  isSearching = true;
  startButton.disabled = true;
  debugText.innerText = "Bidirectional Dijkstra started...";

  startNode.distanceFromStart = 0;
  endNode.distanceFromEnd = 0;

  const visitedFromStart = new Set();
  const visitedFromEnd = new Set();

  spawnWorker(startNode, visitedFromStart, visitedFromEnd, true);
  spawnWorker(endNode, visitedFromEnd, visitedFromStart, false);
}

function spawnWorker(current, myVisited, otherVisited, fromStart) {
  if (!isRunning || !isSearching) return;
  myVisited.add(current);

  if (otherVisited.has(current)) {
    isSearching = false;
    reconstructPathFromMeetingPoint(current, () => isRunning);
    return;
  }

  setTimeout(() => {
    if (!isRunning || !isSearching) return;

    current.neighbors.forEach((neighbor) => {
      if (!neighbor.isWall) {
        let newDistance = (fromStart ? current.distanceFromStart : current.distanceFromEnd) + 1;
        
        if (fromStart) {
          if (newDistance < neighbor.distanceFromStart) {
            neighbor.distanceFromStart = newDistance;
            neighbor.previousFromStart = current;
            if (!myVisited.has(neighbor)) {
              myVisited.add(neighbor);
              GridModule.markAsHead(neighbor);
              spawnWorker(neighbor, myVisited, otherVisited, fromStart);
            }
          }
        } else {
          if (newDistance < neighbor.distanceFromEnd) {
            neighbor.distanceFromEnd = newDistance;
            neighbor.previousFromEnd = current;
            if (!myVisited.has(neighbor)) {
              myVisited.add(neighbor);
              GridModule.markAsHead(neighbor);
              spawnWorker(neighbor, myVisited, otherVisited, fromStart);
            }
          }
        }
      }
    });

    GridModule.markAsVisited(current);
  }, 48);
}

function reconstructPathFromMeetingPoint(meetingPoint, isRunningFn) {
  const pathNodes = [];

  let curr = meetingPoint.previousFromStart;
  while (curr !== null && curr !== startNode) {
    pathNodes.unshift(curr);
    curr = curr.previousFromStart;
  }
  if (startNode) pathNodes.unshift(startNode);

  pathNodes.push(meetingPoint);

  curr = meetingPoint.previousFromEnd;
  while (curr !== null && curr !== endNode) {
    pathNodes.push(curr);
    curr = curr.previousFromEnd;
  }
  if (endNode) pathNodes.push(endNode);

  pathNodes.forEach((node, index) => {
    setTimeout(() => {
      if (isRunningFn && !isRunningFn()) return;
      const nodeDiv = document.querySelector(`[data-row="${node.row}"][data-col="${node.col}"]`);
      if (nodeDiv) {
        nodeDiv.classList.add("path");
        nodeDiv.style.transition = "background-color 0.4s ease, transform 0.4s ease";
        nodeDiv.style.backgroundColor = "rgba(0, 0, 255, 0.9)";
        nodeDiv.style.transform = "scale(1.25)";
        setTimeout(() => {
          nodeDiv.style.transform = "scale(1)";
        }, 400);
      }
    }, index * 40);
  });

  debugText.innerText = "Shortest Path found!";
}

createGrid();


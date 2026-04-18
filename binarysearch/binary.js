let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const SizeInput = document.getElementById("Size");
const targetInput = document.getElementById("target-val");
const stepButton = document.getElementById("step-button");

let Size = 0;
let target = -1;
let left = 0, right = 0, mid = -1;
let isSearching = false;
let isManual = false;

function highlightCodeLine(line) {
    document.querySelectorAll("#algorithm-code span").forEach((codeLine) => codeLine.classList.remove("highlight"));
    const lineElement = document.getElementById(`code-line-${line}`);
    if (lineElement) lineElement.classList.add("highlight");
}

function resetHighlights() {
    Array.from(arrayContainer.children).forEach((bar) => {
        bar.classList.remove("active", "comparing", "sorted", "found", "left-bound", "right-bound");
    });
}

function GetSize() {
    Size = parseInt(SizeInput.value);
    SizeInput.value = '';
    if (!Size || Size > 50) {
        updateDebugText("Please enter a valid size (max 50).");
        return;
    }
    generateArray();
}

function generateArray() {
    array = Array.from({ length: Size || 20 }, () => Math.floor(Math.random() * 100) + 10);
    array.sort((a, b) => a - b);
    renderArray();
    updateDebugText("Sorted array generated. Ready for searching.");
}

function renderArray() {
    const adjustedMax = Math.max(...array);
    const bars = arrayContainer.children;
    if (bars.length !== array.length) {
        arrayContainer.innerHTML = "";
        array.forEach((value) => {
            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${(value / adjustedMax) * 100}%`;
            arrayContainer.appendChild(bar);
        });
    } else {
        array.forEach((value, index) => {
            bars[index].style.height = `${(value / adjustedMax) * 100}%`;
        });
    }
}

function updateDebugText(message) {
    debugText.innerText = message;
}

async function startAutoSearch() {
    target = parseInt(targetInput.value);
    if (isNaN(target)) {
        alert("Please enter a target value.");
        return;
    }
    isSearching = true;
    isManual = false;
    stepButton.disabled = true;
    
    left = 0;
    right = array.length - 1;
    highlightCodeLine(2);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    while (left <= right) {
        highlightCodeLine(3);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        mid = Math.floor((left + right) / 2);
        highlightCodeLine(4);
        
        resetHighlights();
        const bars = arrayContainer.children;
        for(let i=left; i<=right; i++) if(bars[i]) bars[i].classList.add("comparing");
        if(bars[left]) bars[left].classList.add("left-bound");
        if(bars[right]) bars[right].classList.add("right-bound");
        if(bars[mid]) bars[mid].classList.add("active");
        
        updateDebugText(`Checking middle element at index ${mid} (value: ${array[mid]})`);
        await new Promise(resolve => setTimeout(resolve, 600));

        if (array[mid] === target) {
            highlightCodeLine(5);
            resetHighlights();
            if(bars[mid]) bars[mid].classList.add("found");
            updateDebugText(`Found ${target} at index ${mid}!`);
            isSearching = false;
            return;
        }
        
        if (array[mid] < target) {
            highlightCodeLine(6);
            left = mid + 1;
            updateDebugText(`${target} is greater than ${array[mid]}. Moving left boundary to ${left}.`);
        } else {
            highlightCodeLine(7);
            right = mid - 1;
            updateDebugText(`${target} is less than ${array[mid]}. Moving right boundary to ${right}.`);
        }
        await new Promise(resolve => setTimeout(resolve, 600));
    }
    highlightCodeLine(9);
    updateDebugText(`${target} not found in the array.`);
    isSearching = false;
}

function startManualSearch() {
    target = parseInt(targetInput.value);
    if (isNaN(target)) {
        alert("Please enter a target value.");
        return;
    }
    isSearching = true;
    isManual = true;
    stepButton.disabled = false;
    left = 0;
    right = array.length - 1;
    updateDebugText("Manual search started. Click 'Step' to proceed.");
    highlightCodeLine(2);
}

async function nextStep() {
    if (!isSearching) return;
    const bars = document.getElementsByClassName("bar");

    highlightCodeLine(3);
    if (left <= right) {
        mid = Math.floor((left + right) / 2);
        highlightCodeLine(4);
        
        resetHighlights();
        const currentBars = arrayContainer.children;
        for(let i=left; i<=right; i++) if(currentBars[i]) currentBars[i].classList.add("comparing");
        if(currentBars[left]) currentBars[left].classList.add("left-bound");
        if(currentBars[right]) currentBars[right].classList.add("right-bound");
        if(currentBars[mid]) currentBars[mid].classList.add("active");

        updateDebugText(`Checking index ${mid} (value: ${array[mid]})`);
        
        if (array[mid] === target) {
            highlightCodeLine(5);
            resetHighlights();
            const currentBars = arrayContainer.children;
            if(currentBars[mid]) currentBars[mid].classList.add("found");
            updateDebugText(`Found ${target} at index ${mid}!`);
            isSearching = false;
            stepButton.disabled = true;
            return;
        }

        if (array[mid] < target) {
            highlightCodeLine(6);
            left = mid + 1;
        } else {
            highlightCodeLine(7);
            right = mid - 1;
        }
    } else {
        highlightCodeLine(9);
        updateDebugText("Element not found.");
        isSearching = false;
        stepButton.disabled = true;
    }
}

function resetArray() {
    isSearching = false;
    resetHighlights();
    highlightCodeLine(0);
    generateArray();
}

SizeInput.addEventListener('change', GetSize);
generateArray();


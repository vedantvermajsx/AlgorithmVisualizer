let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const SizeInput = document.getElementById("Size");
const targetInput = document.getElementById("target-val");
const stepButton = document.getElementById("step-button");

let Size = 0;
let target = -1;
let currentIndex = 0;
let isSearching = false;
let isManual = false;

function highlightCodeLine(line) {
    document.querySelectorAll("#algorithm-code span").forEach((codeLine) => codeLine.classList.remove("highlight"));
    const lineElement = document.getElementById(`code-line-${line}`);
    if (lineElement) lineElement.classList.add("highlight");
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
    renderArray();
    updateDebugText("New array generated. Ready for searching.");
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
    currentIndex = 0;
    
    highlightCodeLine(1);
    await new Promise(resolve => setTimeout(resolve, 300));

    while (currentIndex < array.length) {
        if (!isSearching) return;
        highlightCodeLine(2);
        
        const bars = document.getElementsByClassName("bar");
        bars[currentIndex].classList.add("active");
        updateDebugText(`Checking element at index ${currentIndex} (value: ${array[currentIndex]})`);
        
        highlightCodeLine(3);
        await new Promise(resolve => setTimeout(resolve, 400));

        if (array[currentIndex] === target) {
            highlightCodeLine(4);
            bars[currentIndex].classList.add("sorted");
            updateDebugText(`Found ${target} at index ${currentIndex}!`);
            isSearching = false;
            return;
        }
        
        bars[currentIndex].classList.remove("active");
        bars[currentIndex].classList.add("comparing");
        currentIndex++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    highlightCodeLine(7);
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
    currentIndex = 0;
    updateDebugText("Manual search started. Click 'Step' to proceed.");
    highlightCodeLine(1);
}

function nextStep() {
    if (!isSearching) return;
    highlightCodeLine(2);
    
    const bars = document.getElementsByClassName("bar");
    if (currentIndex < array.length) {
        bars[currentIndex].classList.add("active");
        updateDebugText(`Checking element at index ${currentIndex} (value: ${array[currentIndex]})`);
        
        highlightCodeLine(3);
        if (array[currentIndex] === target) {
            highlightCodeLine(4);
            bars[currentIndex].classList.add("sorted");
            updateDebugText(`Found ${target} at index ${currentIndex}!`);
            isSearching = false;
            stepButton.disabled = true;
            return;
        }
        
        setTimeout(() => {
            if(bars[currentIndex]) {
                bars[currentIndex].classList.remove("active");
                bars[currentIndex].classList.add("comparing");
            }
            currentIndex++;
        }, 300);
    } else {
        highlightCodeLine(7);
        updateDebugText("Target not found.");
        isSearching = false;
        stepButton.disabled = true;
    }
}

function resetArray() {
    isSearching = false;
    highlightCodeLine(0);
    generateArray();
}

SizeInput.addEventListener('change', GetSize);
generateArray();

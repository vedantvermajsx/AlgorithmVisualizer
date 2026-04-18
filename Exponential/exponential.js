
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const sizeInput = document.getElementById("Size");
const searchInput = document.getElementById("target-val");
const stepButton = document.getElementById("step-button");
const ManualButton = document.getElementById("manual");
const AutomaticButton = document.getElementById("automatic");

let isGenerated = false;
let array = [];
let size = 0;
let target = -1;
let bound = 1;
let low = 0;
let high = -1;
let Automatic = true;
let isSearching = false;

function generateArray() {
    if (!size || size <= 0) return;
    const minValue = 1;
    const maxValue = size * 5;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
    array.sort((a, b) => a - b);
    renderArray();
    debugText.textContent = "Array generated and sorted. Enter a search value and press Automatic or Manual.";
}

function renderArray() {
    if (!array.length) return;
    const maxValue = Math.max(...array);
    const bars = arrayContainer.children;

    if (bars.length !== array.length) {
        arrayContainer.innerHTML = "";
        array.forEach((value, index) => {
            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${(value / maxValue) * 100}%`;
            bar.setAttribute("data-index", index);
            arrayContainer.appendChild(bar);
        });
    } else {
        array.forEach((value, index) => {
            bars[index].style.height = `${(value / maxValue) * 100}%`;
        });
    }
    isGenerated = true;
}

sizeInput.addEventListener("change", () => {
    size = parseInt(sizeInput.value);
    sizeInput.value = '';
    if (size > 0 && !isNaN(size) && size < 50) {
        generateArray();
    } else {
        arrayContainer.innerHTML = "";
        debugText.textContent = "Please enter a valid size (1 < n < 50).";
    }
});

function highlightBar(index, className) {
    const bars = arrayContainer.children;
    if (bars[index]) bars[index].classList.add(className);
}

function resetHighlights() {
    Array.from(arrayContainer.children).forEach((bar) => {
        bar.classList.remove("active", "comparing", "found", "left-bound", "right-bound");
    });
}

function highlightCodeLine(line) {
    document.querySelectorAll("#algorithm-code span").forEach((codeLine) => codeLine.classList.remove("highlight"));
    const el = document.getElementById(`code-line-${line}`);
    if (el) el.classList.add("highlight");
}

function updateDebug(message) {
    debugText.textContent = message;
}

function resetArray() {
    array = [];
    size = 0;
    target = -1;
    bound = 1;
    low = 0;
    high = -1;
    Automatic = true;
    isGenerated = false;
    doBinary = false;
    isSearching = false;
    arrayContainer.innerHTML = "";
    updateDebug("Array reset. Enter a new size to begin.");
    ManualButton.disabled = false;
    AutomaticButton.disabled = false;
    stepButton.disabled = true;
    searchInput.value = '';
    document.querySelectorAll("#algorithm-code span").forEach(el => el.classList.remove("highlight"));
}

function startAutomaticSort() {
    if (!isGenerated) {
        updateDebug("Please generate an array first (enter a size).");
        return;
    }
    if (isSearching) return;

    target = parseInt(searchInput.value);
    if (isNaN(target)) {
        updateDebug("Please enter a valid search value.");
        return;
    }

    resetHighlights();
    updateDebug(`Starting automatic search for ${target}...`);
    Automatic = true;
    isSearching = true;
    stepButton.disabled = true;
    ManualButton.disabled = true;
    AutomaticButton.disabled = true;
    bound = 1;

    highlightCodeLine(2);
    if (array[0] === target) {
        highlightBar(0, "found");
        updateDebug(`✅ Element ${target} found at index 0!`);
        isSearching = false;
        setTimeout(resetArray, 5000);
        return;
    }

    exponentialLoop();
}

async function exponentialLoop() {
    while (bound < array.length && array[bound] < target) {
        highlightCodeLine(4);
        resetHighlights();
        highlightBar(bound, "active");
        updateDebug(`Exponential: Checking index ${bound} (value: ${array[bound]})`);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        highlightCodeLine(5);
        bound *= 2;
        await new Promise(resolve => setTimeout(resolve, 400));
    }

    // Range found
    highlightCodeLine(4);
    resetHighlights();
    if (bound < array.length) highlightBar(bound, "active");
    updateDebug(`Exponential phase done. Bound reached: ${bound >= array.length ? 'End of array' : array[bound]}.`);
    await new Promise(resolve => setTimeout(resolve, 800));

    low = Math.floor(bound / 2);
    high = Math.min(bound, array.length - 1);

    updateDebug(`Search range determined: [${low}, ${high}]. Switching to binary search...`);
    highlightCodeLine(7);
    highlightCodeLine(8);
    highlightCodeLine(9);
    highlightBar(low, "left-bound");
    highlightBar(high, "right-bound");
    await new Promise(resolve => setTimeout(resolve, 1000));

    await binarySearchLoop();
    isSearching = false;
    setTimeout(resetArray, 5000);
}

async function binarySearchLoop() {
    highlightCodeLine(13);
    await new Promise(resolve => setTimeout(resolve, 600));

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        resetHighlights();
        highlightBar(low, "comparing");
        highlightBar(high, "comparing");
        
        highlightCodeLine(14);
        highlightBar(mid, "active");
        updateDebug(`Binary search: range [${low}, ${high}], mid = ${mid} (value: ${array[mid]})`);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (array[mid] === target) {
            highlightCodeLine(15);
            await new Promise(resolve => setTimeout(resolve, 400));
            resetHighlights();
            highlightBar(mid, "found");
            updateDebug(`✅ Element ${target} found at index ${mid}!`);
            return;
        } else if (array[mid] < target) {
            highlightCodeLine(16);
            await new Promise(resolve => setTimeout(resolve, 600));
            low = mid + 1;
            updateDebug(`mid value ${array[mid]} < ${target}. Searching right half.`);
            await new Promise(resolve => setTimeout(resolve, 600));
        } else {
            highlightCodeLine(17);
            await new Promise(resolve => setTimeout(resolve, 600));
            high = mid - 1;
            updateDebug(`mid value ${array[mid]} > ${target}. Searching left half.`);
            await new Promise(resolve => setTimeout(resolve, 600));
        }
    }

    highlightCodeLine(19);
    resetHighlights();
    updateDebug(`❌ Element ${target} not found in the array.`);
}

let doBinary = false;

async function setManualMode() {
    if (!isGenerated) {
        updateDebug("Please generate an array first (enter a size).");
        return;
    }
    target = parseInt(searchInput.value);
    if (isNaN(target)) {
        updateDebug("Please enter a valid search value.");
        return;
    }

    Automatic = false;
    doBinary = false;
    bound = 1;
    low = 0;
    high = -1;
    isSearching = true;

    ManualButton.disabled = true;
    AutomaticButton.disabled = true;

    resetHighlights();
    updateDebug(`Manual search for ${target}. Click 'Step' to proceed.`);
    stepButton.disabled = false;

    highlightCodeLine(1);
    await new Promise(resolve => setTimeout(resolve, 400));
    highlightCodeLine(2);
    if (array[0] === target) {
        highlightBar(0, "found");
        updateDebug(`✅ Element ${target} found at index 0!`);
        stepButton.disabled = true;
        isSearching = false;
        setTimeout(resetArray, 5000);
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 400));
    highlightCodeLine(3);
}

async function stepSort() {
    if (!isSearching) return;
    stepButton.disabled = true;

    if (!doBinary) {
        await MexponentialStep();
        if (!doBinary) stepButton.disabled = false;
        else stepButton.disabled = false; 
    } else {
        const done = await MbinarySearchStep();
        if (!done) stepButton.disabled = false;
        else isSearching = false;
    }
}

async function MexponentialStep() {
    highlightCodeLine(4);
    if (bound < array.length && array[bound] < target) {
        resetHighlights();
        highlightBar(bound, "active");
        updateDebug(`Exponential: Checking index ${bound} (value: ${array[bound]})`);
        highlightCodeLine(5);
        bound *= 2;
        return;
    }

    // Transition to binary
    low = Math.floor(bound / 2);
    high = Math.min(bound, array.length - 1);
    updateDebug(`Exponential done. Range: [${low}, ${high}]. Switching to binary search. Click Step.`);
    highlightCodeLine(7);
    resetHighlights();
    highlightBar(low, "comparing");
    highlightBar(high, "comparing");
    doBinary = true;
}

async function MbinarySearchStep() {
    highlightCodeLine(13);
    highlightCodeLine(14);

    if (low > high) {
        highlightCodeLine(19);
        updateDebug(`❌ Element ${target} not found. Resetting in 5s...`);
        stepButton.disabled = true;
        setTimeout(resetArray, 5000);
        return true;
    }

    const mid = Math.floor((low + high) / 2);
    resetHighlights();
    highlightBar(low, "comparing");
    highlightBar(high, "comparing");
    
    highlightCodeLine(14);
    highlightBar(mid, "active");
    updateDebug(`Binary search: mid = ${mid} (value: ${array[mid]})`);

    if (array[mid] === target) {
        highlightCodeLine(15);
        await new Promise(resolve => setTimeout(resolve, 400));
        resetHighlights();
        highlightBar(mid, "found");
        updateDebug(`✅ Element ${target} found at index ${mid}!`);
        stepButton.disabled = true;
        setTimeout(resetArray, 5000);
        return true;
    } else if (array[mid] < target) {
        highlightCodeLine(16);
        low = mid + 1;
        updateDebug(`mid value ${array[mid]} < ${target} — searching right half`);
    } else {
        highlightCodeLine(17);
        high = mid - 1;
        updateDebug(`mid value ${array[mid]} > ${target} — searching left half`);
    }
    return false;
}

document.querySelector("button[onclick='resetArray()']").addEventListener("click", resetArray);

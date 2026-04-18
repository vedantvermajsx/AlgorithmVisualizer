let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");
let Size = 0;
let isSorting = false;
let isManual = false;
let i = 0, j = 0;
const SizeInput = document.getElementById("Size");

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
    array = Array.from({ length: Size || 20 }, () => Math.floor(Math.random() * 90) + 10);
    renderArray();
    resetIndices();
    updateDebugText("New array generated. Ready for sorting.");
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

function resetIndices() {
    i = 0;
    j = 0;
}

function clearBarStates() {
    const bars = document.getElementsByClassName("bar");
    Array.from(bars).forEach(bar => {
        if (!bar.classList.contains("sorted")) {
            bar.classList.remove("active", "comparing");
        }
    });
}

async function manualSortStep() {
    const bars = document.getElementsByClassName("bar");
    if (i >= array.length - 1) {
        updateDebugText("Array is fully sorted! 🎉");
        highlightCodeLine(0);
        Array.from(bars).forEach(bar => bar.classList.add("sorted"));
        isSorting = false;
        stepButton.disabled = true;
        return;
    }

    clearBarStates();

    highlightCodeLine(1);
    await new Promise(resolve => setTimeout(resolve, 300));

    let min_idx = i;
    highlightCodeLine(2);
    const currentBars = document.getElementsByClassName("bar");
    currentBars[i].classList.add("active");
    updateDebugText(`Looking for min starting at index ${i}...`);
    await new Promise(resolve => setTimeout(resolve, 300));

    highlightCodeLine(3);
    for (let current_j = i + 1; current_j < array.length; current_j++) {
        highlightCodeLine(4);
        const innerBars = document.getElementsByClassName("bar");
        innerBars[current_j].classList.add("comparing");
        await new Promise(resolve => setTimeout(resolve, 350));

        if (array[current_j] < array[min_idx]) {
            highlightCodeLine(5);
            innerBars[min_idx].classList.remove("active");
            min_idx = current_j;
            innerBars[min_idx].classList.add("active");
            updateDebugText(`New minimum found at index ${min_idx} (value: ${array[min_idx]})`);
            await new Promise(resolve => setTimeout(resolve, 350));
        }
        innerBars[current_j].classList.remove("comparing");
    }

    highlightCodeLine(8);
    await new Promise(resolve => setTimeout(resolve, 300));
    highlightCodeLine(9);
    await new Promise(resolve => setTimeout(resolve, 300));
    highlightCodeLine(10);
    [array[i], array[min_idx]] = [array[min_idx], array[i]];
    renderArray();
    const swapBars = document.getElementsByClassName("bar");
    if (swapBars[i]) swapBars[i].classList.add("comparing");
    if (swapBars[min_idx]) swapBars[min_idx].classList.add("comparing");
    updateDebugText(`✓ Swapped indices ${i} and ${min_idx}`);
    await new Promise(resolve => setTimeout(resolve, 600));
    if (swapBars[i]) swapBars[i].classList.remove("comparing");
    if (swapBars[min_idx]) swapBars[min_idx].classList.remove("comparing");

    i++;
    const finalBars = document.getElementsByClassName("bar");
    for (let k = 0; k < i; k++) {
        if (finalBars[k]) finalBars[k].classList.add("sorted");
    }
}

async function automaticSort() {
    isSorting = true;
    for (let i = 0; i < array.length - 1; i++) {
        if (!isSorting || isManual) return;

        highlightCodeLine(1);
        await new Promise(resolve => setTimeout(resolve, 200));
        let min_idx = i;

        highlightCodeLine(2);
        const startBars = document.getElementsByClassName("bar");
        startBars[i].classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 200));

        for (let current_j = i + 1; current_j < array.length; current_j++) {
            if (!isSorting || isManual) return;

            highlightCodeLine(3);
            highlightCodeLine(4);
            const innerBars = document.getElementsByClassName("bar");
            innerBars[current_j].classList.add("comparing");
            await new Promise(resolve => setTimeout(resolve, 300));

            if (array[current_j] < array[min_idx]) {
                highlightCodeLine(5);
                innerBars[min_idx].classList.remove("active");
                min_idx = current_j;
                innerBars[min_idx].classList.add("active");
                updateDebugText(`New min at ${min_idx}: ${array[min_idx]}`);
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            innerBars[current_j].classList.remove("comparing");
        }

        highlightCodeLine(8);
        await new Promise(resolve => setTimeout(resolve, 300));
        highlightCodeLine(9);
        await new Promise(resolve => setTimeout(resolve, 300));
        highlightCodeLine(10);
        [array[i], array[min_idx]] = [array[min_idx], array[i]];
        renderArray();
        const swapBars = document.getElementsByClassName("bar");
        if (swapBars[i]) swapBars[i].classList.add("comparing");
        if (swapBars[min_idx]) swapBars[min_idx].classList.add("comparing");
        updateDebugText(`✓ Swapped min to position ${i}`);
        await new Promise(resolve => setTimeout(resolve, 600));
        if (swapBars[i]) swapBars[i].classList.remove("comparing");
        if (swapBars[min_idx]) swapBars[min_idx].classList.remove("comparing");

        const afterBars = document.getElementsByClassName("bar");
        for (let k = 0; k <= i; k++) {
            if (afterBars[k]) afterBars[k].classList.add("sorted");
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    const finalBars = document.getElementsByClassName("bar");
    Array.from(finalBars).forEach(bar => bar.classList.add("sorted"));
    highlightCodeLine(0);
    updateDebugText("✅ Array fully sorted!");
    isSorting = false;
}

function setManualMode() {
    isManual = true;
    isSorting = false;
    stepButton.disabled = false;
    resetIndices();
    renderArray();
    updateDebugText("Manual mode activated. Use 'Step' to proceed.");
}

async function stepSort() {
    if (isManual) {
        stepButton.disabled = true;
        await manualSortStep();
        const bars = document.getElementsByClassName("bar");
        const allSorted = Array.from(bars).every(b => b.classList.contains("sorted"));
        if (!allSorted) stepButton.disabled = false;
    }
}

function startAutomaticSort() {
    if (!isSorting) {
        isManual = false;
        stepButton.disabled = true;
        resetIndices();
        automaticSort();
    }
}

function resetArray() {
    isSorting = false;
    isManual = false;
    stepButton.disabled = true;
    highlightCodeLine(0);
    generateArray();
}

SizeInput.addEventListener('change', GetSize);
generateArray();

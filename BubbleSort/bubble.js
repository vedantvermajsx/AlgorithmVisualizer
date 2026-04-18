let array = [];
let swappedMade = 0;
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");

let Size = 0;
let isSorting = false;
let isManual = false;
let i = 0, j = 0;

let MAX = 100;
let MIN = 10;
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
        updateDebugText("Please enter a valid size value (max 50).");
        return;
    }
    generateArray();
}

function generateArray() {
    array = Array.from({ length: Size || 20 }, () => Math.floor(Math.random() * (MAX - MIN)) + MIN);
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
    swappedMade = 0;
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
        stepButton.disabled = true;
        return;
    }

    clearBarStates();

    highlightCodeLine(1);
    await new Promise(resolve => setTimeout(resolve, 200));
    highlightCodeLine(2);
    await new Promise(resolve => setTimeout(resolve, 200));

    bars[j].classList.add("active");
    bars[j + 1].classList.add("active");

    highlightCodeLine(3);
    await new Promise(resolve => setTimeout(resolve, 400));

    if (array[j] > array[j + 1]) {
        highlightCodeLine(4);
        await new Promise(resolve => setTimeout(resolve, 300));
        highlightCodeLine(5);
        await new Promise(resolve => setTimeout(resolve, 300));
        highlightCodeLine(6);
        swappedMade++;
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        renderArray();
        const newBars = document.getElementsByClassName("bar");
        newBars[j].classList.add("comparing");
        newBars[j + 1].classList.add("comparing");
        updateDebugText(`✓ Swapped elements at index ${j} and ${j + 1}`);
        await new Promise(resolve => setTimeout(resolve, 600));
        newBars[j].classList.remove("comparing");
        newBars[j + 1].classList.remove("comparing");
    } else {
        updateDebugText(`→ No swap needed at index ${j} and ${j + 1}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    j++;
    if (j >= array.length - i - 1) {
        const finalBars = document.getElementsByClassName("bar");
        finalBars[array.length - i - 1].classList.add("sorted");
        j = 0;
        i++;
    }
}

async function automaticSort() {
    const bars = document.getElementsByClassName("bar");
    for (let i = 0; i < array.length - 1; i++) {
        highlightCodeLine(1);
        await new Promise(resolve => setTimeout(resolve, 200));

        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting || isManual) return;

            clearBarStates();
            highlightCodeLine(2);
            await new Promise(resolve => setTimeout(resolve, 200));

            const currentBars = document.getElementsByClassName("bar");
            currentBars[j].classList.add("active");
            currentBars[j + 1].classList.add("active");

            highlightCodeLine(3);
            await new Promise(resolve => setTimeout(resolve, 500));

            if (array[j] > array[j + 1]) {
                highlightCodeLine(4);
                await new Promise(resolve => setTimeout(resolve, 300));
                highlightCodeLine(5);
                await new Promise(resolve => setTimeout(resolve, 300));
                highlightCodeLine(6);
                swappedMade++;
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray();
                const swapBars = document.getElementsByClassName("bar");
                swapBars[j].classList.add("comparing");
                swapBars[j + 1].classList.add("comparing");
                updateDebugText(`✓ Swapped index ${j} and ${j + 1}`);
                await new Promise(resolve => setTimeout(resolve, 600));
                swapBars[j].classList.remove("comparing");
                swapBars[j + 1].classList.remove("comparing");
            } else {
                updateDebugText(`→ Comparing index ${j} and ${j + 1} — no swap`);
                await new Promise(resolve => setTimeout(resolve, 400));
            }
        }

        const sortedBars = document.getElementsByClassName("bar");
        sortedBars[array.length - i - 1].classList.add("sorted");
    }

    const allBars = document.getElementsByClassName("bar");
    Array.from(allBars).forEach(bar => bar.classList.add("sorted"));
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
        isSorting = true;
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

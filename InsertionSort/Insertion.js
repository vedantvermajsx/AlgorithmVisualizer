let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const stepButton = document.getElementById("step-button");
let Size = 0;
let isSorting = false;
let isManual = false;
let i = 1, j = 0;
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
    i = 1;
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
    if (i >= array.length) {
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

    let key = array[i];
    highlightCodeLine(2);
    bars[i].classList.add("active");
    await new Promise(resolve => setTimeout(resolve, 300));

    highlightCodeLine(3);
    j = i - 1;
    await new Promise(resolve => setTimeout(resolve, 300));

    while (j >= 0 && array[j] > key) {
        highlightCodeLine(4);
        const currentBars = document.getElementsByClassName("bar");
        if (currentBars[j]) currentBars[j].classList.add("comparing");
        await new Promise(resolve => setTimeout(resolve, 400));

        highlightCodeLine(5);
        array[j + 1] = array[j];
        renderArray();
        const newBars = document.getElementsByClassName("bar");
        if (newBars[j]) newBars[j].classList.add("comparing");
        if (newBars[j + 1]) newBars[j + 1].classList.add("comparing");
        if (newBars[i]) newBars[i].classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 400));
        if (newBars[j]) newBars[j].classList.remove("comparing");

        highlightCodeLine(6);
        j--;
        updateDebugText(`→ Shifted element to index ${j + 2}`);
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    highlightCodeLine(8);
    array[j + 1] = key;
    renderArray();
    updateDebugText(`✓ Inserted key ${key} at index ${j + 1}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    i++;
    const finalBars = document.getElementsByClassName("bar");
    for (let k = 0; k < i; k++) {
        if (finalBars[k]) finalBars[k].classList.add("sorted");
    }
}

async function automaticSort() {
    isSorting = true;
    for (let i = 1; i < array.length; i++) {
        if (!isSorting || isManual) return;

        highlightCodeLine(1);
        await new Promise(resolve => setTimeout(resolve, 200));
        let key = array[i];

        highlightCodeLine(2);
        const startBars = document.getElementsByClassName("bar");
        if (startBars[i]) startBars[i].classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 300));

        let j = i - 1;
        highlightCodeLine(3);
        await new Promise(resolve => setTimeout(resolve, 200));

        while (j >= 0 && array[j] > key) {
            if (!isSorting || isManual) return;

            highlightCodeLine(4);
            const currentBars = document.getElementsByClassName("bar");
            if (currentBars[j]) currentBars[j].classList.add("comparing");
            await new Promise(resolve => setTimeout(resolve, 400));

            highlightCodeLine(5);
            array[j + 1] = array[j];
            renderArray();
            const newBars = document.getElementsByClassName("bar");
            if (newBars[j]) newBars[j].classList.add("comparing");
            if (newBars[j + 1]) newBars[j + 1].classList.add("comparing");

            highlightCodeLine(6);
            j--;
            updateDebugText(`→ Shifting — key: ${key}`);
            await new Promise(resolve => setTimeout(resolve, 400));
        }

        highlightCodeLine(8);
        array[j + 1] = key;
        renderArray();

        const afterBars = document.getElementsByClassName("bar");
        for (let k = 0; k <= i; k++) {
            if (afterBars[k]) afterBars[k].classList.add("sorted");
        }
        updateDebugText(`✓ Inserted key ${key} at index ${j + 1}`);
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
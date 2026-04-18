let array = [];
const arrayContainer = document.getElementById("array-container");
const debugText = document.getElementById("debug-text");
const SizeInput = document.getElementById("Size");
let Size = 0;
let isSorting = false;

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

async function maxHeapify(n, i) {
    highlightCodeLine(8);
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    const bars = document.getElementsByClassName("bar");

    if (left < n && array[left] > array[largest]) largest = left;
    if (right < n && array[right] > array[largest]) largest = right;

    if (largest !== i) {
        bars[i].classList.add("active");
        bars[largest].classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 200));

        [array[i], array[largest]] = [array[largest], array[i]];
        renderArray();
        const swapBars = document.getElementsByClassName("bar");
        swapBars[i].classList.add("comparing");
        swapBars[largest].classList.add("comparing");
        updateDebugText(`Heapified node ${i}`);
        await new Promise(resolve => setTimeout(resolve, 400));
        swapBars[i].classList.remove("comparing");
        swapBars[largest].classList.remove("comparing");
        
        await maxHeapify(n, largest);
    }
}

async function heapSort() {
    let n = array.length;
    highlightCodeLine(1);

    highlightCodeLine(2);
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await maxHeapify(n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        highlightCodeLine(3);
        highlightCodeLine(4);
        [array[0], array[i]] = [array[i], array[0]];
        renderArray();
        const swapBars = document.getElementsByClassName("bar");
        swapBars[0].classList.add("comparing");
        swapBars[i].classList.add("comparing");
        await new Promise(resolve => setTimeout(resolve, 500));
        swapBars[0].classList.remove("comparing");
        swapBars[i].classList.remove("comparing");
        swapBars[i].classList.add("sorted");
        
        highlightCodeLine(5);
        await maxHeapify(i, 0);
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

async function startAutomaticSort() {
    if (!isSorting) {
        isSorting = true;
        await heapSort();
        const bars = document.getElementsByClassName("bar");
        Array.from(bars).forEach(bar => bar.classList.add("sorted"));
        highlightCodeLine(0);
        updateDebugText("Array fully sorted!");
        isSorting = false;
    }
}

function resetArray() {
    isSorting = false;
    highlightCodeLine(0);
    generateArray();
}

SizeInput.addEventListener('change', GetSize);
generateArray();

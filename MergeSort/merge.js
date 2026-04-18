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

async function merge(l, m, r) {
    highlightCodeLine(8);
    let n1 = m - l + 1;
    let n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[l + i];
    for (let j = 0; j < n2; j++) R[j] = array[m + 1 + j];

    let i = 0, j = 0, k = l;
    const bars = document.getElementsByClassName("bar");

    while (i < n1 && j < n2) {
        highlightCodeLine(9);
        bars[l + i].classList.add("comparing");
        bars[m + 1 + j].classList.add("comparing");
        await new Promise(resolve => setTimeout(resolve, 200));

        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        renderArray();
        const newBars = document.getElementsByClassName("bar");
        newBars[k].classList.add("active");
        k++;
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    while (i < n1) {
        array[k] = L[i];
        i++;
        k++;
        renderArray();
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    while (j < n2) {
        array[k] = R[j];
        j++;
        k++;
        renderArray();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function mergeSort(l, r) {
    highlightCodeLine(1);
    if (l >= r) {
        highlightCodeLine(2);
        return;
    }
    let m = l + Math.floor((r - l) / 2);
    highlightCodeLine(3);
    
    highlightCodeLine(4);
    await mergeSort(l, m);
    
    highlightCodeLine(5);
    await mergeSort(m + 1, r);
    
    highlightCodeLine(6);
    await merge(l, m, r);
}

async function startAutomaticSort() {
    if (!isSorting) {
        isSorting = true;
        await mergeSort(0, array.length - 1);
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

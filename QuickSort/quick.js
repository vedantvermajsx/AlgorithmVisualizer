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

async function partition(low, high) {
    highlightCodeLine(8);
    let pivot = array[high];
    highlightCodeLine(9);
    
    let i = low - 1;
    highlightCodeLine(10);
    
    const bars = document.getElementsByClassName("bar");
    bars[high].classList.add("active"); 
    for (let j = low; j < high; j++) {
        highlightCodeLine(11);
        bars[j].classList.add("comparing");
        await new Promise(resolve => setTimeout(resolve, 100));
        
        highlightCodeLine(12);
        if (array[j] < pivot) {
            i++;
            highlightCodeLine(13);
            [array[i], array[j]] = [array[j], array[i]];
            renderArray();
            const newBars = document.getElementsByClassName("bar");
            newBars[i].classList.add("comparing");
            newBars[j].classList.add("comparing");
            newBars[high].classList.add("active");
            await new Promise(resolve => setTimeout(resolve, 400));
            newBars[i].classList.remove("comparing");
            newBars[j].classList.remove("comparing");
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        const currentBars = document.getElementsByClassName("bar");
        if(currentBars[j]) currentBars[j].classList.remove("comparing");
    }
    
    highlightCodeLine(16);
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray();
    const swapBars = document.getElementsByClassName("bar");
    swapBars[i + 1].classList.add("comparing");
    swapBars[high].classList.add("comparing");
    await new Promise(resolve => setTimeout(resolve, 500));
    swapBars[i + 1].classList.remove("comparing");
    swapBars[high].classList.remove("comparing");
    highlightCodeLine(17);
    
    const finalBars = document.getElementsByClassName("bar");
    finalBars[i + 1].classList.add("sorted");
    
    return i + 1;
}

async function quickSort(low, high) {
    highlightCodeLine(1);
    if (low < high) {
        highlightCodeLine(2);
        let pi = await partition(low, high);
        highlightCodeLine(3);
        
        highlightCodeLine(4);
        await quickSort(low, pi - 1);
        
        highlightCodeLine(5);
        await quickSort(pi + 1, high);
    } else if (low === high) {
        const bars = document.getElementsByClassName("bar");
        if(bars[low]) bars[low].classList.add("sorted");
    }
}

async function startAutomaticSort() {
    if (!isSorting) {
        isSorting = true;
        await quickSort(0, array.length - 1);
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

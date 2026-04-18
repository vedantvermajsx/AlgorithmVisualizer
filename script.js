const algorithms = {
  sorting: [
    { name: "Bubble Sort", img: "./assests/BubbleSort.png", url: "./BubbleSort/Bubble.html" },
    { name: "Insertion Sort", img: "./assests/InsertionSort.png", url: "./InsertionSort/insertion.html" },
    { name: "Selection Sort", img: "./assests/SelectionSort.png", url: "./SelectionSort/selection.html" },
    { name: "Quick Sort", img: "./assests/QuickSort.png", url: "./QuickSort/quick.html" },
    { name: "Merge Sort", img: "./assests/MergeSort.png", url: "./MergeSort/merge.html" },
    { name: "Heap Sort", img: "./assests/HeapSort.png", url: "./HeapSort/heap.html" },
  ],
  searching: [
    { name: "Binary Search", img: "./assests/BinarySearch.png", url: "./BinarySearch/Binary.html" },
    { name: "Linear Search", img: "./assests/LinearSearch.png", url: "./LinearSearch/linear.html" },
    { name: "Exponential Search", img: "./assests/Exponential.png", url: "./Exponential/exponential.html" },
  ],
  graphs: [
    { name: "A* Search", img: "./assests/Astar.png", url: "./Astar/Astar.html" },
    { name: "BFS", img: "./assests/BreadthFirst.png", url: "./BFS/bfs.html" },
    { name: "DFS", img: "./assests/DepthFirst.png", url: "./DFS/dfs.html" },
    { name: "Dijkstra", img: "./assests/Dijkstra.png", url: "./Djktra/Dijiktra.html" },
    { name: "Bi-Directional", img: "./assests/BiDirectional.png", url: "./BiDirectional/bidirectional.html" },
  ]
};

function showData() {
  for (const category in algorithms) {
    const container = document.getElementById(`${category}-container`);
    if (!container) continue;

    algorithms[category].forEach((algo) => {
      const Card = document.createElement("div");
      Card.classList.add("card");
      Card.style.backgroundImage = `url(${algo.img})`;
      Card.setAttribute("title", algo.name);

      Card.addEventListener("click", () => {
        window.location.href = algo.url;
      });
      container.appendChild(Card);
    });
  }
}

showData();

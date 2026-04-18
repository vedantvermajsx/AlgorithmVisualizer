const algorithms = {
  sorting: [
    { name: "Bubble Sort", img: "./assests/bubblesort.png", url: "./bubblesort/bubble.html" },
    { name: "Insertion Sort", img: "./assests/insertionsort.png", url: "./insertionsort/insertion.html" },
    { name: "Selection Sort", img: "./assests/selectionsort.png", url: "./selectionsort/selection.html" },
    { name: "Quick Sort", img: "./assests/quicksort.png", url: "./quicksort/quick.html" },
    { name: "Merge Sort", img: "./assests/mergesort.png", url: "./mergesort/merge.html" },
    { name: "Heap Sort", img: "./assests/heapsort.png", url: "./heapsort/heap.html" },
  ],
  searching: [
    { name: "Binary Search", img: "./assests/binarysearch.png", url: "./binarysearch/binary.html" },
    { name: "Linear Search", img: "./assests/linearsearch.png", url: "./linearsearch/linear.html" },
    { name: "Exponential Search", img: "./assests/exponential.png", url: "./exponential/exponential.html" },
  ],
  graphs: [
    { name: "A* Search", img: "./assests/astar.png", url: "./astar/astar.html" },
    { name: "BFS", img: "./assests/breadthfirst.png", url: "./bfs/bfs.html" },
    { name: "DFS", img: "./assests/depthfirst.png", url: "./dfs/dfs.html" },
    { name: "Dijkstra", img: "./assests/dijkstra.png", url: "./djktra/dijiktra.html" },
    { name: "Bi-Directional", img: "./assests/bidirectional.png", url: "./bidirectional/bidirectional.html" },
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


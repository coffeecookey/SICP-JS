const rows = 17;
const cols = 30;
let activeType = 0;
let map = [];

const grid = document.getElementById('grid');
const output = document.getElementById('output');

function setActiveType(type) {
  activeType = type;
}

function createGrid() {
  map = [];
  grid.innerHTML = '';
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell', 'type-0');
      cell.dataset.type = '0';
      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.addEventListener('click', () => {
        const newType = activeType;
        cell.classList.replace(`type-${cell.dataset.type}`, `type-${newType}`);
        cell.dataset.type = newType;
        map[y][x] = newType;
        updateOutput();
      });

      grid.appendChild(cell);
      row.push(0);
    }
    map.push(row);
  }
  updateOutput();
}

function updateOutput() {
  const mapStr = map.map(row => `[${row.join(',')}]`).join(',\n');
  output.textContent = `[\n${mapStr}\n];`;
}

function resetMap() {
  createGrid();
}

function copyMap() {
  navigator.clipboard.writeText(output.textContent)
    .then(() => alert("Map copied to clipboard!"))
    .catch(() => alert("Failed to copy"));
}

// Initialize grid on page load
createGrid();

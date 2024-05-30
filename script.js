let canvas;
let ctx;
let mapContainer;

const mapSize = 100;
const tileSize = 10;
const cityStyle = 'modern';

function generateCityMap(mapSize, cityStyle) {
  const map = [];
  for (let i = 0; i < mapSize; i++) {
    map.push([]);
    for (let j = 0; j < mapSize; j++) {
      if (i === 0 || j === 0 || i === mapSize - 1 || j === mapSize - 1) {
        map[i].push('water');
      } else {
        let terrainType = 'grass';
        if (Math.random() < 0.5) {
          terrainType = 'water';
        }
        map[i].push(terrainType);
      }
    }
  }

  // Add some randomness to the map generation
  if (cityStyle === 'modern') {
    for (let i = 1; i < mapSize - 1; i++) {
      for (let j = 1; j < mapSize - 1; j++) {
        if (map[i][j] === 'grass' && Math.random() < 0.1) {
          map[i][j] = 'road';
        } else if (map[i][j] === 'grass' && Math.random() < 0.05) {
          map[i][j] = 'park';
        }
      }
    }
  }

  return map;
}

function getTerrainColor(terrainType) {
  switch (terrainType) {
    case 'water':
      return 'blue';
    case 'grass':
      return 'green';
    case 'road':
      return 'gray';
    case 'park':
      return 'brown';
    default:
      return 'gray';
  }
}

function generateMap() {
  try {
    const map = generateCityMap(mapSize, cityStyle);

    canvas = document.createElement('canvas');
    canvas.width = mapSize * tileSize;
    canvas.height = mapSize * tileSize;
    ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = false; // Disable anti-aliasing

    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        const terrainType = map[i][j];
        const color = getTerrainColor(terrainType);
        ctx.fillStyle = color;
        ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }

    mapContainer.replaceChildren(); // clear the container
    mapContainer.appendChild(canvas);
  } catch (error) {
    console.error(error);
    alert(`Error generating map: ${error.message}`);
  }
}

function init() {
  mapContainer = document.getElementById('map-container');

  // Add event listener for the "Generate Map" button
  document.getElementById('generate-button').addEventListener('click', generateMap);

  generateMap();
}

init();

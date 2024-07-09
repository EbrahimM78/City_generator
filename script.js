let canvas;
let ctx;
let mapContainer;
let cityInfoContainer;

const mapSize = 64;
const tileSize = 10;
let cityStyle = 'modern';

// New generateCityMap function
function generateCityMap(mapSize, cityStyle) {
  const map = [];
  for (let i = 0; i < mapSize; i++) {
    map.push([]);
    for (let j = 0; j < mapSize; j++) {
      // Create a grid-based city structure
      if (i % 10 === 0 || j % 10 === 0) {
        map[i].push('road'); // roads every 10 cells
      } else if (Math.random() < 0.3) {
        map[i].push('building'); // buildings with 30% probability
      } else if (Math.random() < 0.1) {
        map[i].push('park'); // parks with 10% probability
      } else {
        map[i].push('grass'); // grass otherwise
      }
    }
  }

  // Add some randomness and variation
  for (let i = 1; i < mapSize - 1; i++) {
    for (let j = 1; j < mapSize - 1; j++) {
      if (map[i][j] === 'building' && Math.random() < 0.2) {
        map[i][j] = 'skyscraper'; // 20% chance of upgrading to skyscraper
      } else if (map[i][j] === 'grass' && Math.random() < 0.1) {
        map[i][j] = 'tree'; // 10% chance of adding a tree
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
    case 'building':
      return 'lightgray';
    case 'skyscraper':
      return 'darkgray';
    case 'tree':
      return 'darkgreen';
    default:
      return 'gray';
  }
}

function generateMap(cityStyle) {
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

    // Update city info component
    const cityInfoComponent = document.querySelector('city-info');
    cityInfoComponent.cityData = {
      name: 'New City',
      population: 100000,
    };
  } catch (error) {
    console.error(error);
    alert(`Error generating map: ${error.message}`);
  }
}

function init() {
  mapContainer = document.getElementById('map-container');
  cityInfoContainer = document.getElementById('city-info');

  // Add event listener for the "Generate Map" button
  document.getElementById('generate-button').addEventListener('click', () => {
    const cityStyle = document.getElementById('style-select').value;
    generateMap(cityStyle);
  });

  generateMap(cityStyle);
}

init();

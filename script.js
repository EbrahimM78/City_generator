document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.getElementById('generate-button');
  const styleSelect = document.getElementById('style-select');
  const mapContainer = document.getElementById('map-container');

  generateButton.addEventListener('click', () => {
    const cityStyle = styleSelect.value;
    const mapSize = 120;

    // Generate the city map using a modified version of your implementation
    const map = generateCityMap(mapSize, cityStyle);

    // Create a canvas element
    const canvasElement = document.createElement('canvas');
    canvasElement.width = mapContainer.offsetWidth; // set width to container width
    canvasElement.height = mapContainer.offsetHeight; // set height to container height
    const ctx = canvasElement.getContext('2d');

    const scaleFactor = Math.min(canvasElement.width / mapSize, canvasElement.height / mapSize);
    const tileSize = scaleFactor * 12; // adjust tileSize based on canvas size

    // Draw the city map on the canvas
    for (let i = 0; i < mapSize; i++) {
      for (let j = 0; j < mapSize; j++) {
        const terrainType = map[i][j];
        const color = getTerrainColor(terrainType);
        ctx.fillStyle = color;
        ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
      }
    }

    // Add the generated image to the map container
    const image = document.createElement('img');
    image.src = canvasElement.toDataURL();
    mapContainer.replaceChildren(); // clear the container
    mapContainer.appendChild(image);
  });
});

// Modified version of your generateCityMap function
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
        map[i][j] = 'kyscraper'; // 20% chance of upgrading to skyscraper
      } else if (map[i][j] === 'grass' && Math.random() < 0.1) {
        map[i][j] = 'tree'; // 10% chance of adding a tree
      }
    }
  }

  return map;
}

// Modified version of your getTerrainColor function
function getTerrainColor(terrainType) {
  switch (terrainType) {
    case 'water':
      return 'blue';
    case 'grass':
      return 'green';
    case 'road':
      return 'gray';
    case 'building':
      return 'brown';
    case 'kyscraper':
      return 'darkgray';
    case 'park':
      return 'lightgreen';
    case 'tree':
      return 'darkgreen';
    default:
      return 'white';
  }
}

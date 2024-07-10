// Get the HTML elements
const generateButton = document.getElementById('generate-button');
const styleSelect = document.getElementById('style-select');
const canvasElement = document.getElementById('canvas');

// Define the terrain types and their corresponding colors
const terrainTypes = {
  'GRASS': '#32CD32',
  'WATER': '#0000FF',
  'ROAD': '#808080',
  'BUILDING': '#CCCCCC',
  'TREE': '#228B22'
};

// Define the city generation algorithm
function generateCityMap(mapSize, cityStyle) {
  const map = [];
  for (let i = 0; i < mapSize; i++) {
    map[i] = [];
    for (let j = 0; j < mapSize; j++) {
      // Randomly select a terrain type based on the city style
      let terrainType;
      switch (cityStyle) {
        case 'default':
          terrainType = getRandomTerrainType([0.5, 0.2, 0.1, 0.1, 0.1]);
          break;
        case 'urban':
          terrainType = getRandomTerrainType([0.2, 0.5, 0.1, 0.1, 0.1]);
          break;
        case 'rural':
          terrainType = getRandomTerrainType([0.8, 0.1, 0.05, 0.05, 0]);
          break;
        default:
          terrainType = getRandomTerrainType([0.5, 0.2, 0.1, 0.1, 0.1]);
      }
      map[i][j] = terrainType;
    }
  }
  return map;
}

// Helper function to get a random terrain type based on probabilities
function getRandomTerrainType(probabilities) {
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < probabilities.length; i++) {
    cumulativeProbability += probabilities[i];
    if (randomValue < cumulativeProbability) {
      return Object.keys(terrainTypes)[i];
    }
  }
  return Object.keys(terrainTypes)[0];
}

// Helper function to get the color for a terrain type
function getTerrainColor(terrainType) {
  return terrainTypes[terrainType];
}

// Event listener for the generate button
generateButton.addEventListener('click', () => {
  const cityStyle = styleSelect.value;
  const mapSize = 120; // number of tiles in the map
  const canvasElement = document.getElementById('canvas');
  const ctx = canvasElement.getContext('2d');

  // Calculate the tileSize based on the canvas size and map size
  const canvasWidth = canvasElement.offsetWidth;
  const canvasHeight = canvasElement.offsetHeight;
  const tileSize = Math.min(canvasWidth / mapSize, canvasHeight / mapSize);

  // Generate the city map
  const map = generateCityMap(mapSize, cityStyle);

  // Draw the city map on the canvas
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      const terrainType = map[i][j];
      const color = getTerrainColor(terrainType);
      ctx.fillStyle = color;
      ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
});

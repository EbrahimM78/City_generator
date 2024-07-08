const express = require('express');
const app = express();
const canvas = require('canvas');

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

app.get('/generate-map', (req, res) => {
  const cityStyle = req.query.style;
  const mapSize = 64;
  const tileSize = 10;

  // Generate the city map using your implementation
  const map = generateCityMap(mapSize, cityStyle);

  // Create a canvas element
  const canvasElement = canvas.createCanvas(mapSize * tileSize, mapSize * tileSize);
  const ctx = canvasElement.getContext('2d');

  // Draw the city map on the canvas
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      const terrainType = map[i][j];
      const color = getTerrainColor(terrainType);
      ctx.fillStyle = color;
      ctx.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }

  // Return the generated image as a response
  const imageData = canvasElement.toBuffer();
  res.set('Content-Type', 'image/png');
  res.set('Content-Disposition', `attachment; filename="city-map-${cityStyle}.png"`);
  res.send(imageData);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

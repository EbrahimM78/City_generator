let mapContainer;
let canvas;
let ctx;
let mapSize = 20;
let tileSize = 20;
let cityStyle = 'modern';

function generateCityMap(mapSize, cityStyle) {
  const map = [];
  for (let i = 0; i < mapSize; i++) {
    map[i] = [];
    for (let j = 0; j < mapSize; j++) {
      const terrainType = Math.floor(Math.random() * 3);
      map[i][j] = {
        terrainType,
        building: null,
      };
    }
  }

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      const terrainColor = getTerrainColor(map[i][j].terrainType);
      if (cityStyle === 'medieval' && i === 0 || i === mapSize - 1 || j === 0 || j === mapSize - 1) {
        map[i][j].building = {
          type: 'castle',
          color: 'purple',
        };
      } else if (cityStyle === 'modern' && (i === 0 || i === mapSize - 1 || j === 0 || j === mapSize - 1)) {
        map[i][j].building = {
          type: 'skyscraper',
          color: 'grey',
        };
      } else if (cityStyle === 'futuristic' && (i === 0 || i === mapSize - 1 || j === 0 || j === mapSize - 1)) {
        map[i][j].building = {
          type: 'flying-building',
          color: 'blue',
        };
      }
      if (map[i][j].building) {
        map[i][j].color = map[i][j].building.color;
      } else {
        map[i][j].color = terrainColor;
      }
    }
  }

  return map;
}

function getTerrainColor(terrainType) {
  switch (terrainType) {
    case 0:
      return 'green';
    case 1:
      return 'brown';
    case 2:
      return 'blue';
    default:
      return 'green';
  }
}

function generateMap() {
  mapContainer = document.getElementById('map-container');
  canvas = document.createElement('canvas');
  canvas.width = mapSize * tileSize;
  canvas.height = mapSize * tileSize;
  ctx = canvas.getContext('2d');
  mapContainer.innerHTML = '';
  mapContainer.appendChild(canvas);

  const map = generateCityMap(mapSize, cityStyle);

  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      ctx.fillStyle = map[i][j].color;
      ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);

      if (map[i][j].building) {
        ctx.fillStyle = map[i][j].building.color;
        ctx.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);

        if (map[i][j].building.type === 'skyscraper') {
          ctx.fillStyle = 'black';
          ctx.fillRect(j * tileSize + 2, i * tileSize + 2, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 12, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 22, tileSize - 4, 10);
        } else if (map[i][j].building.type === 'castle') {
          ctx.fillStyle = 'black';
          ctx.fillRect(j * tileSize + 2, i * tileSize + 2,tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 12, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 22, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 32, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 42, tileSize - 4, 10);
        } else if (map[i][j].building.type === 'flying-building') {
          ctx.fillStyle = 'black';
          ctx.fillRect(j * tileSize + 2, i * tileSize + 2, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 12, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 22, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 32, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 42, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 52, tileSize - 4, 10);
          ctx.fillRect(j * tileSize + 2, i * tileSize + 62, tileSize - 4, 10);
        }
      }
    }
  }
}

function updateMapStyle(style) {
  cityStyle = style;
  generateMap();
}

function init() {
  generateMap();

  // Add event listener for the "Generate Map" button
  document.getElementById('generate-button').addEventListener('click', generateMap);

  // Add event listener for the city style select
  document.getElementById('style-select').addEventListener('change', function() {
    updateMapStyle(this.value);
  });
}

init();

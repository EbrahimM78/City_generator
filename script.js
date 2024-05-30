let canvas;
let ctx;
let mapContainer;

const mapSize = 100;
const tileSize = 10;
const cityStyle = 'modern';

function generateCityMap(mapSize, cityStyle) {
  const map = [];
  for (let i = 0; i < mapSize; i++) {
<<<<<<< HEAD
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
=======
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
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
      }
    }
  }

<<<<<<< HEAD
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

=======
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
  return map;
}

function getTerrainColor(terrainType) {
  switch (terrainType) {
<<<<<<< HEAD
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
=======
    case 0:
      return 'green';
    case 1:
      return 'brown';
    case 2:
      return 'blue';
    default:
      return 'green';
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
  }
}

function generateMap() {
<<<<<<< HEAD
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
=======
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
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
      }
    }
  }
}

<<<<<<< HEAD
    mapContainer.replaceChildren(); // clear the container
    mapContainer.appendChild(canvas);
  } catch (error) {
    console.error(error);
    alert(`Error generating map: ${error.message}`);
  }
}

function init() {
  mapContainer = document.getElementById('map-container');
=======
function updateMapStyle(style) {
  cityStyle = style;
  generateMap();
}

function init() {
  generateMap();
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58

  // Add event listener for the "Generate Map" button
  document.getElementById('generate-button').addEventListener('click', generateMap);

<<<<<<< HEAD
  generateMap();
=======
  // Add event listener for the city style select
  document.getElementById('style-select').addEventListener('change', function() {
    updateMapStyle(this.value);
  });
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
}

init();

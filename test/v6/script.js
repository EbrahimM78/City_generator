let mapContainer;
let canvas;
let ctx;
let mapSize = 20;
let tileSize = 20;
let cityStyle = 'modern';

function generateCityMap(mapSize, cityStyle) {
    const map = [];
    for (let i = 0; i < mapSize; i++) {
        map.push([]);
        for (let j = 0; j < mapSize; j++) {
            if (i === 0 || j === 0 || i === mapSize - 1 || j === mapSize - 1) {
                map[i].push('water');
            } else {
                map[i].push('grass');
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
        default:
            return 'gray';
    }
}

<<<<<<< HEAD
function generateMap() {
    try {
        const map = generateCityMap(mapSize, cityStyle);

        const mapImage = new Image();
        mapImage.onload = function() {
            mapContainer.replaceChildren(); // clear the container
            mapContainer.appendChild(mapImage);
        };
        mapImage.src = renderMap(map);
    } catch (error) {
        console.error(error);
        alert(`Error generating map: ${error.message}`);
    }
}

=======
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
function renderMap(mapData) {
    const canvas = document.createElement('canvas');
    canvas.width = mapSize * tileSize;
    canvas.height = mapSize * tileSize;
    const ctx = canvas.getContext('2d');

<<<<<<< HEAD
    for (let i = 0; i < mapData.length; i++) {
        for (let j = 0; j < mapData[i].length; j++) {
            const terrainType = mapData[i][j];
            const color = getTerrainColor(terrainType);
=======
    const colors = {
        water: 'blue',
        grass: 'green',
    };

    for (let i = 0; i < mapData.length; i++) {
        for (let j = 0; j < mapData[i].length; j++) {
            const terrainType = mapData[i][j];
            const color = colors[terrainType];
>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
            const x = i * tileSize;
            const y = j * tileSize;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }

    return canvas.toDataURL();
}

<<<<<<< HEAD
=======
function generateMap() {
    try {
        const map = generateCityMap(mapSize, cityStyle);

        const mapImage = new Image();
        mapImage.onload = function() {
            mapContainer.replaceChildren(); // clear the container
            mapContainer.appendChild(mapImage);
        };
        mapImage.src = renderMap(map);
    } catch (error) {
        console.error(error);
        alert(`Error generating map: ${error.message}`);
    }
}

>>>>>>> 513c92f44a213263d22619dc4fdbe8792750ff58
function init() {
    mapContainer = document.getElementById('map-container');
    generateMap();
}

init();

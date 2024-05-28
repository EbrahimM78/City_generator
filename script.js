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

function generateMap() {
    try {
        const map = generateCityMap(mapSize, cityStyle);

        const canvas = document.createElement('canvas');
        canvas.width = mapSize * tileSize;
        canvas.height = mapSize * tileSize;
        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = false; // Disable anti-aliasing

        const imageData = new Uint8ClampedArray(mapSize * mapSize * 4);
        for (let i = 0; i < mapSize; i++) {
            for (let j = 0; j < mapSize; j++) {
                const terrainType = map[i][j];
                const color = getTerrainColor(terrainType);
                const r = color === 'blue' ? 0 : color === 'green' ? 128 : 255;
                const g = color === 'blue' ? 0 : color === 'green' ? 128 : 255;
                const b = color === 'blue' ? 255 : color === 'green' ? 128 : 255;
                imageData[(i * mapSize * 4) + (j * 4) + 0] = r;
                imageData[(i * mapSize * 4) + (j * 4) + 1] = g;
                imageData[(i * mapSize * 4) + (j * 4) + 2] = b;
                imageData[(i * mapSize * 4) + (j * 4) + 3] = 255;
            }
        }
        ctx.putImageData(new ImageData(imageData, mapSize, mapSize), 0, 0);

        const mapImage = new Image();
        mapImage.onload = function() {
            mapContainer.replaceChildren(); // clear the container
            mapContainer.appendChild(mapImage);
        };
        mapImage.src = canvas.toDataURL();
    } catch (error) {
        console.error(error);
        alert(`Error generating map: ${error.message}`);
    }
}

function init() {
    mapContainer = document.getElementById('map-container');
    generateMap();
}

init();

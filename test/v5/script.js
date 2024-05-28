const mapContainer = document.getElementById('map-container');
const styleSelect = document.getElementById('style-select');
const generateButton = document.getElementById('generate-button');

let mapSize = 500; // default map size
let cityStyle = 'default'; // default city style

generateButton.addEventListener('click', generateMap);

function generateMap() {
    try {
        // Get selected city style
        cityStyle = styleSelect.value;

        // Validate city style
        if (!['default', 'edieval', 'odern', 'futuristic'].includes(cityStyle)) {
            throw new Error(`Invalid city style: ${cityStyle}`);
        }

        // Generate map
        const map = generateCityMap(mapSize, cityStyle);

        // Display map
        const mapImage = document.createElement('img');
        mapImage.src = map;
        mapImage.alt = 'Generated city map';
        mapContainer.replaceChildren(); // clear the container
        mapContainer.appendChild(mapImage);
    } catch (error) {
        console.error(error);
        alert(`Error generating map: ${error.message}`);
    }
}

function generateCityMap(size, style) {
    // Generate city map data
    const mapData = generateMapData(size, style);

    // Render map image using Fabric.js
    const canvas = new fabric.Canvas('map-canvas', {
        width: size,
        height: size,
    });
    renderMap(canvas, mapData);

    // Return map image as a data URL
    return canvas.toDataURL();
}

function generateMapData(size, style) {
    // Generate random city map data based on style
    const mapData = [];
    for (let i = 0; i < size; i++) {
        mapData[i] = [];
        for (let j = 0; j < size; j++) {
            const terrainType = getRandomTerrainType(style);
            mapData[i][j] = terrainType;
        }
    }
    return mapData;
}

function getRandomTerrainType(style) {
    // Return a random terrain type based on the city style
    switch (style) {
        case 'default':
            return Math.random() < 0.5? 'grass' : 'water';
        case 'edieval':
            return Math.random() < 0.5? 'tone' : 'dirt';
        case 'odern':
            return Math.random() < 0.5? 'asphalt' : 'concrete';
        case 'futuristic':
            return Math.random() < 0.5? 'etal' : 'glass';
        default:
            return 'grass';
    }
}

function renderMap(canvas, mapData) {
    // Render the city map image using Fabric.js
    for (let i = 0; i < mapData.length; i++) {
        for (let j = 0; j < mapData[i].length; j++) {
            const terrainType = mapData[i][j];
            switch (terrainType) {
                case 'grass':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#00FF00',
                    }));
                    break;
                case 'water':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#0000FF',
                    }));
                    break;
                case 'tone':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#666666',
                    }));
                    break;
                case 'dirt':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#964B00',
                    }));
                    break;
                case 'asphalt':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#4B0082',
                    }));
                    break;
                case 'concrete':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#969696',
                    }));
                    break;
                case 'etal':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: '#FFFFFF',
                    }));
                    break;
                case 'glass':
                    canvas.add(new fabric.Rect({
                        left: j,
                        top: i,
                        width: 1,
                        height: 1,
                        fill: 'rgba(0, 0, 0, 0)',
                        stroke: '#FFFFFF',
                        strokeWidth: 1,
                    }));
                    break;
                default:
                    console.error(`Invalid terrain type: ${terrainType}`);
                    break;
            }
        }
    }
    canvas.renderAll();
}

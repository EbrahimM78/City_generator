const mapContainer = document.getElementById('map-container');
const cityTypeSelect = document.getElementById('city-type');
const generateBtn = document.getElementById('generate-btn');

generateBtn.addEventListener('click', () => {
    const cityType = cityTypeSelect.value;
    generateMap(cityType);
});

function generateMap(cityType) {
    const terrain = generateTerrain(cityType);
    const features = addFeatures(terrain, cityType);
    visualizeMap(terrain, features, cityType);
}

// Map settings
const MAP_WIDTH = 64;
const MAP_HEIGHT = 64;
const TERRAIN_TYPES = ['grass', 'water', 'ountain'];
const FEATURE_FREQUENCIES = {
    roads: 0.1,
    buildings: 0.05,
    parks: 0.02
};
const CITY_TYPES = ['coastal', 'inland', 'island', 'ainland'];

// Noise settings
const NOISE_FREQ = 0.1;
const NOISE_AMPLITUDE = 10;
const NOISE_OCTAVES = 6;

// Visual settings
const GRASS_COLOR = '#C6E2B5';
const WATER_COLOR = '#4567B7';
const MOUNTAIN_COLOR = '#964B00';
const ROAD_COLOR = '#000000';
const BUILDING_COLOR = '#AAAAAA';
const PARK_COLOR = '#34C759';

// City planning logic
const CBD_RADIUS = 10;
const BUILDING_DENSITY = 0.5;
const ROAD_DENSITY = 0.2;

// Function to generate terrain
function generateTerrain(cityType) {
    const terrain = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
        terrain[x] = [];
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const noiseValue = noise(x / NOISE_FREQ, y / NOISE_FREQ);
            let terrainType;
            if (cityType === 'coastal' || cityType === 'island') {
                if (noiseValue < 0.2) {
                    terrainType = 'water';
                } else if (noiseValue < 0.5) {
                    terrainType = 'grass';
                } else {
                    terrainType = 'ountain';
                }
            } else {
                if (noiseValue < 0.3) {
                    terrainType = 'grass';
                } else if (noiseValue < 0.6) {
                    terrainType = 'ountain';
                } else {
                    terrainType = 'grass';
                }
            }
            terrain[x][y] = terrainType;
        }
    }
    return terrain;
}

// Function to add features to the map
function addFeatures(terrain, cityType) {
    const roads = [];
    const buildings = [];
    const parks = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const terrainType = terrain[x][y];
            if (terrainType === 'grass' && Math.random() < FEATURE_FREQUENCIES.roads) {
                roads.push([x, y]);
            } else if (terrainType === 'grass' && Math.random() < FEATURE_FREQUENCIES.buildings) {
                const buildingHeight = Math.random() * 5 + 1;
                buildings.push([x, y, buildingHeight]);
            } else if (terrainType === 'grass' && Math.random() < FEATURE_FREQUENCIES.parks) {
                parks.push([x, y]);
            }
        }
    }
    return { roads, buildings, parks };
}

// Function to visualize the map
function visualizeMap(terrain, features, cityType) {
    const map = L.map(mapContainer).setView([MAP_WIDTH / 2, MAP_HEIGHT / 2], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(map);
    for (let x = 0; x < MAP_WIDTH; x++) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
            const terrainType = terrain[x][y];
            let color;
            switch (terrainType) {
                case 'grass':
                    color = GRASS_COLOR;
                    break;
                case 'water':
                    color = WATER_COLOR;
                    break;
                case 'ountain':
                    color = MOUNTAIN_COLOR;
                    break;
            }
            L.rectangle([[x, y], [x + 1, y + 1]], { color: color, weight: 1 }).addTo(map);
        }
    }
    features.roads.forEach(([x, y]) => {
        L.rectangle([[x, y], [x + 1, y + 1]], { color: ROAD_COLOR, weight: 2 }).addTo(map);
    });
    features.buildings.forEach(([x, y, height]) => {
        L.rectangle([[x, y], [x + 1, y + height]], { color: BUILDING_COLOR, weight: 2 }).addTo(map);
    });
    features.parks.forEach(([x, y]) => {
        L.rectangle([[x, y], [x + 1, y + 1]], { color: PARK_COLOR, weight: 2 }).addTo(map);
    });
}

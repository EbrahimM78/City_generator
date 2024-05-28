import noise from 'opensimplex';
import * as L from 'leaflet';

// Map settings
const MAP_WIDTH = 64;
const MAP_HEIGHT = 64;
const TERRAIN_TYPES = ['grass', 'water', 'mountain'];
const FEATURE_FREQUENCIES = {
    roads: 0.1,
    buildings: 0.05,
    parks: 0.02
};
const CITY_TYPES = ['coastal', 'inland', 'island', 'mainland'];

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
                    terrainType = 'mountain';
                }
            } else {
                if (noiseValue < 0.3) {
                    terrainType = 'grass';
                } else if (noiseValue < 0.6) {
                    terrainType = 'mountain';
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
        for (let y = 0; y < MAP_HEIGHT;y++) {
            const terrainType = terrain[x][y];
            if (terrainType === 'grass' && Math.random() < FEATURE_FREQUENCIES.roads) {
                roads.push([x, y]);
            } else if (terrainType === 'grass' && Math.random() < FEATURE_FREQUENCIES.buildings) {
                const buildingHeight = Math.random() * 10;
                const buildingColor = `#${Math.floor(buildingHeight * 255 / 10).toString(16)}${Math.floor(buildingHeight * 255 / 10).toString(16)}${Math.floor(buildingHeight * 255 / 10).toString(16)}`;
                buildings.push([x, y, buildingHeight, buildingColor]);
            } else if (terrainType === 'grass' && Math.random() < FEATURE_FREQUENCIES.parks) {
                parks.push([x, y]);
            }
        }
    }
    return { roads, buildings, parks };
}

// Function to visualize the map using Leaflet.js
function visualizeMap(terrain, features, cityType) {
    const map = L.map('map-container').setView([40, -74], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Add terrain layers
    const grassLayer = L.geoJSON(terrain.map((row, x) => row.map((cell, y) => {
        if (cell === 'grass') {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [x, y]
                },
                properties: {
                    color: GRASS_COLOR
                }
            };
        }
        return null;
    }).filter(Boolean)), {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 2,
                fillColor: feature.properties.color,
                fillOpacity: 1,
                stroke: false
            });
        }
    }).addTo(map);

    const mountainLayer = L.geoJSON(terrain.map((row, x) => row.map((cell, y) => {
        if (cell === 'ountain') {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [x, y]
                },
                properties: {
                    color: MOUNTAIN_COLOR
                }
            };
        }
        return null;
    }).filter(Boolean)), {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 2,
                fillColor: feature.properties.color,
                fillOpacity: 1,
                stroke: false
            });
        }
    }).addTo(map);

    const waterLayer = L.geoJSON(terrain.map((row, x) => row.map((cell, y) => {
        if (cell === 'water') {
            return {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [x, y]
                },
                properties: {
                    color: WATER_COLOR
                }
            };
        }
        return null;
    }).filter(Boolean)), {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 2,
                fillColor: feature.properties.color,
                fillOpacity: 1,
                stroke: false
            });
        }
    }).addTo(map);

    // Add features layers
    const roadsLayer = L.geoJSON(features.roads.map(coord => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coord
            },
            properties: {
                color: ROAD_COLOR
            }
        };
    }), {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 2,
                fillColor: feature.properties.color,
                fillOpacity: 1,
                stroke: false
            });
        }
    }).addTo(map);

    const buildingsLayer = L.geoJSON(features.buildings.map(([x, y, height, color]) => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [x, y]
            },
            properties: {
                height,
                color
            }
        };
    }), {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 4,
                fillColor: feature.properties.color,
                fillOpacity: 1,
                stroke: false
            });
        }
    }).addTo(map);

    const parksLayer = L.geoJSON(features.parks.map(coord => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: coord
            },
            properties: {
                color: PARK_COLOR
            }
        };
    }), {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 2,
                fillColor: feature.properties.color,
                fillOpacity: 1,
                stroke: false
            });
        }
    }).addTo(map);

    // Add legend
    const legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const types = ['Terrain', 'Roads', 'Buildings', 'Parks'];
        const colors = [GRASS_COLOR, MOUNTAIN_COLOR, WATER_COLOR, ROAD_COLOR, BUILDING_COLOR, PARK_COLOR];
        const labels = ['Grass', 'Mountain', 'Water', 'Road', 'Building', 'Park'];

        for (let i = 0; i < types.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                (types[i] ? types[i] : '') + '<br>';
        }
        return div;
    };
    legend.addTo(map);
}

document.addEventListener('DOMContentLoaded', initMap);

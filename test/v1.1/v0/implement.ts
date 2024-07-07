import noise from 'opensimplex';
import * as L from 'leaflet';

// Map settings
const MAP_WIDTH: number = 64;
const MAP_HEIGHT: number = 64;
const TERRAIN_TYPES: string[] = ['grass', 'water', 'mountain'];
const FEATURE_FREQUENCIES: { [key: string]: number } = {
  roads: 0.1,
  buildings: 0.05,
  parks: 0.02
};
const CITY_TYPES: string[] = ['coastal', 'inland', 'island', 'mainland'];

// Noise settings
const NOISE_FREQ: number = 0.1;
const NOISE_AMPLITUDE: number = 10;
const NOISE_OCTAVES: number = 6;

// Visual settings
const GRASS_COLOR: string = '#C6E2B5';
const WATER_COLOR: string = '#4567B7';
const MOUNTAIN_COLOR: string = '#964B00';
const ROAD_COLOR: string = '#000000';
const BUILDING_COLOR: string = '#AAAAAA';
const PARK_COLOR: string = '#228B22';

// City planning logic
const CBD_RADIUS: number = 10;
const BUILDING_DENSITY: number = 0.5;
const ROAD_DENSITY: number = 0.2;

// Function to generate terrain
function generateTerrain(cityType: string): string[][] {
  const terrain: string[][] = [];
  for (let x = 0; x < MAP_WIDTH; x++) {
    terrain[x] = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      const noiseValue = noise(x / NOISE_FREQ, y / NOISE_FREQ);
      let terrainType: string;
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
function addFeatures(terrain: string[][], cityType: string): { roads: number[][], buildings: number[][], parks: number[][] } {
  const roads: number[][] = [];
  const buildings: number[][] = [];
  const parks: number[][] = [];
  for (let x = 0; x < MAP_WIDTH; x++) {
    for (let y = 0; y < MAP_HEIGHT; y++) {
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
function visualizeMap(terrain: string[][], features: { roads: number[][], buildings: number[][], parks: number[][] }, cityType: string): void {
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
    if (cell === 'mountain') {
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
}

// Function to generate city map
function generateCityMap(cityType: string): void {
  const terrain = generateTerrain(cityType);
  const features = addFeatures(terrain, cityType);
  visualizeMap(terrain, features, cityType);
}

// Function to add control elements for city type
function addCityTypeControl(cityType: string): void {
  const cityTypeControl = document.getElementById('city-type');
  const option = document.createElement('option');
  option.value = cityType;
  option.textContent = cityType.charAt(0).toUpperCase() + cityType.slice(1);
  cityTypeControl.appendChild(option);
}

// Add initial city type options
addCityTypeControl('coastal');
addCityTypeControl('inland');
addCityTypeControl('island');
addCityTypeControl('mainland');

// Event listener for city type selection
document.getElementById('city-type').addEventListener('change', (event: Event) => {
  generateCityMap(event.target.value);
});

// Generate initial city map
generateCityMap('coastal');

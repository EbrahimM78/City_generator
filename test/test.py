#!/usr/bin/env python3
import numpy as np
import noise
import matplotlib.pyplot as plt
from PIL import Image

# Parameters
width, height = 256, 256
scale = 100.0
octaves = 6
persistence = 0.5
lacunarity = 2.0
seed = np.random.randint(0, 100)

# Generate terrain using Perlin noise
def generate_terrain(width, height, scale, octaves, persistence, lacunarity, seed):
    terrain = np.zeros((height, width))
    for i in range(height):
        for j in range(width):
            terrain[i][j] = noise.pnoise2(i/scale,
                                          j/scale,
                                          octaves=octaves,
                                          persistence=persistence,
                                          lacunarity=lacunarity,
                                          repeatx=width,
                                          repeaty=height,
                                          base=seed)
    return (terrain - np.min(terrain)) / (np.max(terrain) - np.min(terrain))

# Add rivers to the terrain
def add_rivers(terrain, num_rivers=3):
    for _ in range(num_rivers):
        x, y = np.random.randint(0, terrain.shape[1]), np.random.randint(0, terrain.shape[0])
        for _ in range(1000):
            terrain[y, x] = 0  # Set to low elevation to represent water
            direction = np.random.choice(['left', 'right', 'up', 'down'])
            if direction == 'left' and x > 0:
                x -= 1
            elif direction == 'right' and x < terrain.shape[1] - 1:
                x += 1
            elif direction == 'up' and y > 0:
                y -= 1
            elif direction == 'down' and y < terrain.shape[0] - 1:
                y += 1
    return terrain

# Add lakes to the terrain
def add_lakes(terrain, num_lakes=5, lake_size=10):
    for _ in range(num_lakes):
        x, y = np.random.randint(0, terrain.shape[1]), np.random.randint(0, terrain.shape[0])
        for i in range(max(0, y - lake_size // 2), min(terrain.shape[0], y + lake_size // 2)):
            for j in range(max(0, x - lake_size // 2), min(terrain.shape[1], x + lake_size // 2)):
                terrain[i, j] = 0  # Set to low elevation to represent water
    return terrain

# Add hills to the terrain
def add_hills(terrain, num_hills=10, hill_height=0.1, hill_radius=5):
    for _ in range(num_hills):
        x, y = np.random.randint(0, terrain.shape[1]), np.random.randint(0, terrain.shape[0])
        for i in range(max(0, y - hill_radius), min(terrain.shape[0], y + hill_radius)):
            for j in range(max(0, x - hill_radius), min(terrain.shape[1], x + hill_radius)):
                distance = np.sqrt((i - y) ** 2 + (j - x) ** 2)
                if distance < hill_radius:
                    terrain[i, j] += hill_height * (1 - (distance / hill_radius))
    return terrain

# Add forests to the terrain
def add_forests(terrain, num_forests=5, forest_size=20):
    forests = np.zeros_like(terrain)
    for _ in range(num_forests):
        x, y = np.random.randint(0, terrain.shape[1]), np.random.randint(0, terrain.shape[0])
        for i in range(max(0, y - forest_size // 2), min(terrain.shape[0], y + forest_size // 2)):
            for j in range(max(0, x - forest_size // 2), min(terrain.shape[1], x + forest_size // 2)):
                forests[i, j] = 1  # Mark as forest
    return forests

# Generate roads with a more complex pattern
def generate_roads(width, height, main_road_spacing=32, secondary_road_spacing=16):
    roads = np.zeros((height, width))
    
    # Main roads
    for i in range(0, height, main_road_spacing):
        roads[i, :] = 1
    for j in range(0, width, main_road_spacing):
        roads[:, j] = 1
    
    # Secondary roads
    for i in range(0, height, secondary_road_spacing):
        if i % main_road_spacing != 0:
            roads[i, :] = 0.5
    for j in range(0, width, secondary_road_spacing):
        if j % main_road_spacing != 0:
            roads[:, j] = 0.5

    return roads

# Place buildings along roads with different zones and types
def place_buildings(terrain, roads, residential_chance=0.05, commercial_chance=0.03, industrial_chance=0.02):
    buildings = np.zeros_like(terrain)
    height, width = terrain.shape
    for i in range(1, height - 1):
        for j in range(1, width - 1):
            if roads[i, j] == 1 and terrain[i, j] < 0.5:  # Main road zones
                if np.random.rand() < residential_chance:
                    buildings[i, j] = 1  # Residential
            elif roads[i, j] == 0.5 and terrain[i, j] < 0.5:  # Secondary road zones
                rand_val = np.random.rand()
                if rand_val < residential_chance:
                    buildings[i, j] = 1  # Residential
                elif rand_val < residential_chance + commercial_chance:
                    buildings[i, j] = 2  # Commercial
                elif rand_val < residential_chance + commercial_chance + industrial_chance:
                    buildings[i, j] = 3  # Industrial
    return buildings

# Elevation-based coloring for buildings
def elevation_based_building_color(buildings, terrain):
    building_colors = np.zeros((*buildings.shape, 3))
    for i in range(buildings.shape[0]):
        for j in range(buildings.shape[1]):
            if buildings[i, j] == 1:  # Residential
                building_colors[i, j] = [0, 0, 1]  # Blue
            elif buildings[i, j] == 2:  # Commercial
                building_colors[i, j] = [0, 1, 0]  # Green
            elif buildings[i, j] == 3:  # Industrial
                building_colors[i, j] = [1, 0, 0]  # Red
            if buildings[i, j] != 0:
                elevation_factor = terrain[i, j]
                building_colors[i, j] = [min(1, elevation_factor + color) for color in building_colors[i, j]]
    return building_colors

# Visualize map and save as JPEG
def visualize_map(terrain, roads, buildings, forests, filename="generated_map.jpg"):
    fig, ax = plt.subplots(figsize=(12, 12))
    ax.imshow(terrain, cmap='terrain', interpolation='nearest')
    
    # Overlay roads
    road_mask = roads == 1
    ax.imshow(np.ma.masked_where(~road_mask, roads), cmap='gray', alpha=0.7)
    
    # Overlay secondary roads
    secondary_road_mask = roads == 0.5
    ax.imshow(np.ma.masked_where(~secondary_road_mask, roads), cmap='gray', alpha=0.4)
    
    # Overlay buildings with elevation-based coloring
    building_colors = elevation_based_building_color(buildings, terrain)
    ax.imshow(building_colors, alpha=0.8)
    
    # Overlay forests
    forest_mask = forests == 1
    ax.imshow(np.ma.masked_where(~forest_mask, forests), cmap='Greens', alpha=0.3)
    
    plt.colorbar(ax.imshow(terrain, cmap='terrain', interpolation='nearest'), ax=ax)
    plt.savefig(filename)
    plt.show()

# Main function
def main():
    terrain = generate_terrain(width, height, scale, octaves, persistence, lacunarity, seed)
    terrain = add_rivers(terrain)
    terrain = add_lakes(terrain)
    terrain = add_hills(terrain)
    forests = add_forests(terrain)
    roads = generate_roads(width, height)
    buildings = place_buildings(terrain, roads)
    visualize_map(terrain, roads, buildings, forests)

if __name__ == "__main__":
    main()


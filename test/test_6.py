#!/usr/bin/env python3

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from matplotlib.patches import Patch
import cv2

# Generate Perlin noise
def generate_perlin_noise(size, scale=100.0):
    def f(t):
        return 6*t**5 - 15*t**4 + 10*t**3

    delta = (scale / size)
    d = (size // scale)
    grid = np.mgrid[0:scale:delta, 0:scale:delta].transpose(1, 2, 0) % 1
    angles = 2 * np.pi * np.random.rand(size, size)
    gradients = np.dstack((np.cos(angles), np.sin(angles)))
    grid_x, grid_y = grid[..., 0], grid[..., 1]
    n00 = np.sum(np.dstack((grid_x, grid_y)) * gradients, axis=2)
    t = f(grid)
    n0 = n00
    return np.sqrt(2) * n0


# Map size and parameters
size = 256
scale = 10
noise = generate_perlin_noise(size, scale)

# Normalize noise
noise = (noise - noise.min()) / (noise.max() - noise.min())

# Define terrain layers
terrain = np.zeros((size, size, 3))
terrain[noise < 0.3] = [0.0, 0.0, 0.5]  # Water
terrain[(noise >= 0.3) & (noise < 0.4)] = [0.0, 0.5, 0.0]  # Lowland
terrain[(noise >= 0.4) & (noise < 0.6)] = [0.5, 0.5, 0.0]  # Grassland
terrain[(noise >= 0.6) & (noise < 0.8)] = [0.5, 0.25, 0.0]  # Forest
terrain[noise >= 0.8] = [0.5, 0.5, 0.5]  # Mountain

# Add buildings and roads
def add_buildings_and_roads(terrain, num_buildings=5, num_roads=3):
    buildings = np.zeros((size, size, 3))
    roads = np.zeros((size, size, 3))

    for _ in range(num_buildings):
        x, y = np.random.randint(0, size, 2)
        while terrain[y, x, 0] == 0.0:  # Ensure buildings are not in water
            x, y = np.random.randint(0, size, 2)
        cv2.rectangle(buildings, (x-2, y-2), (x+2, y+2), (0, 0, 1), -1)

    for _ in range(num_roads):
        x1, y1 = np.random.randint(0, size, 2)
        x2, y2 = np.random.randint(0, size, 2)
        cv2.line(roads, (x1, y1), (x2, y2), (1, 1, 1), 2)

    return terrain + buildings + roads

terrain = add_buildings_and_roads(terrain)

# Clip terrain values to the valid range for imshow
terrain = np.clip(terrain, 0, 1)

plt.imshow(terrain)
plt.show()

# Save the generated map as a PNG
plt.imsave('generated_map.png', terrain)

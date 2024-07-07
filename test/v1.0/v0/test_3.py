#!/usr/bin/env python3
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.colors import ListedColormap, BoundaryNorm
from matplotlib.patches import Patch

# Generate Perlin noise
def generate_perlin_noise(size, scale=100.0):
    def f(t):
        return 6*t**5 - 15*t**4 + 10*t**3
    
    delta = (scale / size)
    d = (size // scale)
    grid = np.mgrid[0:scale:delta, 0:scale:delta].transpose(1, 2, 0) % 1
    angles = 2 * np.pi * np.random.rand(int(scale) + 1, int(scale) + 1)
    gradients = np.dstack((np.cos(angles), np.sin(angles)))
    gradients = np.pad(gradients, ((0, 1), (0, 1), (0, 0)), mode='wrap')
    g00 = gradients[:-1, :-1]
    g10 = gradients[1:, :-1]
    g01 = gradients[:-1, 1:]
    g11 = gradients[1:, 1:]
    n00 = np.sum(np.dstack((grid[..., np.newaxis], -grid[..., np.newaxis])) * g00[None, None, :, :], 4)
    n10 = np.sum(np.dstack((grid - 1, -grid[..., np.newaxis])) * g10[None, None, :, :], 4)
    n01 = np.sum(np.dstack((grid[..., np.newaxis], 1 - grid[..., np.newaxis])) * g01[None, None, :, :], 4)
    n11 = np.sum(np.dstack((grid - 1, 1 - grid[..., np.newaxis])) * g11[None, None, :, :], 4)
    t = f(grid)
    n0 = n00 + t[..., 0] * (n10 - n00)
    n1 = n01 + t[..., 0] * (n11 - n01)
    return np.sqrt(2) * ((1 - t[..., 1]) * n0 + t[..., 1] * n1)

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
        cv2.line(roads, (x1, y1), (x2, y2), (0.5, 0.5, 0.5), 1)
    
    return buildings, roads

buildings, roads = add_buildings_and_roads(terrain)

# Combine terrain, buildings, and roads
combined_map = terrain + buildings + roads
combined_map = np.clip(combined_map, 0, 1)

# Plotting the map
fig, ax = plt.subplots(figsize=(10, 10))
im = ax.imshow(combined_map, interpolation='nearest')

# Add color bar
cmap = ListedColormap(['blue', 'green', 'yellow', 'darkgreen', 'grey'])
bounds = [0, 0.3, 0.4, 0.6, 0.8, 1]
norm = BoundaryNorm(bounds, cmap.N)
cb = fig.colorbar(im, ax=ax, cmap=cmap, norm=norm, boundaries=bounds, ticks=[0.15, 0.35, 0.5, 0.7, 0.9])
cb.ax.set_yticklabels(['Water', 'Lowland', 'Grassland', 'Forest', 'Mountain'])

# Add legend for buildings and roads
legend_elements = [Patch(facecolor='blue', edgecolor='blue', label='Building'),
                   Patch(facecolor='grey', edgecolor='grey', label='Road')]
ax.legend(handles=legend_elements, loc='lower right')

# Save and display map
plt.savefig('/mnt/data/detailed_map.png')
plt.show()


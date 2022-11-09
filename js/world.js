// A grid of metabolites

function getWorld(width, height, size, initialAmount = 0) {
  const grid = [];

  for (let x = 0; x < width; x++) {
    const col = [];
    for (let y = 0; y < height; y++) {
      col.push({ amount:randInt(100), delta: 0 });
    }
    grid.push(col);
  }

  // Add associations to each cell in the grid
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x < width - 1) {
        grid[x][y].right = grid[x + 1][y];
      }
      if (y < height - 1) {
        grid[x][y].below = grid[x][y + 1];
      }
    }
  }

  function display(ctx) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const value = grid[x][y].amount;
        ctx.fillStyle = `rgb(${120 + value}, 200, ${220 - value})`;
        ctx.fillRect(x * size, y * size, size, size);
      }
    }
  }

  function diffusion(rate = 0.002) {
    // Calculate difference between neighbouring cells in the grid
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {

        // Calculate horizontal diffusion
        if (x < width - 1) {
          const delta = (grid[x][y].amount - grid[x + 1][y].amount) * rate;
          grid[x][y].delta -= delta;
          grid[x + 1][y].delta += delta;
        }

        // Calculate verrtical diffusion
        if (y < height - 1) {
          const delta = (grid[x][y].amount - grid[x][y + 1].amount) * rate;
          grid[x][y].delta -= delta;
          grid[x][y + 1].delta += delta;
        }
      }
    }

    // Update cells
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        grid[x][y].amount += grid[x][y].delta;
        grid[x][y].delta = 0;
      }
    }
  }

  function getGridCell(x, y) {
    return grid[Math.floor(x / size)][Math.floor(y / size)];
  }

  return { grid, display, diffusion, getGridCell };
}
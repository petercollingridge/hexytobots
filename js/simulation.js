const Simulation = function(id) {
  const container = document.getElementById(id);
  if (!container) {
      console.error('No element found with id ' + id);
      return;
  }

  this.createInterface(container);
  this.toolbar = getToolbar(container);
  this.infobox = getMetaboliteInfo(this.controls);
  
  this.time = 0;
  this.speed = 5;
  this.light = this.getLight();
  this.world = getWorld(CANVAS_WIDTH / GRID_SIZE, CANVAS_HEIGHT / GRID_SIZE, GRID_SIZE);

  this.cells = [
    new Cell(this.world, 200, 100, 0.2, 0, 10, 100),
    new Cell(this.world, 250, 180, 0, 0, 10, 100),
  ];
};

Simulation.prototype.createInterface = function(container) {
  this.controls = createElement('div').addClass('sidebar').addTo(container);

  // Play / Pause button
  const runButton = this.controls.addElement('button').text('Run');
  runButton.addEventListener('click', () => {
    if (!this.animation) {
      runButton.text('Pause');
      this.run();
    } else {
      runButton.text('Run');
      this.stop();
    }
  });

  const stepButton = this.controls.addElement('button').text('Step');
  stepButton.addEventListener('click', () => {
    this.update();
    this.display();
  });

  const canvas = createElement('canvas')
    .attr({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    })
    .addEventListener('mouseup', (evt) => {
      // Get the coordinates in the world where user clicked
      const x = evt.offsetX;
      const y = evt.offsetY;

      this.selectedCell = this.findCellAtCoord(x, y);
      // Trigger an update even if the display is not updating
      if (this.selectedCell) {
          this.infobox.update(this.selectedCell);
      }
  })
    .addClass('sim-canvas')
    .addTo(container);

  this.ctx = canvas.element.getContext('2d');
}

Simulation.prototype.update = function() {
  this.time++;
  this.world.diffusion();

  this.light = this.getLight();
  callForEach(this.cells, 'update', this);

  // Remove dead cells
  for (let i = this.cells.length; i--;) {
    if (this.cells[i].dead) {
      const cell = this.cells[i];
      const gridCell = this.world.getGridCell(cell.x, cell.y);
      // All the cell's matter is returned to the world
      gridCell.amount += cell.sugar + cell.child + cell.starch + cell.starch2;
      this.cells.splice(i, 1);
    }
  }
};

// Calculate the light intensity based on the day/night cycle
Simulation.prototype.getLight = function() {
  return Math.max(0, Math.sin(this.time * Math.PI * 0.001) + 0.2) / 1.2;
}

Simulation.prototype.display = function() {
  this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.world.display(this.ctx);
  callForEach(this.cells, 'display', this.ctx);
  this.infobox.update(this.selectedCell);
  this.toolbar.update(this);
};

Simulation.prototype.setTimeout = function() {
  for (let i = 0; i < this.speed; i++) {
    this.update();
  }
  this.display();
  this.animation = setTimeout(this.setTimeout.bind(this), 20);
};

Simulation.prototype.run = function() {
  if (!this.animation) {
      this.setTimeout();
  }
};

Simulation.prototype.stop = function() {
  clearTimeout(this.animation);
  this.animation = false;
};

Simulation.prototype.addCell = function(x, y, angle, sugar, energy, starch) { 
  this.cells.push(
    new Cell(this.world , x, y, angle, sugar, energy, starch)
  );
}

Simulation.prototype.findCellAtCoord = function(x, y) {
  let selectedCell;

  for (let i = 0; i < this.cells.length; i++) {
    const cell = this.cells[i];
    const dx = cell.x - x;
    const dy = cell.y - y;

    const r = cell.r;
    if (dx * dx + dy * dy < r * r) {
      selectedCell = cell;
      break;
    }
  }

  return selectedCell;
}

const sim = new Simulation('sim');
sim.run();
sim.stop();

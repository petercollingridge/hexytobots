const Simulation = function(id) {
  const container = document.getElementById(id);
  if (!container) {
      console.error('No element found with id ' + id);
      return;
  }

  this.createInterface(container);

  this.time = 0;
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

  const canvas = createElement('canvas')
    .attr({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    })
    .addClass('sim-canvas')
    .addTo(container);

  this.ctx = canvas.element.getContext('2d');
}

Simulation.prototype.update = function() {
  this.time++;
  this.world.diffusion();

  const light = this.getLight();
  callForEach(this.cells, 'update', light);
};

// Calculate the light intensity based on the day/night cycle
Simulation.prototype.getLight = function() {
  return Math.max(0, Math.sin(this.time * 2 * Math.PI / 1000) + 0.2) / 1.2;
}

Simulation.prototype.display = function() {
  this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.world.display(this.ctx);
  callForEach(this.cells, 'display', this.ctx);
};

Simulation.prototype.setTimeout = function() {
  for (let i = 0; i < 5; i++) {
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

const sim = new Simulation('sim');
sim.run();
sim.stop();

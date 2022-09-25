const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const CELL_SIZE = 10;

const Simulation = function(id) {
  const container = document.getElementById(id);
  if (!container) {
      console.error('No element found with id ' + id);
      return;
  }

  const canvas = createElement('canvas')
    .attr({
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    })
    .addTo(container);

  this.ctx = canvas.element.getContext('2d');

  this.time = 0;
  this.cells = [
    new Cell(200, 100, 0.2, 100, 0),
    new Cell(250, 180, 0, 100, 0),
  ];
};

Simulation.prototype.update = function() {
  this.time++;
  this.cells.forEach((cell) => cell.update());
};

Simulation.prototype.display = function() {
  this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  this.cells.forEach((cell) => cell.display(this.ctx, CELL_SIZE));
};

Simulation.prototype.setTimeout = function() {
  this.update();
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

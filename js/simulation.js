const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const container = document.getElementById('sim');
const canvas = createElement('canvas')
  .attr({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  })
  .addTo(container);
const ctx = canvas.element.getContext('2d');

const cell = new Cell(200, 100, 0.1);
cell.display(ctx, 10);

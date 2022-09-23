const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const container = document.getElementById('sim');
const canvas = createElement('canvas')
  .attr({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  })
  .addTo(container);
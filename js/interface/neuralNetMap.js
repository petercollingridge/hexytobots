// Create an SVG map of a cell's neural net

function drawLineOfNodes(cx, nodes, height, r, svg) {
  let dy = height / (nodes.length + 1);
  for (let i = 0; i < nodes.length; i++) {
    const cy = (i + 1) * dy;
    createElement('circle', true)
      .attr({ r, cx, cy })
      .addClass('neural-net-node')
      .addTo(svg);
  }
}

function drawNNMap(cell, width = 160, height = 120) {
  const svg = createElement('svg', true).attr({ width, height });
  const r = 5;

  drawLineOfNodes(10, cell.inputs, height, r, svg);
  drawLineOfNodes(width / 2, cell.hiddenNodes, height, r, svg);
  drawLineOfNodes(width - 10, cell.enzymes, height, r, svg);

  return svg;
}

// Create an SVG map of a cell's neural net

function drawLineOfNodes(cx, nodes, height, r, svg) {
  let dy = height / (nodes.length + 1);
  const nodePositions = [];

  for (let i = 0; i < nodes.length; i++) {
    const cy = (i + 1) * dy;
    nodePositions.push([cx, cy]);
    createElement('circle', true)
      .attr({ r, cx, cy })
      .addClass('neural-net-node')
      .addTo(svg);
  }

  return nodePositions;
}

function drawNNMap(cell, width = 160, height = 120) {
  const svg = createElement('svg', true).attr({ width, height });
  const r = 5;

  const cxnGroup = createElement('g', true).addTo(svg);
  const nodeGroup = createElement('g', true).addTo(svg);

  const inputs = drawLineOfNodes(10, cell.inputs, height, r, nodeGroup);
  const hidden = drawLineOfNodes(width / 2, cell.hiddenNodes, height, r, nodeGroup);
  const output = drawLineOfNodes(width - 10, cell.enzymes, height, r, nodeGroup);

  const nodes = inputs.concat(hidden).concat(output);

  for (let i = 0; i < cell.connections.length; i++) {
    const cxn = cell.connections[i].id;
    const p1 = nodes[cxn[0]];
    const p2 = nodes[cxn[1]];
    createElement('line', true)
      .attr({
        x1: p1[0], y1: p1[1],
        x2: p2[0], y2: p2[1],
      })
      .addClass('neural-net-cxn')
      .addTo(cxnGroup);
  }

  return svg;
}

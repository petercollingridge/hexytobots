const Cell = function(world, x, y, angle, sugar, energy, starch) {
  this.age = 0;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.size = 8;
  // this.genome = genome;

  this.world = world;
  this.life = 100;
  this.sugar = sugar;
  this.energy = energy;
  this.starch = starch;
  this.starch2 = 0;
  this.child = 0;

  // Receptors which feed into the neural net
  this.inputs = [
    new Input(() => 1),
    new Input(() => this.light),
    new Input(() => this.life / 100),
    new Input(() => this.energy / 10),
    new Input(() => this.starch / 1000),
    new Input(() => this.starch2 / 1000),
    new Input(() => this.child / 100),
  ];

  this.enzymes = [
    new LifeEnzyme(this),
    new ChildEnzyme(this),
    new AnabolismEnzyme(this),
    new CatabolismEnzyme(this),
    new GiveToChildEnzyme(this),
    new TakeFromChildEnzyme(this),
  ];

  // Create n hidden nodes in the brain
  this.hiddenNodes = [];
  for (let i = 0; i < 4; i++) {
    this.hiddenNodes.push(new NeuralNetNode());
  }
  
  this.connections = this._getConnections();
};

Cell.prototype._getConnections = function() {
  const inputs = this.inputs.concat(this.hiddenNodes);
  const outputs = this.enzymes.concat(this.hiddenNodes);

  // Create random connections
  const n = randomN(6) + 6;
  const nInputs = inputs.length;
  const nOutputs = outputs.length;
  
  const connections = [];
  for (let i = 0; i < n; i++) {
    const input = inputs[randomN(nInputs)]
    const output = outputs[randomN(nOutputs)]
    connections.push(new Connection(input, output, Math.random()));
  }
  
  return connections;
}

Cell.prototype.update = function(light) {
  // The deeper the cell, the less light it sees
  // Light falls off with a squared relationship
  const depth = this.y / 400;
  this.light = light * (1 - depth * depth * 0.5);

  // Gain enegy through photosynthesis
  this.energy = Math.min(10, this.energy + this.light);

  this.absorbSugar();
  this.think();
  this.metabolism();
  this.move();
};

Cell.prototype.absorbSugar = function() {
  // Equilibrate sugar with the world
  // TODO: across a pore
  const gridCell = this.world.getGridCell(this.x, this.y);
  const delta = (gridCell.amount - this.sugar) * 0.02;
  
  this.sugar += delta;
  if (this.sugar > MAX_SUGAR) {
    // Limit delta so only enough sugar to fill the cell is brought it
    delta -= this.sugar - MAX_SUGAR;
    this.sugar = MAX_SUGAR;
  }

  gridCell.amount -= delta;
};

Cell.prototype.think = function() {
  // Connections transmit signals between nodes
  callForEach(this.connections, 'update');

  // Update neural net node activity values
  callForEach(this.inputs, 'updateActivity');
  callForEach(this.hiddenNodes, 'updateActivity');
  callForEach(this.enzymes, 'updateActivity');
}

Cell.prototype.metabolism = function() {
  // Life slowly lost through degeneration
  this.life -= 0.1;
  this.sugar += 0.1;

  // Enzyme rates are equal to their activity, but only when > 1
  this.enzymes.forEach((enzyme) => {
    enzyme.rate = Math.max(0, enzyme.activity);
  });

  callForEach(this.enzymes, 'update');
  console.log('life', this.life);

  this.energy = Math.min(this.energy, MAX_ENERGY);
};

Cell.prototype.move = function() {
  this.x += (Math.random() - 0.5) * 5;
  this.y += (Math.random() - 0.5) * 5;
  this.angle += (Math.random() - 0.5) * 0.1;

  if (this.x - this.size < 0) {
    this.x = this.size;
  } else if (this.x + this.size > CANVAS_WIDTH) {
    this.x = CANVAS_WIDTH - this.size;
  }

  if (this.y - this.size < 0) {
    this.y = this.size;
  } else if (this.y + this.size > CANVAS_HEIGHT) {
    this.y = CANVAS_HEIGHT - this.size;
  }
};

// Draw organism as a hexagon
Cell.prototype.display = function(ctx) {
  ctx.fillStyle = 'rgb(60, 100, 40)';
  ctx.beginPath();
  
  for (let i = 0; i < 6; i++) {
    const angle = this.angle + i * Math.PI / 3;
    const x = this.x + this.size * Math.cos(angle);
    const y = this.y + this.size * Math.sin(angle);
    if (i) {
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
    }
  }
  ctx.fill();
};

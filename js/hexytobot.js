const Cell = function(world, x, y, angle, sugar, energy, starch) {
  this.age = 0;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.r = 8;
  // this.genome = genome;

  this.world = world;
  this.life = MAX_LIFE;
  this.sugar = sugar;
  this.energy = energy;
  this.starch = starch;
  this.starch2 = 0;
  this.child = 0;

  // Receptors which feed into the neural net
  this.inputs = [
    new Input(() => 1),
    new Input(() => this.light),
    new Input(() => this.life / MAX_LIFE),
    new Input(() => this.sugar / MAX_SUGAR),
    new Input(() => this.starch / MAX_STARCH),
    new Input(() => this.starch2 / MAX_STARCH),
    new Input(() => this.child / MAX_LIFE),
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

Cell.prototype.info = function() {
  return {
    Life: this.life,
    Energy: this.energy,
    Sugar: this.sugar,
    Child: this.child,
    Starch: this.starch,
    'Child starch': this.starch2,
  };
}

Cell.prototype._getConnections = function() {
  this.nodes = this.inputs.concat(this.hiddenNodes).concat(this.enzymes);

  // Create random connections
  const n = randRange(6, 12);
  const nNodes = this.nodes.length;
  const skipInputs = this.inputs.length;
  const skipOutputs = nNodes - this.enzymes.length;
  
  const connections = [];
  for (let i = 0; i < n; i++) {
    const n1 = randRange(0, skipOutputs);
    const n2 = randRange(skipInputs, nNodes);
    const input = this.nodes[n1];
    const output = this.nodes[n2];
    const connection = new Connection(input, output, Math.random());
    connection.id = [n1, n2];
    connections.push(connection);
  }
  
  return connections;
}

Cell.prototype.update = function(sim) {
  // The deeper the cell, the less light it sees
  // Light falls off with a squared relationship
  const depth = this.y / 400;
  this.light = sim.light; // * (1 - depth * depth * 0.5);

  // Gain enegy through photosynthesis
  this.energy = Math.min(MAX_ENERGY, this.energy + this.light);

  this.absorbSugar();
  this.think();
  this.metabolism();
  this.move();

  if (this.life <= 0) {
    this.dead = true;
  } else if (this.child >= MAX_LIFE) {
    this.reproduce(sim);
  }
};

Cell.prototype.absorbSugar = function() {
  // Equilibrate sugar with the world
  // TODO: across a pore
  const gridCell = this.world.getGridCell(this.x, this.y);
  let delta = (gridCell.amount - this.sugar) * 0.02;
  
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

  callForEach(this.enzymes, 'limit');

  // Make sure we don't use up more energy or sugar than we have
  const totalEnergyCost = this.enzymes[0].activity + this.enzymes[1].activity + this.enzymes[2].activity;
  const limitedAmount = Math.min(totalEnergyCost, this.energy, this.sugar);

  if (limitedAmount < totalEnergyCost) {
    const limitingRatio = limitedAmount / totalEnergyCost;
    this.enzymes[0].activity *= limitingRatio;
    this.enzymes[1].activity *= limitingRatio;
    this.enzymes[2].activity *= limitingRatio;
  }

  callForEach(this.enzymes, 'update');

  this.energy = Math.min(this.energy, MAX_ENERGY);
};

Cell.prototype.move = function() {
  this.x += (Math.random() - 0.5) * 5;
  this.y += (Math.random() - 0.5) * 5;
  this.angle += (Math.random() - 0.5) * 0.1;

  if (this.x - this.r < 0) {
    this.x = this.r;
  } else if (this.x + this.r > CANVAS_WIDTH) {
    this.x = CANVAS_WIDTH - this.r;
  }

  if (this.y - this.r < 0) {
    this.y = this.r;
  } else if (this.y + this.r > CANVAS_HEIGHT) {
    this.y = CANVAS_HEIGHT - this.r;
  }
};

// Draw organism as a hexagon
Cell.prototype.display = function(ctx) {
  ctx.fillStyle = 'rgb(60, 100, 40)';
  ctx.beginPath();
  
  for (let i = 0; i < 6; i++) {
    const angle = this.angle + i * Math.PI / 3;
    const x = this.x + this.r * Math.cos(angle);
    const y = this.y + this.r * Math.sin(angle);
    if (i) {
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
    }
  }
  ctx.fill();
};

Cell.prototype.reproduce = function(sim) {
  sim.addCell(this.x, this.y, this.angle + Math.PI, 0, 0, this.starch2);
  this.child = 0;
  this.starch2 = 0;
};

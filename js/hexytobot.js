const Cell = function(x, y, angle, energy, storage) {
  this.age = 0;
  this.x = x;
  this.y = y;
  this.angle = angle;
  // this.genome = genome;

  this.life = 100;
  this.energy = energy;
  this.storage = storage;
  this.storage2 = 0;
  this.child = 0;

  this.inputs = [
    new Input(() => 1),
    new Input(() => this.light),
    new Input(() => this.life / 100),
    new Input(() => this.energy / 10),
    new Input(() => this.storage / 1000),
    new Input(() => this.storage2 / 1000),
    new Input(() => this.child / 100),
  ];

  this.enzymes = [
    new Enzyme(this, 'energy', 'life'),
    new Enzyme(this, 'energy', 'child'),
    new Enzyme(this, 'energy', 'storage'),
    new Enzyme(this, 'storage', 'energy'),
    new Enzyme(this, 'storage', 'storage2'),
    new Enzyme(this, 'storage2', 'storage'),
  ];

  // Create n hidden nodes in the brain
  this.hiddenNodes = [];
  for (let i = 0; i < 4; i++) {
    this.hiddenNodes.push(new NeuralNetNode());
  }

  // Create random connections
  
  this.connections = [
    // new Connection(this.inputs[0], this.hiddenNodes[0], 0.5),
    // new Connection(this.inputs[1], this.hiddenNodes[0], 0.25),
    // new Connection(this.inputs[2], this.hiddenNodes[1], 0.6),
    // new Connection(this.hiddenNodes[0], this.hiddenNodes[1], 0.6),
    new Connection(this.inputs[0], this.hiddenNodes[0], 0.5),
    new Connection(this.hiddenNodes[0], this.enzymes[0], 0.5),
    // new Connection(this.hiddenNodes[0], this.hiddenNodes[0], 1),
  ];
};

Cell.prototype.update = function(light) {
  // The deeper the cell, the less light it sees
  // Light falls off with a squared relationship
  const depth = this.y / 400;
  this.light = light * (1 - depth * depth * 0.5);

  // Gain enegy through photosynthesis
  this.energy = Math.min(10, this.energy + this.light);

  // Life slowly lost through degeneration
  this.life -= 0.1;

  this.think();
  this.metabolism();
  this.move();
};

Cell.prototype.think = function() {
  // Connections transmit signals between nodes
  callForEach(this.connections, 'update');

  // Update neural net node values
  callForEach(this.inputs, 'updateValue');
  callForEach(this.hiddenNodes, 'updateValue');
  callForEach(this.enzymes, 'updateValue');
}

Cell.prototype.metabolism = function() {
  callForEach(this.enzymes, 'update');
  // console.log('energy', this.energy);
  // console.log('life', this.life);
};

Cell.prototype.move = function() {
  this.x += (Math.random() - 0.5) * 5
  this.y += (Math.random() - 0.5) * 5
  this.angle += (Math.random() - 0.5) * 0.1
};

// Draw organism as a hexagon
Cell.prototype.display = function(ctx, size) {
  ctx.fillStyle = 'rgb(60, 100, 40)';
  ctx.beginPath();
  
  for (let i = 0; i < 6; i++) {
    const angle = this.angle + i * Math.PI / 3;
    const x = this.x + size * Math.cos(angle);
    const y = this.y + size * Math.sin(angle);
    if (i) {
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
    }
  }
  ctx.fill();
};

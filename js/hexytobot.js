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

  this.enzymes = [
    new Enzyme(this, 'energy', 'life'),
    new Enzyme(this, 'energy', 'child'),
    new Enzyme(this, 'energy', 'storage'),
    new Enzyme(this, 'storage', 'energy'),
    new Enzyme(this, 'storage', 'storage2'),
    new Enzyme(this, 'storag2', 'storage'),
  ];
};

Cell.prototype.update = function(light) {
  // Gain enegy through photosynthesis
  this.energy = Math.min(10, this.energy + light);
  // Life slowly lost through degeneration
  this.life -= 0.1;
  this.metabolism();
  this.move();
};

Cell.prototype.metabolism = function() {
  this.enzymes[0].update(0.5);
  console.log('energy', this.energy);
  console.log('life', this.life);
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

const Cell = function(x, y, angle, energy, genome) {
  this.age = 0;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.energy = energy;
  this.genome = genome;
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

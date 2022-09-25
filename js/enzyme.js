// An enzyme that converts <subtrate1> into <substrate2> inside <cell>
const Enzyme = function(cell, substrate1, substrate2) {
  this.cell = cell;
  this.substrate1 = substrate1;
  this.substrate2 = substrate2;
};

Enzyme.prototype.update = function(rate) {
  // Limit rate so substrate1 won't be negative
  rate = Math.min(rate, this.cell[this.substrate1]);
  this.cell[this.substrate1] -= rate;
  this.cell[this.substrate2] += rate;
};

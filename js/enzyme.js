// An enzyme that converts <subtrate1> into <substrate2> inside <cell>
const Enzyme = function(cell, substrate1, substrate2) {
  NeuralNetNode.call(this);
  this.cell = cell;
  this.substrate1 = substrate1;
  this.substrate2 = substrate2;
};
// Enzymes are a type of neural net node, so they can be controlled by the brain
Enzyme.prototype = Object.create(NeuralNetNode.prototype);

Enzyme.prototype.update = function() {
  // Rate determined by the neural net
  // Eznymes can only go in one direction, so rate must be positive
  // Rate limited so substrate1 won't become negative
  if (this.activity > 0) {
    const rate = Math.min(this.activity, this.cell[this.substrate1]);
    this.cell[this.substrate1] -= rate;
    this.cell[this.substrate2] += rate;
  }
};

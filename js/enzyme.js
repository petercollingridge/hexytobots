// An enzyme that converts <subtrates> into <products> inside <cell>
const Enzyme = function(cell, substrates, products) {
  NeuralNetNode.call(this);
  this.cell = cell;
  this.substrates = substrates;
  this.products = products;
};
// Enzymes are a type of neural net node, so they can be controlled by the brain
Enzyme.prototype = Object.create(NeuralNetNode.prototype);

// Overwritten by some enzymes
Enzyme.prototype.limit = function() {}

Enzyme.prototype.update = function() {
  // Update metabolite concentrations
  this.substrates.forEach((substrate) => {
    this.cell[substrate] -= this.rate;
  })
  this.products.forEach((product) => {
    this.cell[product] += this.rate;
  })
};

const LifeEnzyme = function(cell) {
  Enzyme.call(this, cell, ['sugar', 'energy'], ['life']);
}
LifeEnzyme.prototype = Object.create(Enzyme.prototype);

const ChildEnzyme = function(cell) {
  Enzyme.call(this, cell, ['sugar', 'energy'], ['child']);
}
ChildEnzyme.prototype = Object.create(Enzyme.prototype);

const AnabolismEnzyme = function(cell) {
  Enzyme.call(this, cell, ['sugar', 'energy'], ['starch']);
}
AnabolismEnzyme.prototype = Object.create(Enzyme.prototype);

// Limit starch production if the cell is full of starch
CatabolismEnzyme.prototype.limit = function() {
  this.rate = Math.min(this.rate, MAX_STARCH - this.cell.starch - this.cell.starch2);
};

const CatabolismEnzyme = function(cell) {
  Enzyme.call(this, cell, ['starch'], ['sugar', 'energy']);
}
CatabolismEnzyme.prototype = Object.create(Enzyme.prototype);

// Limit starch breakdown if the cell is full of sugar
CatabolismEnzyme.prototype.limit = function() {
  this.rate = Math.min(this.rate, MAX_SUGAR - this.cell.sugar);
};

const GiveToChildEnzyme = function(cell) {
  Enzyme.call(this, cell, ['starch'], ['starch2']);
}
GiveToChildEnzyme.prototype = Object.create(Enzyme.prototype);

const TakeFromChildEnzyme = function(cell) {
  Enzyme.call(this, cell, ['starch2'], ['starch']);
}
TakeFromChildEnzyme.prototype = Object.create(Enzyme.prototype);

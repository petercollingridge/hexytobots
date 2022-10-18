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
    this.cell[substrate] -= this.activity;
  })
  this.products.forEach((product) => {
    this.cell[product] += this.activity;
  })
};

const LifeEnzyme = function(cell) {
  Enzyme.call(this, cell, ['sugar', 'energy'], ['life']);
  this.name = 'Life enzyme';
}
LifeEnzyme.prototype = Object.create(Enzyme.prototype);

LifeEnzyme.prototype.limit = function() {
  this.activity = Math.min(this.activity, MAX_LIFE - this.cell.life);
};

const ChildEnzyme = function(cell) {
  Enzyme.call(this, cell, ['sugar', 'energy'], ['child']);
  this.name = 'Child enzyme';
}
ChildEnzyme.prototype = Object.create(Enzyme.prototype);

ChildEnzyme.prototype.limit = function() {
  this.activity = Math.min(this.activity, MAX_LIFE - this.cell.child);
};

const AnabolismEnzyme = function(cell) {
  Enzyme.call(this, cell, ['sugar', 'energy'], ['starch']);
  this.name = 'Anabolism enzyme';
}
AnabolismEnzyme.prototype = Object.create(Enzyme.prototype);

// Limit starch production if the cell is full of starch (own and child starch)
AnabolismEnzyme.prototype.limit = function() {
  this.activity = Math.min(this.activity, MAX_STARCH - this.cell.starch - this.cell.starch2);
};

const CatabolismEnzyme = function(cell) {
  Enzyme.call(this, cell, ['starch'], ['sugar', 'energy']);
  this.name = 'Catabolism enzyme';
}
CatabolismEnzyme.prototype = Object.create(Enzyme.prototype);

// Limit starch breakdown if the cell is full of sugar
CatabolismEnzyme.prototype.limit = function() {
  this.activity = Math.min(this.activity, this.cell.starch, MAX_SUGAR - this.cell.sugar);
};

const GiveToChildEnzyme = function(cell) {
  Enzyme.call(this, cell, ['starch'], ['starch2']);
  this.name = 'Give to child enzyme';
}
GiveToChildEnzyme.prototype = Object.create(Enzyme.prototype);

GiveToChildEnzyme.prototype.limit = function() {
  this.activity = Math.min(this.activity, this.cell.starch);
};

const TakeFromChildEnzyme = function(cell) {
  Enzyme.call(this, cell, ['starch2'], ['starch']);
  this.name = 'Take from child enzyme';
}
TakeFromChildEnzyme.prototype = Object.create(Enzyme.prototype);

TakeFromChildEnzyme.prototype.limit = function() {
  this.activity = Math.min(this.activity, this.cell.starch2);
};

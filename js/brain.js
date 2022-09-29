const NeuralNetNode = function() {
  this.value = 0;
  this.newValue = 0;
};

NeuralNetNode.prototype.updateValue = function() {
  this.value = sigmoid(this.newValue);
  this.newValue = 0;
}

// An input for a neural net
// Gets its value by measuring chemicals in the cell
const Input = function(getValue) {
  this.getValue = getValue;
  this.value = 0;
};

Input.prototype.updateValue = function() {
  this.value = this.getValue();
  return this.value;
};

const Connection = function(node1, node2, weight) {
  this.node1 = node1;
  this.node2 = node2;
  this.weight = weight;
};

Connection.prototype.update = function() {
  this.node2.newValue += this.node1.value * this.weight;
};

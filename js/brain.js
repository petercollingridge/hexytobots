const NeuralNetNode = function() {
  this.activity = 0;
  this.newActitity = 0;
};

NeuralNetNode.prototype.updateActivity = function() {
  this.activity = sigmoid(this.newActitity);
  this.newActitity = 0;
}

// An input for a neural net
// Get's its activity value by measuring chemicals in the cell
const Input = function(getActivity) {
  this.getActivity = getActivity;
  this.activity = 0;
};

Input.prototype.updateActivity = function() {
  this.activity = this.getActivity();
  return this.activity;
};

// Connection between two nodes.
// The activity of the first will be transmitted to the second with the given weight
const Connection = function(node1, node2, weight) {
  this.node1 = node1;
  this.node2 = node2;
  this.weight = weight;
};

Connection.prototype.update = function() {
  this.node2.newActitity += this.node1.activity * this.weight;
};

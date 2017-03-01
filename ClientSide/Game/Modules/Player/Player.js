function Player(id, properties){
  var player = this;

  this.id = id;
  this.linkedObject = false;
  this.controller = false;
  for (var p in properties) this[p] = properties[p];

  this.setLinkedObject = function(obj){
    player.linkedObject = obj;
  }
  this.setController = function(controller){
    player.controller = controller;
  }
}
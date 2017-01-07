function Player(nick){
  Reactor.apply(this,[]); //events adding ability

  var player = this;
  this.nick = nick;
  this.linkedObject = {};
  this.controllers = [];

  this.addController = function(controller){
    controller.setTarget(player.linkedObject)
    this.controllers.push(controller);
  }

  this.disableControllers = function(){
    for (var c in player.controllers)
     if (player.controllers[c].disable) player.controllers[c].disable();
  }
}

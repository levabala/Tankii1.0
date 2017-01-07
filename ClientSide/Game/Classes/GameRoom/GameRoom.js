function GameRoom(jqcontatiner,map){
  Reactor.apply(this,[]); //events adding ability

  var groom = this;

  this.jqcontatiner = jqcontatiner;
  this.map = map;
  this.objects = {};
  this.players = {};  
}

function GameRoom(jqcontatiner,map){
  Reactor.apply(this,[]); //events adding ability

  var groom = this;

  this.jqcontatiner = jqcontatiner;
  this.map = map;
  this.objects = {};
  this.players = {};
  this.changes = {};

  var counter = 0;
  this.addObject = function(obj){
    obj.id = counter;
    groom.objects[counter] = obj;
    map.setObject(obj)

    counter++;
  }

  this.removeObject = function(obj){
    map.removeObject(obj)
    delete groom.objects[obj.id];
  }

  this.updateObject = function(obj,newCellP){
    map.removeObject(obj);
    obj.cellP = newCellP.clone();
    map.setObject(obj);
  }

  this.gameLoop = function(){
    for (var o in groom.objects){
      var obj = groom.objects[o];
      var changes = obj.tick();

      if (changes)
        groom.changes[obj.id] = changes;
    }
  }

  this.acceptChanges = function(){
    groom.changes = {};
  }

  this.gameLoopInterval = setInterval(groom.gameLoop, 5);

  //log interval
  setInterval(function(){
    console.log(map.generateTextView());
  },500)
}

function GameRoom(snap,map){
  Reactor.apply(this,[]); //events adding ability

  var groom = this;

  this.gameInterval = 16;
  this.snap = snap;
  this.map = map;
  this.objects = {};
  this.players = {};
  this.changes = {};

  this.RoomSvgGroup = snap.group();

  //background
  this.ground = this.snap.rect(0,0,this.map.width,this.map.height)
  this.ground.attr({
    fill: "lightgreen",
    'fill-opacity': 0.4
  });
  this.ground.appendTo(this.RoomSvgGroup)


  //this.map scaling
  var matrix = new Snap.Matrix();
  matrix.scale(this.map.xcoeff, this.map.ycoeff);

  this.RoomSvgGroup.transform(matrix);

  var counter = 0;
  this.addObject = function(obj){
    obj.id = counter;
    obj.map = groom.map;
    obj.addEventListener('move',function(pos){
      groom.updateObjectPosition(obj,pos);
    })
    groom.objects[counter] = obj;
    obj.MoveGroup.appendTo(groom.RoomSvgGroup)
    console.log(groom.RoomSvgGroup)
    map.setObject(obj)

    counter++;
  }

  this.removeObject = function(obj){
    map.removeObject(obj)
    delete groom.objects[obj.id];
  }

  this.updateObjectPosition = function(obj,pos){
    map.removeObject(obj);
    obj.pos = pos.clone();
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

  //setInterval(function(){forcePageRefreshing()},16)

  //this.gameLoopInterval = setInterval(groom.gameLoop, this.gameLoopInterval);

  //log interval
  /*setInterval(function(){
    console.log(map.generateTextView());
  },500)*/
}

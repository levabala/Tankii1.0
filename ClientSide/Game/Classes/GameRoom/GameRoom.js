function GameRoom(jqcontainer,map){
  Reactor.apply(this,[]); //events adding ability

  var groom = this;

  this.gameInterval = 16;
  this.jqcontainer = jqcontainer;
  this.map = map;
  this.objects = {};
  this.players = {};
  this.changes = {};

  //background
  this.ground = document.createElementNS("http://www.w3.org/2000/svg",'rect');
  setAttr(this.ground, 'x', 0);
  setAttr(this.ground, 'y', 0);
  setAttr(this.ground, 'width', this.map.width);
  setAttr(this.ground, 'height', this.map.height);
  setAttr(this.ground, 'fill', 'lightgreen');
  setAttr(this.ground, 'style', 'fill-opacity: 0.3');
  jqcontainer.append(this.ground)

  //this.map scaling
  setAttr(jqcontainer[0], 'transform','scale('+this.map.xcoeff+','+this.map.ycoeff+')');

  var counter = 0;
  this.addObject = function(obj){
    obj.id = counter;
    obj.map = groom.map;
    obj.actions.setOneCellMoveDuration((obj.speed) ? groom.gameInterval / obj.speed : 0);
    obj.addEventListener('move',function(pos){
      groom.updateObjectPosition(obj,pos);
    })
    groom.objects[counter] = obj;
    groom.jqcontainer.append(obj.svgBody)
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

  //this.gameLoopInterval = setInterval(groom.gameLoop, this.gameLoopInterval);

  //log interval
  setInterval(function(){
    console.log(map.generateTextView());
  },500)
}

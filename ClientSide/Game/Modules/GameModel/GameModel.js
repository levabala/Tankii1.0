function GameModel(map){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('objectAdded'); //obj
  this.registerEvent('objectRemoved'); //obj_id
  this.registerEvent('objectMoveStart'); //{id: obj_id, rotation: obj.rotation, time: time_ms}
  this.registerEvent('objectMoveEnd'); //{id: obj_id, rotation: obj.rotation}
  this.registerEvent('objectChanged'); //{id: obj_id, property: property, value: value}

  var model = this;

  var counter = 0;
  this.objects = {};
  this.inMoving = {};
  this.map = map || new Map(1,1);

  var checkCollisionFuns = [
    function topCollisionCheck(pos,width,height){
      for (var x = 0; x < width; x++){        
        if (model.map.field[pos.X+x][pos.Y-1].obj.physical) return model.map.field[pos.X+x][pos.Y-1].obj; // && obj.id != model.id
      }
      return false;
    },
    function rightCollisionCheck(pos,width,height){
      for (var y = 0; y < height; y++)
        if (model.map.field[pos.X+width][pos.Y+y].obj.physical) return model.map.field[pos.X+width][pos.Y+y].obj;
      return false;
    },
    function bottomCollisionCheck(pos,width,height){
      for (var x = 0; x < width; x++)
        if (model.map.field[pos.X+x][pos.Y+height].obj.physical) return model.map.field[pos.X+x][pos.Y+height].obj;
      return false;
    },
    function leftCollisionCheck(pos,width,height){
      for (var y = 0; y < height; y++)
        if (model.map.field[pos.X-1][pos.Y+y].obj.physical) return model.map.field[pos.X-1][pos.Y+y].obj;
      return false;
    }
  ]
  
  this.addObject = function(obj){
    obj.id = counter;
    model.inMoving[obj.id] = false;
    obj.moveOnMap = function(time){
      var collRes = checkCollisionFuns[obj.rotationIndex](obj.pos,obj.width,obj.height);
      if (collRes){ //bumped to smth
        return collRes;
      }
      else {
        model.inMoving[obj.id] = true;
        model.map.moveObjectByOneCell[obj.rotationIndex](obj);
        var lastPos = obj.pos.clone();
        obj.pos.X += obj.rotation[1] - obj.rotation[3];
        obj.pos.Y += obj.rotation[2] - obj.rotation[0];
        //console.log(model.map.generateTextView());
        model.dispatchEvent('objectMoveStart', {
          id: obj.id, 
          rotation: obj.rotation, 
          time: time, 
          axis: (obj.rotation[1] || obj.rotation[3]) ? 'X' : 'Y',
          startPosition: lastPos,
          targetPosition: obj.pos,
          sign: (obj.rotation[1] || obj.rotation[2]) ? 1 : -1,
          speed: obj.speed,          
        });
      }
      return false;
    }
    obj.addEventListener('moved', function(){
      model.inMoving[obj.id] = false;
      model.dispatchEvent('objectMoveEnd', {id: obj.id, rotation: obj.rotation, pos: obj.pos})
    });
    obj.addEventListener('change', function(config){
      config.id = obj.id;
      model.dispatchEvent('objectChanged', config)
    });
    obj.addEventListener('pathFinished', function(){
      //console.log(model.map.generateTextView());
    });
    model.objects[counter] = obj;
    model.map.setObject(obj)
    counter++;

    model.dispatchEvent('objectAdded',obj);
  }

  this.addObjects = function(objs){
    for (var o in objs)
      model.addObject(objs[o]);
  }

  this.removeObject = function(id){
    delete model.objects[id];
    model.dispatchEvent('objectRemoved',id)
  }

  !function afterMoveDispatcher(){
    var time = performance.now();    
    for (var id in model.inMoving)
      if (model.inMoving[id]) model.objects[id].dispatchAfterMove(time);
    setTimeout(afterMoveDispatcher,0);
    //requestAnimationFrame(afterMoveDispatcher);
  }();
}


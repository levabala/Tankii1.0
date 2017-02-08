function GameModel(map){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('objectAdded');
  this.registerEvent('objectRemoved');
  this.registerEvent('objectMoveStart');
  this.registerEvent('objectMoveEnd');
  this.registerEvent('objectChanged');

  var model = this;

  var counter = 0;
  this.objects = {};
  this.map = map;

  var checkCollisionFuns = [ 
    function topCollisionCheck(pos,width,height){
      for (var x = 0; x < width; x++){
        if (model.map.field[pos.X+x][pos.Y-1].obj.physical) return obj; // && obj.id != model.id
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
    obj.moveOnMap = function(){
      var collRes = checkCollisionFuns[obj.rotationIndex](obj.pos,obj.width,obj.height);
      if (collRes){ //bumped to smth
        return collRes;
      }
      else {
        model.map.moveObjectByOneCell[obj.rotationIndex](obj);
        obj.pos.X += obj.rotation[1] - obj.rotation[3];
        obj.pos.Y += obj.rotation[2] - obj.rotation[0];
        //console.log(model.map.generateTextView());
        model.dispatchEvent('objectMoveStart', {obj: obj, direction: obj.rotationIndex});
      }
      return false;
    }
    obj.addEventListener('moved', function(){
      model.dispatchEvent('objectMoveEnd', {obj: obj, direction: obj.rotationIndex})
    });
    obj.addEventListener('change', function(config){
      config.obj = obj;
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
}

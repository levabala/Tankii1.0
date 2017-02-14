function GameObject(pos,width,height,rotation,hp,other){
  Reactor.apply(this,[]);
  this.registerEvent('move');
  this.registerEvent('moved');
  this.registerEvent('change');
  this.registerEvent('pathFinished');

  var gobj = this;

  this.skin = 'GameObject'

  this.pos = pos.clone();
  this.width = width;
  this.height = height;
  this.physical = 1;
  this.rotation = rotation || [1,0,0,0];
  this.afterMoveActions = { //action - argument
    rotate: null, //null - no rotation, other value - direction of rotating
    move: null //null - no moving, other value - direction of rotating before moving
  }; //here we have rotation index of the next moving. -1 is equals to 'no next moving'
  this.rotationIndex = 0;
  this.rotationAngle = gobj.rotation[0] * 180 + gobj.rotation[1] * 270 + gobj.rotation[3] * 90;
  this.hp = (hp == 'immortal') ? 1 : hp;
  this.hpPercentage = 1;
  this.maxHp = this.hp;
  this.mortal = (hp == 'immortal') ? 0 : 1;
  this.speed = 0;
  this.moveOn = 0;
  this.pathProps = {
    isFollowing: false,
    index: 0,
    path: [] //rotate directions
  };
  for (var o in other) this[o] = other[o];
  this.moveOnMap = function(){

  }

  this.actions = {
    'move': function(direction){
      if (direction === undefined) direction = gobj.rotationIndex;
      if (gobj.moveOn){
        gobj.afterMoveActions.move = direction;
      }
      else {
        if (gobj.rotationIndex != direction)
          rotate(directionToRotation(direction));
        move();
      }
    },
    'rotate': function(rotation){
      if (!gobj.moveOn) rotate(rotation);
      else gobj.afterMoveActions.rotate = rotation;
    },
    'setPath': function(path){
      gobj.pathProps = {
        isFollowing: false,
        index: 0,
        path: path
      };
      rotate(directionToRotation(path[0]));
    },
    'followPath': function(){
      gobj.pathProps.isFollowing = gobj.pathProps.path.length > 1;
      gobj.pathProps.index++;
      move();
    },
    'stop': function(){
      gobj.moveOn = 0;
      gobj.afterMoveActions = {
        move: null,
        rotate: null
      }
    }
  }

  this.collisionAction = function(obj){

  }

  this.createSnap = function(){
    var snap = [gobj.pos,gobj.width,gobj.height,gobj.rotation,gobj.hp,other]
    return snap;
  }

  //there are some native funs
  function rotate(rotation){
    //console.log('native rotated to',rotation)
    gobj.rotation = rotation;
    gobj.rotationIndex = rotation.indexOf(1);
    gobj.rotationAngle = gobj.rotation[0] * 180 + gobj.rotation[1] * 270 + gobj.rotation[3] * 90;
    gobj.dispatchEvent('change', {property: 'rotation', value: rotation})
  }

  function move(){
    var bumpedObject = gobj.moveOnMap(performance.now());
    if (!bumpedObject) {
      //console.log('native move to',gobj.pos)
      gobj.moveOn = 1;
      //gobj.dispatchEvent('move',performance.now())
      var moveTime = 1 / (gobj.speed / 1000);
      setTimeout(afterMove,moveTime);
    }
    else console.log('native bumped to', bumpedObject)
  }

  function afterMove(){
    gobj.dispatchEvent('moved');
    //console.log('native moved to', gobj.pos)

    if (gobj.pathProps.isFollowing){
      rotate(directionToRotation(gobj.pathProps.path[gobj.pathProps.index]));
      move();
      gobj.pathProps.index++;
      if (gobj.pathProps.index >= gobj.pathProps.path.length) {
        gobj.pathProps.isFollowing = false;
        gobj.afterMoveActions.move = null;
        gobj.afterMoveActions.rotate = null;
        gobj.dispatchEvent('pathFinished');
      }
      return;
    }

    var movedir = gobj.afterMoveActions.move;
    var rotatedir = gobj.afterMoveActions.rotate;
    gobj.afterMoveActions.move = null;
    gobj.afterMoveActions.rotate = null;

    if (movedir != null){
      if (movedir != gobj.rotationIndex)
        rotate(directionToRotation(movedir));
      move()
    }
    else {
      gobj.moveOn = 0;
      if (rotatedir != null) rotate(directionToRotation(rotatedir))
    }
  }
}
function ActiveGameObject(){
  GameObject.apply(this,arguments);

  var ago = this; //аго :))

  this.nextAction = '';
  this.moveOn = 0;
  this.nextPos = this.pos.clone();
  this.actioners = {};
  this.actioners['mActioner'] = new ActionManager();
  this.actioners['mActioner'].addEventListener('end', function(){ago.moveOn = 0;})
  this.actioners['rActioner'] = new ActionManager(this.actioners['mActioner']);
  this.movings = {};

  this.checkCollisionFuns = {
    //key is rotation.indexOf(1), so 0 = top, 1 = right, 2 = bottom, 3 = left, -1 = invalid rotation.
    //results:
    //"false" - all is okay
    //else - return object with which the collision occurred
    0: function topCollisionCheck(){
      for (var x = 0; x < ago.width; x++){
        var obj = ago.map.field[ago.mapPos.X+x][ago.mapPos.Y-1].obj;
        if (obj.physical) return obj; // && obj.id != ago.id
      }
      return false;
    },
    1: function rightCollisionCheck(){
      for (var y = 0; y < ago.height; y++)
        if (ago.map.field[ago.mapPos.X+ago.width][ago.mapPos.Y+y].obj.physical) return ago.map.field[ago.mapPos.X+ago.width][ago.mapPos.Y+y].obj;
      return false;
    },
    2: function bottomCollisionCheck(){
      for (var x = 0; x < ago.width; x++)
        if (ago.map.field[ago.mapPos.X+x][ago.mapPos.Y+ago.height].obj.physical) return ago.map.field[ago.mapPos.X+x][ago.mapPos.Y+ago.height].obj;
      return false;
    },
    3: function leftCollisionCheck(){
      for (var y = 0; y < ago.height; y++)
        if (ago.map.field[ago.mapPos.X-1][ago.mapPos.Y+y].obj.physical) return ago.map.field[ago.mapPos.X-1][ago.mapPos.Y+y].obj;
      return false;
    },
    '-1': function(){
      return false;
    }
  }
  this.collisionCaseAction = function(obj){

  }

  this.actions['toTop'] = function(){
    if (!ago.moveOn){
      ago.actions.setRotation([1,0,0,0])
      var collResult = ago.checkCollisionFuns[0]();
      if (!collResult)
        ago.movings.moveToTop();
      else ago.collisionCaseAction(collResult)
    }
  }
  this.actions['toRight'] = function(){
    if (!ago.moveOn){
      ago.actions.setRotation([0,1,0,0])
      var collResult = ago.checkCollisionFuns[1]();
      if (!collResult)
        ago.movings.moveToRight();
      else ago.collisionCaseAction(collResult)
    }
  }
  this.actions['toBottom'] = function(){
    if (!ago.moveOn){
      ago.actions.setRotation([0,0,1,0])
      var collResult = ago.checkCollisionFuns[2]();
      if (!collResult)
        ago.movings.moveToBottom();
      else ago.collisionCaseAction(collResult)
    }
  }
  this.actions['toLeft'] = function(){
    if (!ago.moveOn){
      ago.actions.setRotation([0,0,0,1])
      var collResult = ago.checkCollisionFuns[3]();
      if (!collResult)
        ago.movings.moveToLeft();
      else ago.collisionCaseAction(collResult)
    }
  }
  this.actions['moveViewByDelta'] = function(dx,dy){
    ago.pos.X += dx;
    ago.pos.Y += dy;
    ago.MoveMatrix.translate(dx,dy);
    ago.MoveGroup.transform(ago.MoveMatrix)
  }

  function initMovingAction(dx,dy){
    function tickFunction(deltaX, deltaY){
      ago.actions.moveViewByDelta(deltaX,deltaY)
    }
    ago.nextMapPos = ago.mapPos.clone();
    function startCallback(){
      ago.nextMapPos.X += dx;
      ago.nextMapPos.Y += dy;
      ago.actions.setMapPosition(ago.nextMapPos)
    }
    ago.actioners['mActioner'].initFunction((dy == 0) ? MoveHorizontal : MoveVertical,[ago,1,{start: startCallback, tick: tickFunction}]);
  }

  this.movings.moveToLeft = function(){
    ago.moveOn = 1;
    initMovingAction(-1,0)
  }

  this.movings.moveToRight = function(){
    ago.moveOn = 1;
    initMovingAction(1,0)
  }

  this.movings.moveToTop = function(){
    ago.moveOn = 1;
    initMovingAction(0,-1)
  }

  this.movings.moveToBottom = function(){
    ago.moveOn = 1;
    initMovingAction(0,1)
  }
}

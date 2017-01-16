function ActiveGameObject(){
  GameObject.apply(this,arguments);

  var ago = this; //аго :))

  this.nextAction = '';
  this.moveOn = 0;
  this.nextPos = this.pos.clone();
  this.actioners = {};
  this.actioners['mActioner'] = new ActionManager();
  this.actioners['mActioner'].addEventListener('end', function(){ago.moveOn = 0;});
  this.actioners['rActioner'] = new ActionManager(this.actioners['mActioner']);

  var checkCollisionFuns = {
    //key is rotation.indexOf(1), so 0 = top, 1 = right, 2 = bottom, 3 = left, -1 = invalid rotation.
    //results:
    //"false" - all is okay
    //else - return object with which the collision occurred
    0: function(){
      for (var x = 0; x < ago.width; x++){
        var obj = ago.map.field[ago.pos.X+x][ago.pos.Y-1].obj;
        if (obj.physical) return obj; // && obj.id != ago.id
      }
      return false;
    },
    1: function(){
      for (var y = 0; y < ago.height; y++)
        if (ago.map.field[ago.pos.X+ago.width][ago.pos.Y+y].obj.physical) return ago.map.field[ago.pos.X+ago.width][ago.pos.Y+y].obj;
      return false;
    },
    2: function(){
      for (var x = 0; x < ago.width; x++)
        if (ago.map.field[ago.pos.X+x][ago.pos.Y+ago.height].obj.physical) return ago.map.field[ago.pos.X+x][ago.pos.Y+ago.height].obj;
      return false;
    },
    3: function(){
      for (var y = 0; y < ago.height; y++)
        if (ago.map.field[ago.pos.X-1][ago.pos.Y+y].obj.physical) return ago.map.field[ago.pos.X-1][ago.pos.Y+y].obj;
      return false;
    },
    '-1': function(){
      return false;
    }
  }
  this.actions['toTop'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[0]();
      if (!collResult)
        moveToTop();
    }
  }
  this.actions['toRight'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[1]();
      if (!collResult)
        moveToRight();
    }
  }
  this.actions['toBottom'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[2]();
      if (!collResult)
        moveToBottom();
    }
  }
  this.actions['toLeft'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[3]();
      if (!collResult)
        moveToLeft();
    }
  }
  this.actions['moveViewByDelta'] = function(dx,dy){
    if (dx) ago.MoveMatrix.translate(dx,0);
    else ago.MoveMatrix.translate(0,dy);
    requestAnimationFrame(function(){
      ago.MoveGroup.transform(ago.MoveMatrix)
    })
  }

  function initMovingAction(dx,dy){
    ago.nextPos = ago.pos.clone();
    var ma = new MoveAction(ago,ago.rotation,ago.speed,1,function(deltaX, deltaY){
      //console.log(deltaX, deltaY)
      ago.actions.moveViewByDelta(deltaX,deltaY)
    }, function(){
      ago.nextPos.X += dx;
      ago.nextPos.Y += dy;
      ago.actions.setMapPosition(ago.nextPos)
    })

    ago.actioners['mActioner'].initAction(ma);
  }

  function moveToLeft(){
    ago.moveOn = 1;
    ago.rotation = [0,0,0,1];
    initMovingAction(-1,0)
  }

  function moveToRight(){
    ago.moveOn = 1;
    ago.rotation = [0,1,0,0]
    initMovingAction(1,0)
  }

  function moveToTop(){
    ago.moveOn = 1;
    ago.rotation = [1,0,0,0]
    initMovingAction(0,-1)
  }

  function moveToBottom(){
    ago.moveOn = 1;
    ago.rotation = [0,0,1,0]
    initMovingAction(0,1)
  }
}

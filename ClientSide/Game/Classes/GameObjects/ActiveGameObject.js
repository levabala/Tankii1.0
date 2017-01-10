function ActiveGameObject(){
  GameObject.apply(this,arguments);

  var ago = this; //аго :))

  this.nextAction = '';
  this.moveOn = 0;
  this.nextPos = this.pos.clone();

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
      var collResult = checkCollisionFuns[0];
      if (!collResult)
        moveToTop();
    }
  }
  this.actions['toRight'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[1]();
      console.log(collResult)
      if (!collResult)
        moveToRight();
    }
  }
  this.actions['toBottom'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[0];
      if (!collResult)
        moveToBottom();
    }
  }
  this.actions['toLeft'] = function(){
    if (!ago.moveOn){
      var collResult = checkCollisionFuns[0];
      if (!collResult)
        moveToLeft();
    }
  }

  function moveToLeft(){
    ago.nextPos = ago.pos.clone();
    ago.nextPos.X - 1;
    setAttr(ago.animationTag,'attributeName','x');
    setAttr(ago.animationTag,'to',ago.nextPos.X);
    ago.moveOn = 1;
    ago.rotation = [1,0,0,0]
  }

  function moveToRight(){
    ago.nextPos = ago.pos.clone();
    ago.nextPos.X += 1;
    console.log(ago.pos)
    console.log(ago.nextPos)
    ago.groupMatrix.translate(1,0);
    ago.snapGroup.animate({transform: ago.groupMatrix}, ago.oneCellMoveDuration, mina.lineral, function(){
      moveToRight()
      console.warn('end')
      ago.moveOn = 0;
    })
    ago.moveOn = 1;
    ago.rotation = [0,1,0,0]
  }

  function moveToTop(){
    ago.nextPos = ago.pos.clone();
    ago.nextPos.Y - 1;
    setAttr(ago.animationTag,'attributeName','y');
    setAttr(ago.animationTag,'to',ago.nextPos.Y);
    ago.moveOn = 1;
    ago.rotation = [0,0,1,0]
  }

  function moveToBottom(){
    ago.nextPos = ago.pos.clone();
    ago.nextPos.Y + 1;
    setAttr(ago.animationTag,'attributeName','y');
    setAttr(ago.animationTag,'to',ago.nextPos.Y);
    ago.moveOn = 1;
    ago.rotation = [0,0,0,1]
  }
}

function ActionManager(triggeringActionManager){
  Reactor.apply(this,[]);
  this.registerEvent('start')
  this.registerEvent('end')

  var am = this;
  var nextFun = {completed: true};

  this.actionOn = false;
  this.allowed = true;

  if (triggeringActionManager){
    this.allowed = !triggeringActionManager.actionOn;
    triggeringActionManager.addEventListener('start', function(){am.allowed = false;})
    triggeringActionManager.addEventListener('end', function(){am.allowed = true; if (!nextFun.completed) startAction(nextFun.fun, nextFun.args)})
  }
  else
    this.addEventListener('end', function(){am.allowed = true; if (!nextFun.completed) startAction(nextFun.fun, nextFun.args)})

  this.initFunction = function(fun,args){
    function endEvent(){          
      am.dispatchEvent('end');
      if (!nextFun.completed)
        startAction(nextFun.fun, nextFun.args);
    }
    args[2].end = endEvent; //adding 'end' callback

    if (!am.allowed){
      nextFun = {fun: fun, args: args, completed: false};
      return;
    }

    startAction(fun,args);
  }

  this.initAction = function(action){
    action.addEventListener('end', function(){
      console.log('end')
      am.dispatchEvent('end');
      if (!nextAction.completed)
        startAction(nextAction);
      else {
        am.actionOn = false;
        am.allowed = true;
      }
    });

    //if (am.actionOn) return;
    if (!am.allowed){
      nextAction = action;
      return;
    }

    startAction(action);
  }

  function startAction(fun,args){
    am.dispatchEvent('start');

    am.actionOn = true;
    am.allowed = false;
    fun.apply(this,args)
  }
}

function RotateAction(obj,rotation){
  Reactor.apply(this,[]);
  this.registerEvent('end')

  var action = this;

  this.completed = false;
  this.start = function(){
    obj.rotation = rotation;
    action.completed = true;
    action.dispatchEvent('end')
  }
}

var milliseconds = 16;
function MoveHorizontal(obj,distance,callbacks){
  var x = obj.pos.X;
  var sign = obj.rotation[1] + (-1) * obj.rotation[3];
  var tx = obj.pos.X + distance * sign;
  var dx = obj.speed * milliseconds / 1000 * sign;

  function rightMovingCondition(){return x < tx;}
  function leftMovingCondition(){return x > tx;}

  var condition = (sign > 0) ? rightMovingCondition : leftMovingCondition;

  callbacks.start();
  move();
  function move(){
    x += dx;
    if (!condition()){
      dx = tx - x;
      callbacks.end();
      return;
    }
    callbacks.tick(dx);
    setTimeout(move,milliseconds);
  }
}

function MoveAction(obj,rotation,speed,distance,tickFunction,startCallback){
  var milliseconds = 16;
  var moveActionFunctions = [
    function(){
      currentPos.Y += delta;
      tickFunction(0,delta)
      if (currentPos.Y <= ty){
        tickFunction(0,ty-currentPos.Y)
        action.completed = true;
        action.dispatchEvent('end');
        return;
      }
      setTimeout(move,milliseconds);
    },
    function(){
      currentPos.X += delta;
      tickFunction(delta,0)
      if (currentPos.X >= tx){
        tickFunction(tx-currentPos.X,0)
        action.completed = true;
        action.dispatchEvent('end');
        return;
      }
      setTimeout(move,milliseconds);
    },
    function(){
      currentPos.Y += delta;
      tickFunction(0,delta)
      if (currentPos.Y >= ty){
        tickFunction(0,ty-currentPos.Y)
        action.completed = true;
        action.dispatchEvent('end');
        return;
      }
      setTimeout(move,milliseconds);
    },
    function(){
      currentPos.X += delta;
      tickFunction(delta,0)
      if (currentPos.X <= tx){
        tickFunction(tx-currentPos.X,0)
        action.completed = true;
        action.dispatchEvent('end');
        return;
      }
      setTimeout(move,milliseconds);
    }
  ]
  Reactor.apply(this,[]);
  this.registerEvent('end')

  var action = this;

  var currentPos = obj.pos.clone();
  var tx = currentPos.X;
  var ty = currentPos.Y;


  var targetX,delta;
  this.completed = false;

  this.start = function(){
    //console.log('start')
    var right = rotation[1] - rotation[3];
    var bottom = rotation[2] - rotation[0];
    tx = obj.pos.X + distance * right;
    ty = obj.pos.Y + distance * bottom;
    delta = speed * milliseconds / 1000 * (right + bottom);
    action.completed = false;
    startCallback();
    move();
  }

  var move = moveActionFunctions[rotation.indexOf(1)]
}

//<editor-fold> MoveTo..
function MoveToRightAction(pos,speed,distance,tickFunction){
  Reactor.apply(this,[]);
  this.registerEvent('end')

  var action = this;
  var targetX,delta;

  this.start = function(){
    targetX = pos.X + distance;
    delta = speed * 0.016;
    action.completed = false;
    move();
  }

  function move(){
    if (pos.X > targetX){
      pos.X = targetX;
      tickFunction()
      action.completed = true;
      action.dispatchEvent('end');
    }
    else {
      pos.X += delta;
      tickFunction()
      setTimeout(move,16);
    }
  }
}

function MoveToLeftAction(pos,speed,distance,tickFunction){
  Reactor.apply(this,[]);
  this.registerEvent('end')

  var action = this;
  var targetX,delta;

  this.start = function(){
    targetX = pos.X - distance;
    delta = speed * 0.016;
    action.completed = false;
    move();
  }

  function move(){
    if (pos.X < targetX){
      pos.X = targetX;
      tickFunction()
      action.completed = true;
      action.dispatchEvent('end');
    }
    else {
      pos.X -= delta;
      tickFunction()
      setTimeout(move,16);
    }
  }
}

function MoveToTopAction(pos,speed,distance,tickFunction){
  Reactor.apply(this,[]);
  this.registerEvent('end')

  var action = this;
  var targetY,delta;

  this.start = function(){
    targetY = pos.Y - distance;
    delta = speed * 0.016;
    action.completed = false;
    move();
  }

  function move(){
    if (pos.Y < targetY){
      pos.Y = targetY;
      tickFunction()
      action.completed = true;
      action.dispatchEvent('end');
    }
    else {
      pos.Y -= delta;
      tickFunction()
      setTimeout(move,16);
    }
  }
}

function MoveToBottomAction(pos,speed,distance,tickFunction){
  Reactor.apply(this,[]);
  this.registerEvent('end')

  var action = this;
  var targetY,delta;

  this.start = function(){
    targetY = pos.Y + distance;
    delta = speed * 0.016;
    action.completed = false;
    move();
  }

  function move(){
    if (pos.Y > targetY){
      pos.Y = targetY;
      tickFunction()
      action.completed = true;
      action.dispatchEvent('end');
    }
    else {
      pos.Y += delta;
      tickFunction()
      setTimeout(move,16);
    }
  }
}
//<editor-fold>

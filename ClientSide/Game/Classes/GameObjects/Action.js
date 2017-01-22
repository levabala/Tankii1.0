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
    am.actionOn = true;
    am.allowed = false;
    fun.apply(this,args)
    am.dispatchEvent('start');
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
var log = [];
//setInterval(function(){var sum = 0; for (var l in log) sum += log[l]; console.log(log.length,sum / log.length)},300)
function MoveHorizontal(obj,distance,callbacks){
  var x = obj.pos.X;
  var sign = obj.rotation[1] + (-1) * obj.rotation[3];
  var tx = obj.mapPos.X + distance * sign;
  var coeff = milliseconds / 1000 * sign;
  var dx = obj.speed * coeff;
  var count = Math.round(distance / dx);
  dx = distance / count * 0.99;

  function rightMovingCondition(){return x <= tx;}
  function leftMovingCondition(){return x >= tx;}

  var condition = (sign > 0) ? rightMovingCondition : leftMovingCondition;

  callbacks.start();
  //var left = distance / dx;
  var p1 = performance.now();
  move();
  //var interval = setInterval(move,milliseconds);
  function move(){
    x += dx;
    if (!condition()){
      dx = tx - x;
      //console.log('final delta:',dx)
      //callbacks.tick(-dx);
      //clearInterval(interval)
      callbacks.end();
      return;
    }
    callbacks.tick(dx,0);
    //setTimeout(move,milliseconds);
    requestAnimationFrame(move);
  }
}

function MoveVertical(obj,distance,callbacks){
  var y = obj.pos.Y;
  var sign = obj.rotation[2] + (-1) * obj.rotation[0];
  var ty = obj.mapPos.Y + distance * sign;
  var coeff = milliseconds / 1000 * sign;
  var dy = obj.speed * coeff;
  var count = Math.round(distance / dy);
  dy = distance / count * 0.99;

  function bottomMovingCondition(){return y <= ty;}
  function topMovingCondition(){return y >= ty;}

  var condition = (sign > 0) ? bottomMovingCondition : topMovingCondition;

  callbacks.start();
  //var left = distance / dx;
  var p1 = performance.now();
  move();
  //var interval = setInterval(move,milliseconds);
  function move(){
    y += dy;
    if (!condition()){
      dy = ty - y;
      //console.log('final delta:',dx)
      //callbacks.tick(-dx);
      //clearInterval(interval)
      callbacks.end();
      return;
    }
    callbacks.tick(0,dy);
    //setTimeout(move,milliseconds);
    requestAnimationFrame(move);
  }
}

/*
function MoveVertical(obj,distance,callbacks){
  var y = obj.pos.Y;
  var sign = obj.rotation[2] + (-1) * obj.rotation[0];
  var ty = obj.pos.Y + distance * sign;
  var dy = obj.speed * milliseconds / 1000 * sign;

  function bottomMovingCondition(){return y <= ty;}
  function topMovingCondition(){return y >= ty;}

  var condition = (sign > 0) ? bottomMovingCondition : topMovingCondition;

  callbacks.start();
  move();
  //var interval = setInterval(move,milliseconds);
  function move(){
    y += dy;
    if (!condition()){
      //dy = ty - y;
      //console.log('final delta:',dx)
      //callbacks.tick(-dx);
      //clearInterval(interval)
      callbacks.end();
      return;
    }
    callbacks.tick(0,dy);
    setTimeout(move,milliseconds);
    //requestAnimationFrame(move);
  }
}*/


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

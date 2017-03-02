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

  function startAction(fun,args){
    am.actionOn = true;
    am.allowed = false;
    fun.apply(this,args)
    am.dispatchEvent('start');
  }
}

var milliseconds = 16;
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
  var p1 = performance.now();
  move();
  function move(){
    x += dx;
    if (!condition()){
      dx = tx - x + dx;
      callbacks.tick(dx,0);
      callbacks.end();
      return;
    }
    callbacks.tick(dx,0);
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
  var p1 = performance.now(); 
  move();
  function move(){
    y += dy;
    if (!condition()){
      dy = ty - y + dy;
      callbacks.tick(0,dy);
      callbacks.end();
      return;
    }
    callbacks.tick(0,dy);
    requestAnimationFrame(move);
  }
}

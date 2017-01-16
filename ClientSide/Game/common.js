//<editor-fold> Custom Event
function Event(name){
  this.name = name;
  this.callbacks = [];

  this.registerCallback = function(callback){
    this.callbacks.push(callback);
  }
}

function Reactor(){
  this.events = {};

  this.registerEvent = function(eventName){
    var event = new Event(eventName);
    this.events[eventName] = event;
  };

  this.dispatchEvent = function(eventName, eventArgs){
    for (var c in this.events[eventName].callbacks)
      this.events[eventName].callbacks[c](eventArgs);
  };

  this.addEventListener = function(eventName, callback){
    this.events[eventName].registerCallback(callback);
  };

  this.removeEventListeners = function(eventName){

  }
}
//</editor-fold>

function Pos(x,y){
  var pp = this;
  this.X = x;
  this.Y = y;

  this.lengthBetween = function(p1,p2){
    return Math.sqrt(Math.pow(p1.X - p2.X,2) + Math.pow(p1.Y - p2.Y,2));
  }

  this.clone = function(){
    return new Pos(pp.X,pp.Y);
  }

  this.sum = function(p2){
    return new Pos(pp.X + p2.X, pp.Y + p2.Y);
  }

  this.isInto = function(lb,rb,tb,bb){
    if (x >= lb && x <= rb && y >= tb && y <= bb)
      return true;
    return false;
  }

  this.compareWith = function(p2){
    return pp.X == p2.X && pp.Y == p2.Y;
  }
}

function randomInteger(min, max) {
  var rand = min + Math.random() * (max - min)
  rand = Math.round(rand);
  return rand;
}

function rotationToString(rotation){
  var rotations = ['top','right','bottom','left'];
  return rotations[rotation.indexOf(1)] || 'none';
}

function setAttr(obj,attr,value){
  obj.setAttribute(attr,value);
}

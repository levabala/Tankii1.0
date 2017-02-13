/*var jqwindow = $(window);
function forcePageRefreshing(){
  jqwindow.hide().show(0);
}*/
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
    console.log('event:',eventName);
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

function directionToRotation(dir){
  var rotation = [0,0,0,0];
  rotation[dir] = 1;
  return rotation;
}

function setAttr(obj,attr,value){
  obj.setAttribute(attr,value);
}

/*
//FPS
let frameCount = function _fc(fastTimeStart, preciseTimeStart) {

  let now = performance.now();

  let fastDuration = now - (fastTimeStart || _fc.startTime);
  let preciseDuration = now - (preciseTimeStart || _fc.startTime);

  if (fastDuration < 100) {

    _fc.fastCounter++;

  } else {

    _fc.fastFPS = _fc.fastCounter * 10;
    _fc.fastCounter = 0;
    fastTimeStart = now;
    console.log(_fc.fastFPS);
  }

  if (preciseDuration < 1000) {

    _fc.preciseCounter++;

  } else {

    _fc.preciseFPS = _fc.preciseCounter;
    _fc.preciseCounter = 0;
    preciseTimeStart = now;
    console.log(_fc.preciseFPS);

  }
  requestAnimationFrame(() => frameCount(fastTimeStart, preciseTimeStart));
}

frameCount.fastCounter = 0;
frameCount.fastFPS = 0;
frameCount.preciseCounter = 0;
frameCount.preciseFPS = 0;
frameCount.startTime = performance.now();

frameCount()



let requestAdaptiveAnimation = function _raa(cb, priority, timeout, ...args) {
  if (!_raa.cbsStore.has(cb) || timeout) {
    _raa.cbsStore.add(cb);
    _raa.queue = _raa.queue.then(() => {
      return new Promise((res) => {
        setTimeout(() => {
          requestAnimationFrame(() => {
            cb(...args);
            res();
          });
        }, timeout || 0);
      });
    });
    return;
  }
  if (frameCount.fastFPS >= 4 || priority) {
    requestAnimationFrame(() => cb(...args));
    return;
  }
  if (frameCount.preciseFPS < 15) {
    _raa.queue = _raa.queue.then(() => {
      return new Promise((res) => {
        requestAnimationFrame(() => {
          cb(...args);
          res();
        });
      });
    });
    return;
  }

  setTimeout(() => {
    requestAnimationFrame(() => cb(...args));
  }, _raa.timeout);
}

requestAdaptiveAnimation.cbsStore = new Set();
requestAdaptiveAnimation.queue = Promise.resolve();*/

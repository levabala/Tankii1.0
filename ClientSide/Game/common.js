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
    this.events[eventName].callbacks.forEach(function(callback){
      callback(eventArgs);
    });
  };

  this.addEventListener = function(eventName, callback){
    this.events[eventName].registerCallback(callback);
  };
}
//</editor-fold>

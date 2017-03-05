function GameModelWWInterface(workerUrl){
  Reactor.apply(this,[]);
  var wwinterface = this;
  this.worker = new Worker(workerUrl);    
  var messagesCounter = 0;

  this.init = function(width,height){
   sendMessage('init',{width: width,height: height});
  };

  this.addObject = function(type,args){
    sendMessage('addObject',{type: type, args: args});
  };

  this.removeObject = function(id){
    sendMessage('removeObject',id);
  };

  this.objectAction = function(id,action,args){
    sendMessage('objectAction',{id: id, action: action, args: args});
  };

  this.getObjectSnap = function(id){
    sendMessage('getObjectSnap', id)
  };

  function sendMessage(type,value){    
    w.worker.postMessage(JSON.stringify({type: type, value: value, token: messagesCounter}));
    messagesCounter++;
  }
}
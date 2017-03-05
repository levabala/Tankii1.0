function WWInterface(classInstance, worker){ //class
  Reactor.apply(this,[]);
  for (var e in classInstance.events)
    this.registerEvent(e);

  var wwinterface = this;
  this.worker = worker;

  this.methods = [];
  for (var p in classInstance)    
    this.methods.push(p);
  
  this.callMethod = function(path,args){
    wwinterface.sendMessage('callMethod',{path: path, args: args})
  };  

  var messagesCounter = 0;
  this.sendMessage = function(type,value){    
    wwinterface.worker.postMessage(JSON.stringify({type: type, value: value, token: messagesCounter}));
    messagesCounter++;
  }
}
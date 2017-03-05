function WWPresenter(worker){    
  var w = this;
  this.worker = worker;
  
  this.sendMessage = function(message){    
    w.worker.postMessage(message.toJSON());
  };  
}
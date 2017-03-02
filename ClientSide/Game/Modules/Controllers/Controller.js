function Controller(){
  var controller = this;

  this.targetObject = false;
  this.shortcuts = {
    stopMoving: function(){
      console.log('stop')
      controller.executeAction('stop');  
    }
  } 

  this.setTargetObject = function(tobj){
    controller.targetObject = tobj;
    return controller;
  }
  this.executeAction = function(actionName, args){
    if (controller.targetObject)
      controller.targetObject.actions[actionName].apply(this,args || []);
    return controller;
  }
}

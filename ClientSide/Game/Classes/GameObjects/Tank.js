function Tank(){
  ActiveGameObject.apply(this,arguments);

  var tank = this;

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height)
    rect.appendTo(obj.snapGroup);
  }
  this.generateView(this)
}

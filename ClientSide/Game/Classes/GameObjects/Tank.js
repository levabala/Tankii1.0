function Tank(){
  ActiveGameObject.apply(this,arguments);

  var tank = this;

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height)
    var rect2 = obj.snap.rect(0,0,1,1).attr({fill: 'red'});
    rect.appendTo(obj.RotateGroup);
    rect2.appendTo(obj.RotateGroup);
    //rect2.appendTo(obj.RotateGroup);
  }
  this.generateView(this)
}

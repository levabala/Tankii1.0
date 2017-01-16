function Tank(){
  ActiveGameObject.apply(this,arguments);

  var tank = this;

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height).attr({fill: tank.color})
    var turret = obj.snap.rect(1,1,obj.width-2,2).attr({fill: 'darkred'})
    var gun = obj.snap.rect(obj.width*0.4,2,obj.width*0.2,obj.height-2).attr({fill: 'red'})

    rect.appendTo(obj.RotateGroup);
    turret.appendTo(obj.RotateGroup);
    gun.appendTo(obj.RotateGroup);
  }
  this.generateView(this)
}

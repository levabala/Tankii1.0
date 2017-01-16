function Wall(){
  GameObject.apply(this,arguments);

  var wall = this;

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height).attr({fill: 'darkgray'})    
    rect.appendTo(obj.RotateGroup);
  }
  this.generateView(this)
}

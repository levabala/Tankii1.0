function Shell(){
  ActiveGameObject.apply(this,arguments)

  var shell = this;

  this.fly = function(){

  }

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height).attr({fill: 'black'})
    rect.appendTo(obj.RotateGroup);
  }
  this.generateView(this)
}

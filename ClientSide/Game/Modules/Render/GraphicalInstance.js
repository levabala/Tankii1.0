function GraphicalInstance(obj,snap,totalGroup){
  var vi = this;  
  this.width = obj.width;
  this.height = obj.height;
  this.view = {value: obj.physical};
  this.model = SVG_MODELS[obj.skin];
  var snapParts = this.model.create(snap,obj)
  snapParts.moveGroup.appendTo(totalGroup)
  snapParts.moveMatrix.translate(obj.pos.X,obj.pos.Y)    
  snapParts.moveGroup.transform(snapParts.moveMatrix)
  console.log(snapParts)

  var animation = {
    startTime: 0,
    lastTime: 0,
    from: 0,    
    speed: 0
  }

  this.remove = function(){
    for (var s in snapParts)    
      snapParts[s].remove(); 
  }
  this.moveStart = function(config){
    animation.startTime = config.time;
  }
  this.moveEnd = function(config){
    console.log(config)
    snapParts.moveMatrix = new Snap.Matrix();
    snapParts.moveMatrix.translate(config.pos.X,config.pos.Y)    
    console.log(snapParts.moveMatrix)
    snapParts.moveGroup.transform(snapParts.moveMatrix)
  }
  this.animateMoving = function(){

  }
  this.change = function(prop,value){
    //vi[prop]
  }
}
function GraphicalInstance(obj,snap,totalGroup){
  var vi = this;  
  this.width = obj.width;
  this.height = obj.height;
  this.view = {value: obj.physical};
  this.model = SVG_MODELS[obj.skin];
  this.snapParts = this.model.create(snap,obj)
  this.snapParts.moveGroup.appendTo(totalGroup)
  this.snapParts.moveMatrix.translate(obj.pos.X,obj.pos.Y)    
  this.snapParts.moveGroup.transform(this.snapParts.moveMatrix)
  console.log(this.snapParts)

  var animation = {
    startTime: 0,
    lastTime: 0,
    from: 0,    
    speed: 0
  }

  this.remove = function(){
    for (var s in vi.snapParts)    
      vi.snapParts[s].remove(); 
  }
  this.moveStart = function(config){
    animation.startTime = config.time;
  }
  this.moveEnd = function(config){
    console.log(config)
    vi.snapParts.moveMatrix = new Snap.Matrix();
    vi.snapParts.moveMatrix.translate(config.pos.X,config.pos.Y)    
    console.log(vi.snapParts.moveMatrix)
    vi.snapParts.moveGroup.transform(vi.snapParts.moveMatrix)
  }
  this.animateMoving = function(){

  }
  this.change = function(prop,value){
    //vi[prop]
  }
}
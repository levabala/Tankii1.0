function GraphicalInstance(obj,snap,totalGroup){
  var gi = this;  
  this.width = obj.width;
  this.height = obj.height;
  this.view = {value: obj.physical};
  this.model = SVG_MODELS[obj.skin];
  var snapParts = this.model.create(snap,obj);
  snapParts.moveGroup.appendTo(totalGroup);
  snapParts.moveMatrix.translate(obj.pos.X,obj.pos.Y) ;   
  snapParts.moveGroup.transform(snapParts.moveMatrix);
  //console.log(snapParts)

  var animation = {
    startTime: 0,    
    lastTime: 0,
    startValue: 0,
    targetValue: 0,
    sign: 1,
    speedms: 0,
    data: {},
    animationFun: function(){}
  }

  this.remove = function(){
    for (var s in snapParts)    
      snapParts[s].remove(); 
  }
  this.moveStart = function(config){    
    animation.startTime = config.time;
    animation.lastTime = config.time;
    animation.sign = config.sign;
    animation.startValue = config.startPosition[config.axis];
    animation.targetValue = config.targetPosition[config.axis];    
    animation.speedms = config.speed / 1000;
    animation.animationFun = moveAnimationFun;
    animation.data.axis = config.axis;
  }
  function moveAnimationFun(nowTime){
    var timeElapsed = nowTime - animation.lastTime;  
    animation.lastTime = nowTime;
    var delta = {X: 0, Y: 0}
    delta[animation.data.axis] += animation.speedms * timeElapsed * animation.sign;      
    snapParts.moveMatrix.translate(delta.X,delta.Y);   
    snapParts.moveGroup.transform(snapParts.moveMatrix);
  }
  this.moveEnd = function(config){
    //console.log(config)
    snapParts.moveMatrix = new Snap.Matrix();
    snapParts.moveMatrix.translate(config.pos.X,config.pos.Y)    
    //console.log(snapParts.moveMatrix)
    snapParts.moveGroup.transform(snapParts.moveMatrix)
  }
  this.animate = function(nowTime){
    animation.animationFun(nowTime)
  }
  this.change = function(prop,value){
    
  }
}
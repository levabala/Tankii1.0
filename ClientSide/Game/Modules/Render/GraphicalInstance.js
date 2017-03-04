function GraphicalInstance(obj,availableModels,totalGroup){
  var vi = this;  
  this.width = obj.width;
  this.height = obj.height;
  this.view = {value: obj.physical};

  var model = availableModels[obj.skin][Math.floor(Math.random()*availableModels[obj.skin].length)];        
  var boundingClientRect = model.getBoundingClientRect();    
  var sx = obj.width / (boundingClientRect.width);
  var sy = obj.height / (boundingClientRect.height);  

  this.ModelGroup = model.clone(totalGroup);      
  this.ModelGroup._matrix.manual = true;      
  this.ModelGroup._matrix
                      .identity()                                                                                                            
                      .scale(sx, sy)            
                      .translate(-boundingClientRect.left,-boundingClientRect.top)
                      .translate(-boundingClientRect.width/2,-boundingClientRect.height/2)
  boundingClientRect = model.getBoundingClientRect();  
  this.RotateGroup = new Two.Group().add(this.ModelGroup);                                                   
  this.RotateGroup.translation.set(obj.width/2,obj.height/2)
  this.RotateGroup.rotation = rotationToRadians(obj.rotation)   
  this.MoveGroup = new Two.Group().add(this.RotateGroup);   
  this.MoveGroup.translation.set(obj.pos.X,obj.pos.Y);
  totalGroup.add(this.MoveGroup);  

  var animation = {
    startTime: 0,    
    from: 0,     
    speedms: 0,
    props: {}
  }  

  this.remove = function(){
    for (var s in vi.snapParts)    
      vi.snapParts[s].remove(); 
  }
  this.moveStart = function(config){
    animation.startTime = config.time;
    animation.speedms = config.speed / 1000;
    animation.from = config.startPosition;
    animation.props = {
      axis: config.axis,
      sign: config.sign
    };    
  }
  this.moveEnd = function(config){
    vi.MoveGroup.translation.set(config.pos.X,config.pos.Y);
  }
  this.animate = function(nowTime){    
    var delta = {X: 0, Y: 0};
    delta[animation.props.axis] += (nowTime - animation.startTime) * animation.speedms * animation.props.sign;    
    vi.MoveGroup.translation.set(animation.from.X + delta.X,animation.from.Y + delta.Y);
  }
  this.change = function(prop,value){    
    if (prop == 'rotation') vi.RotateGroup.rotation = rotationToRadians(value);
  }

  function rotationToRadians(rotation){    
    return Math.PI * 2 * (rotation[3] * 3 / 4 + rotation[0] * 0 + rotation[1] * 0.25 + rotation[2] * 0.5);
  }
}
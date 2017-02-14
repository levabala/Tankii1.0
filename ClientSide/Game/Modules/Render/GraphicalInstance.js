function GraphicalInstance(obj,snap,totalGroup){
  var vi = this;  
  this.width = obj.width;
  this.height = obj.height;
  this.view = {value: obj.physical};
  this.model = SVG_MODELS[obj.skin];
  var snapParts = this.model.create(snap,obj)
  snapParts.moveGroup.appendTo(totalGroup)
  console.log(snapParts)

  this.remove = function(){
    vi.view = 0;
  }
  this.moveStart = function(direction){
    
  }
  this.change = function(prop,value){
    //vi[prop]
  }
}
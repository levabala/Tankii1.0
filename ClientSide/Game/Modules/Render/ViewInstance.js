function ViewInstance(obj){
  var vi = this;
  this.pos = new Pos(0,0);
  this.width = obj.width;
  this.height = obj.height;
  this.view = {value: obj.physical};

  this.remove = function(){
    vi.view = 0;
  }
  this.move = function(){

  }
  this.change = function(prop,value){
    //vi[prop]
  }
}

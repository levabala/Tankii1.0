function TextRender(){
  Render.apply(this,arguments);

  var render = this;

  this.map = [];
  this.view = []; //да, это было бы просто - просто печать this.map, но я хочу показать, как должен работать модуль Render
  this.onMapSet = function(map){
    render.view = [];
    for (var h = 0; h < map.height; h++){
      render.view[h] = [];
      for (var w = 0; w < map.width; w++)
        render.view[h][w] = 0;
    }
  }
  this.onObjectCreated = function(obj){
    render.createViewInstance(obj)
  }
  this.onObjectRemoved = function(id){
    render.removeViewInstance(id)
  }
  this.onObjectMoveStart = function(config){
    var mask = [0,0,0,0];
    mask[config.direction] = 1;
    render.instances[config.id].pos.X += mask[1] - mask[3];
    render.instances[config.id].pos.Y += mask[2] - mask[0];
  }
  this.onObjectMoveEnd = function(config){

  }
  this.onObjectChanged = function(obj){

  }

  this.addToDOM = function(instance){
    console.log('add to dom')
    for (var y = instance.pos.Y; y < instance.height; y++)
      for (var x = instance.pos.X; x < instance.width; x++)
        render.view[x][y] = instance.view;
    console.log(render.view)
  }

  this.redraw = function(){
    //render.outputDOM.innerHTML = viewToString(render.view);
    render.outputDOM.innerHTML = viewToString(render.map.field);
  }

  function viewToString(view){
    var str = '';    
    for (var h = 0; h < view.length; h++){
      for (var w = 0; w < view[h].length; w++)
        str += view[h][w].obj.physical ? 1 : 0;
      str += '\n';
    }
    return str;
  }
}

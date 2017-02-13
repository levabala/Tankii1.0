function Render(outputDOM,core){
  Reactor.apply(this,[]);
  this.registerEvent('rebuild');

  var render = this;

  this.instances = {}; //object_id:instance
  this.map = [];
  this.outputDOM = outputDOM;

  this.rebuild = function(){
    render.instances = {};
    render.map = [];
    render.dispatchEvent('rebuild');
  }

  this.createViewInstance = function(obj){
    var instance = new ViewInstance(obj);
    render.addToDOM(instance)
    render.instances[obj.id] = instance;
  }
  this.removeViewInstance = function(id){
    render.removeFromDOM(render.instances[id])
    render.instances[id].remove();
    delete render.instances[id];
  }

  this.addToDOM = function(instance){

  }
  this.removeFromDOM = function(instance){

  }

  this.setMap = function(map){
    render.map = map;
    render.onMapSet(map);
  }
  this.onMapSet = function(){

  }
  this.setObjects = function(arr){
    for (var o in arr)
      render.createViewInstance(arr[o]);
  }

  this.redraw = function(){

  }

  function ObjectCreated(obj){
    render.createViewInstance(obj)
  }
  function ObjectRemoved(id){
    render.removeViewInstance(id)
  }
  function ObjectMoveStart(config){
    render.onObjectMoveStart(config)
  }
  function ObjectMoveEnd(obj){

  }
  function ObjectChanged(obj){

  }

  this.onObjectCreated = function(obj){
    render.createViewInstance(obj)
  }
  this.onObjectRemoved = function(id){
    render.removeViewInstance(id)
  }
  this.onObjectMoveStart = function(obj){
    console.log()
  }
  this.onObjectMoveEnd = function(obj){

  }
  this.onObjectChanged = function(obj){

  }

  core.addEventListener('objectAdded',ObjectCreated)
  core.addEventListener('objectRemoved',ObjectRemoved)
  core.addEventListener('objectMoveStart',ObjectMoveStart)
  core.addEventListener('objectMoveEnd',ObjectMoveEnd)
  core.addEventListener('objectChanged',ObjectChanged)

  delete core;

  function update(){
    render.redraw();
    requestAnimationFrame(update)
  }
  update();
}

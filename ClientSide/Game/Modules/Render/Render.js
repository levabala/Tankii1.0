function Render(outputDOM,core){
  Reactor.apply(this,[]);
  this.registerEvent('rebuild');

  var render = this;

  this.instances = {}; //object_id:instance
  this.map = [];
  this.outputDOM = outputDOM;
  this.jqDOM = $(outputDOM)
  this.snap = new Snap(outputDOM)
  this.totalGroup = this.snap.group();
  this.totalGroupMatrix = new Snap.Matrix();
  this.InMoving = {};

  this.rebuild = function(){
    render.instances = {};
    render.map = [];
    render.dispatchEvent('rebuild');
  }

  this.createGraphicalInstance = function(obj){
    var instance = new GraphicalInstance(obj,render.snap,render.totalGroup);
    render.addToDOM(instance)
    render.instances[obj.id] = instance;
  }
  this.removeGraphicalInstance = function(id){
    render.removeFromDOM(render.instances[id])
    render.instances[id].remove();
    delete render.instances[id];
  }

  this.addToDOM = function(instance){

  }
  this.removeFromDOM = function(instance){

  }

  this.setMap = function(map){
    map.fitToContainer(render.jqDOM.width(),render.jqDOM.height() )
    render.map = map;    
    console.log('map scale:',map.xcoeff, map.ycoeff)
    render.totalGroupMatrix.scale(map.xcoeff, map.ycoeff);
    render.totalGroup.transform(render.totalGroupMatrix);
    render.onMapSet(map);
  }
  this.onMapSet = function(){

  }
  this.setObjects = function(arr){
    for (var o in arr)
      render.createGraphicalInstance(arr[o]);
  }

  this.redraw = function(){
    for (var m in render.InMoving) 
      render.InMoving[m].animateMoving();
  }

  function ObjectCreated(obj){
    render.createGraphicalInstance(obj)
  }
  function ObjectRemoved(id){
    render.removeGraphicalInstance(id) 
  }
  function ObjectMoveStart(config){
    console.log('move start')
    render.InMoving[config.id] = render.instances[config.id];
    //render.onObjectMoveStart(config)
  }
  function ObjectMoveEnd(config){
    console.log('move end')
    delete render.InMoving[config.id];
    if (config.id in render.instances) render.instances[config.id].moveEnd(config);
  }
  function ObjectChanged(obj){

  }

  /*this.onObjectCreated = function(obj){
    render.createGraphicalInstance(obj)
  }
  this.onObjectRemoved = function(id){
    render.removeGraphicalInstance(id)
  }
  this.onObjectMoveStart = function(obj){
    console.log()
  }
  this.onObjectMoveEnd = function(obj){

  }
  this.onObjectChanged = function(obj){

  }*/

  core.addEventListener('objectAdded',ObjectCreated)
  core.addEventListener('objectRemoved',ObjectRemoved)
  core.addEventListener('objectMoveStart',ObjectMoveStart)
  core.addEventListener('objectMoveEnd',ObjectMoveEnd)
  core.addEventListener('objectChanged',ObjectChanged)

  //delete core;

  function update(){
    render.redraw();
    requestAnimationFrame(update)
  }
  update();
}
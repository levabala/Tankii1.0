function Render(outputDOM,core){
  Reactor.apply(this,[]);
  this.registerEvent('rebuild');

  var render = this;

  this.instances = {}; //object_id:instance
  this.map = [];
  this.outputDOM = outputDOM;
  this.jqDOM = $(outputDOM)
  this.InAnimating = {};
  this.two = new Two({autostart: true, type: Two.Types.svg,width: $(outputDOM).width(), height: $(outputDOM).height()}).appendTo(outputDOM)
  this.totalGroup = this.two.makeGroup();    
  this.totalMatrix = this.totalGroup._matrix;
  this.availableModels = {};

  for (var type in SVG_MODELS){
    this.availableModels[type] = []
    for (var i in SVG_MODELS[type]){
      var model = this.two.interpret(SVG_MODELS[type][i], false, false);
      model.noStroke();
      for (var c in model._collection)      
        model._collection[c].linewidth = 0;
      model._matrix = new Two.Matrix();       
      //var container = SVG_MODELS[type][i].querySelector('[data-name=Container]') || SVG_MODELS[type][i].querySelector('[id=Container]');                  
      //model.mask = container;
      /*model.width = parseFloat(container.getAttribute('width'));
      model.height = parseFloat(container.getAttribute('height'));
      model.baseOffsetX = parseFloat(container.getAttribute('x')) || 0;
      model.baseOffsetY = parseFloat(container.getAttribute('y')) || 0;*/
      this.availableModels[type].push(model);
    }
  }
  console.log(this.availableModels)
  //this.totalGroup.add(this.availableModels.GameObject[0])

  this.rebuild = function(){
    render.instances = {};
    render.map = [];
    render.dispatchEvent('rebuild');
  }

  this.createGraphicalInstance = function(obj){
    var instance = new GraphicalInstance(obj,render.availableModels,render.totalGroup);
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
    map.fitToContainer(render.jqDOM.width(),render.jqDOM.height());
    render.map = map;    
    console.log('map scale:',map.xcoeff, map.ycoeff)    
    render.totalGroup.scale = map.xcoeff;    
    var ground = render.two.makeRectangle(map.width/2,map.height/2,map.width+1,map.height+1);    
    ground.fill = 'lightgreen';
    ground.opacity = 0.3;
    ground.linewidth = 0.1;
    render.totalGroup.add(ground)
    /*var littleCirclesGroup = render.two.makeGroup();
    for (var x = 0; x < map.width+1; x++)
      for (var y = 0; y < map.height+1; y++){
        var circle = render.two.makeCircle(x,y,0.05);
        circle.noStroke();
        circle.fill = 'red';
        littleCirclesGroup.add(circle);
      }    
    render.totalGroup.add(littleCirclesGroup)*/
    render.onMapSet(map);
  }
  this.onMapSet = function(){

  }
  this.setObjects = function(arr){
    for (var o in arr)
      render.createGraphicalInstance(arr[o]);
  }

  this.redraw = function(){
    for (var m in render.InAnimating) 
      render.InAnimating[m].animate();
  }
  this.two.bind('update',render.redraw);

  function ObjectCreated(obj){
    render.createGraphicalInstance(obj)
  }
  function ObjectRemoved(id){
    render.removeGraphicalInstance(id) 
  }
  function ObjectMoveStart(config){
    //console.log('move start')
    render.InAnimating[config.id] = render.instances[config.id];
    render.instances[config.id].moveStart(config);
    //render.onObjectMoveStart(config)
  }
  function ObjectMoveEnd(config){
    //console.log('move end')
    delete render.InAnimating[config.id];
    //if (config.id in render.instances) 
    render.instances[config.id].moveEnd(config);
  }
  function ObjectChanged(config){
    render.instances[config.id].change(config.property,config.value)
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
}
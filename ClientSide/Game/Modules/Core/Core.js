function Core(){
  Reactor.apply(this,[]);
  this.registerEvent('objectAdded'); //obj
  this.registerEvent('objectRemoved'); //obj_id
  this.registerEvent('objectMoveStart'); //{id: obj_id, direction: obj.rotationIndex}
  this.registerEvent('objectMoveEnd'); //{id: obj_id, direction: obj.rotationIndex}
  this.registerEvent('objectChanged'); //{id: obj_id, property: property, value: value}

  var core = this;
  this.modules = {
    GameModel: null,
    Network: null,
    Render: null,
    Interface: null
  }
  this.history = [];

  this.initGameModel = function(config){
    core.modules.GameModel = new GameModel(new Map(12,12));
    if (config) core.modules.GameModel.setConfig(config);

    core.modules.GameModel.addEventListener('objectAdded',core.onObjectCreated)
    core.modules.GameModel.addEventListener('objectRemoved',core.onObjectRemoved)
    core.modules.GameModel.addEventListener('objectMoveStart',core.onObjectMoveStart)
    core.modules.GameModel.addEventListener('objectMoveEnd',core.onObjectMoveEnd)
    core.modules.GameModel.addEventListener('objectChanged',core.onObjectChanged)

    return core.modules.GameModel;
  }
  this.createRender = function(outputDOM, RenderConstructor){
    core.modules.Render = new RenderConstructor(outputDOM,core);
    core.modules.Render.addEventListener('rebuild',function(){
      core.modules.Render.setMap(core.modules.GameModel.map)
      core.modules.Render.setObjects(core.modules.GameModel.objects)
    })
    core.modules.Render.rebuild();
    return core.modules.Render;
  }
  this.initNetworkModule = function(signalingServerIp){
    core.modules.Network = new Network(signalingServerIp);
    return core.modules.Network;
  }
  this.createInterfaceModule = function(){
    core.modules.Interface = new Interface();
    return core.modules.Interface;
  }

  this.onObjectCreated = function(obj){
    core.history.push(['objectAdded',obj.createSnap()]);
    core.dispatchEvent('objectAdded',obj)
  }
  this.onObjectRemoved = function(id){
    core.history.push(['objectRemoved',id]);
    core.dispatchEvent('objectRemoved',id)
  }
  this.onObjectMoveStart = function(config){
    core.history.push(['objectMoveStart',config]);
    core.dispatchEvent('objectMoveStart',config)
  }
  this.onObjectMoveEnd = function(config){
    core.history.push(['objectMoveEnd',config]);
    core.dispatchEvent('objectMoveEnd',config)
  }
  this.onObjectChanged = function(config){
    core.history.push(['objectChanged',config]);
    core.dispatchEvent('objectChanged',config)
  }
}

var scripts = [
  './GameModel.js',
  './Map.js',
  './GameObjects/GameObject.js',
  '../../common.js'
]
importScripts.apply(this,scripts);

log('Worker loaded');

var GameModel;

var messagesMap = {
  'init': function(config){
    GameModel = new GameModel(new Map(config.width,config.height))
    GameModel.addEventListener('objectAdded', function(obj){
      post('objectAdded',obj)
    })
    GameModel.addEventListener('objectRemoved', function(id){
      post('objectRemoved',id)
    })
    GameModel.addEventListener('objectMoveStart', function(config){
      post('objectMoveStart',config)
    })
    GameModel.addEventListener('objectMoveEnd', function(config){
      post('objectMoveEnd',config)
    })
    GameModel.addEventListener('objectChanged', function(config){
      post('objectChanged',config)
    })
    log('GameModel created')
  },
  'addObject': function(config){ //config = {type: type, args: arguments}
    var obj = construct(self[config.type],config.args)
    GameModel.addObject(obj);
    log(obj.id)
  },
  'objectAction': function(config){ //config = {id: obj_id, action: actionName, args: arguments}    
    GameModel.objects[config.id].actions[config.action].apply(this,config.args);
  }
}
self.addEventListener('message', function(message){  
  message = Message.fromJSON(message.data);  
  if (message.type in messagesMap)
    messagesMap[message.type](message.value)
  else GameModel[message.type](message.value);
})

function log(text){
  self.postMessage(JSON.stringify({type: 'log', value: text})); //for speed
}
function post(type,value){
  self.postMessage(new Message(type,value).toJSON())
}

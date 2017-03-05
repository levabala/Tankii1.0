var scripts = [
  './gameModel.js',
  './Map.js',
  './GameObjects/GameObject.js',
  '../../common.js'
]
importScripts.apply(this,scripts);

log('Worker loaded');

var gameModel;

var messagesMap = {
  'init': function(config){
    gameModel = new GameModel(new Map(config.width,config.height))
    gameModel.addEventListener('objectAdded', function(obj){
      post('objectAdded',obj)
    })
    gameModel.addEventListener('objectRemoved', function(id){
      post('objectRemoved',id)
    })
    gameModel.addEventListener('objectMoveStart', function(config){
      post('objectMoveStart',config)
    })
    gameModel.addEventListener('objectMoveEnd', function(config){
      post('objectMoveEnd',config)
    })
    gameModel.addEventListener('objectChanged', function(config){
      post('objectChanged',config)
    })
    log('gameModel created')
  },
  'callMethod': function(config){    
    var temp = gameModel;
    for (var p in config.path){
      var property = config.path[p]
      temp = temp[property];
    }
    temp.apply(config.args);    
  },
  'createObject': function(config){ //config = {type: type, args: arguments}
    var obj = construct(self[config.type],config.args)
    gameModel.addObject(obj);
    log('Created object with id: ' + obj.id)
  },
  'objectAction': function(config){ //config = {id: obj_id, action: actionName, args: arguments}    
    gameModel.objects[config.id].actions[config.action].apply(this,config.args);
  }
}
self.addEventListener('message', function(message){  
  message = Message.fromJSON(message.data);  
  if (message.type in messagesMap)
    messagesMap[message.type](message.value)
  else gameModel[message.type](message.value);
})

function log(text){
  self.postMessage(JSON.stringify({type: 'log', value: text})); //for speed
}
function post(type,value){
  self.postMessage(new Message(type,value).toJSON())
}

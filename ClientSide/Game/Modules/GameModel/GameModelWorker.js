var scripts = [
  './GameModel.js',
  './Map.js',
  './GameObjects/GameObject.js',
  '../../common.js'
]
importScripts.apply(this,scripts);

log('Worker loaded')

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
  }
}
self.addEventListener('message', function(message){
  message = Message.fromJSON(message.data);
  if (message.type in messagesMap)
    messagesMap[message.type](message.value)
  else GameModel[message.type](message.value);
})

function log(text){
  self.postMessage(JSON.stringify({type: 'log', value: text})) //for speed
}
function post(type,value){
  self.postMessage(new Message(type,value).toJSON())
}

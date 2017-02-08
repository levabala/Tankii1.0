/*var w1 = new Worker("../../../Game/Classes/Connector/ConnectorWebWorker.js")
var w2 = new Worker("../../../Game/Classes/Connector/ConnectorWebWorker.js")
var w3 = new Worker("../../../Game/Classes/Connector/ConnectorWebWorker.js")
var w4 = new Worker("../../../Game/Classes/Connector/ConnectorWebWorker.js")
var w5 = new Worker("../../../Game/Classes/Connector/ConnectorWebWorker.js")*/


var connector = new Connector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom', 'OfficialRoom'])
var svg = $('#SVGRoom');
var snap = Snap('#SVGRoom');

connector.addEventListener('roomInstanceCreated', function(room){
  var prefix = '|'+room.name+'|';
  room.addEventListener('adoptedByHost', function(host){
    room.sendToHost(new Message('request','roomsnap'))
    console.warn(prefix, 'Adopted by Host', host.id, '(' + host.userdata.nick + ')')
  })

  room.addEventListener('initializedAsHost', function(){
    console.warn(prefix, 'Initializaed as host')
    if (room.name == 'ChatRoom') return;

    var map = new Map(223,123);
    window.getMap = function(){
      console.log(map.generateTextView())
    }
    map.fitToContainer(svg.width(),svg.height())
    //svg.append(map.generateMesh());
    var gameroom = new GameRoom(snap,map)
    var agos = [];
    for (var i = 5; i < map.height-3; i += 5){
      var ago = new Tank(new Pos(5,i),3,3,[0,0,1,0],5,snap,{
        speed: 8,//1.5,
        color: 'brown'
      })
      agos.push(ago)
      gameroom.addObject(ago)
    }
    console.warn('agos.length:',agos.length)


    var mActioner = new ActionManager();
    var rActioner = new ActionManager(mActioner);

    var keyMapDownTemplate = function(obj){
      return {
        38: function(){
          for (var a in agos)
            agos[a].actions.toTop();
        },
        39: function(){
          for (var a in agos)
            agos[a].actions.toRight();
        },
        40: function(){
          for (var a in agos)
            agos[a].actions.toBottom();
        },
        37: function(){
          for (var a in agos)
            agos[a].actions.toLeft();
        }
      }
    }

    var keymapdown1 = keyMapDownTemplate(ago);

    var k = new KeyboardController(window,keymapdown1,{
      32: function(){
        for (var a in agos)
          agos[a].actions.shoot();
      }
    })
  })

  room.addEventListener('hostMessage', function(message){
    console.warn(prefix, 'HostMessage:', message.value)
  })

  room.addEventListener('peerMessage', function(config){
    console.warn(prefix, 'PeerMessage from', config.peer.id, '(' + config.peer.userdata.nick + '):',config.message.value)
  })
})

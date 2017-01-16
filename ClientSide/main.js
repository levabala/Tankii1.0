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

    var map = new Map(30,10);
    map.fitToContainer(svg.width(),svg.height())
    var gameroom = new GameRoom(snap,map)

    var ago1 = new Tank(new Pos(5,5),3,3,[0,0,1,0],5,snap,{
      speed: 0.08
    })
    gameroom.addObject(ago1)
    ago1.actions.toRight()
    //setInterval(function(){ago1.actions.toRight()}, 800);
  })

  room.addEventListener('hostMessage', function(message){
    console.warn(prefix, 'HostMessage:', message.value)
  })

  room.addEventListener('peerMessage', function(config){
    console.warn(prefix, 'PeerMessage from', config.peer.id, '(' + config.peer.userdata.nick + '):',config.message.value)
  })
})

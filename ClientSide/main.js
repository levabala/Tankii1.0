var connector = new Connector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom', 'OfficialRoom'])
var svg = $('#SVGRoom');
var contatiner = document.createElementNS("http://www.w3.org/2000/svg",'g');
var jqcontatiner = $(contatiner)
svg.append(contatiner);

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
    var gameroom = new GameRoom(jqcontatiner,map)

    var ago1 = new ActiveGameObject(new Pos(5,5),3,3,[0,1,0,0],5,{
      speed: 0.032
    })
    gameroom.addObject(ago1)

    setInterval(function(){ago1.actions.toRight()}, 800);
  })

  room.addEventListener('hostMessage', function(message){
    console.warn(prefix, 'HostMessage:', message.value)
  })

  room.addEventListener('peerMessage', function(config){
    console.warn(prefix, 'PeerMessage from', config.peer.id, '(' + config.peer.userdata.nick + '):',config.message.value)
  })
})

var connector = new Connector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom', 'OfficialRoom'])
var svg = $('#SVGRoom');
var contatiner = document.createElementNS("http://www.w3.org/2000/svg",'g');
var jqcontatiner = $(contatiner)
svg.append(contatiner);

connector.addEventListener('roomInstanceCreated', function(room){
  console.log('rr')
  var prefix = '|'+room.name+'|';
  room.addEventListener('adoptedByHost', function(host){
    room.sendToHost(new Message('request','roomsnap'))
    console.warn(prefix, 'Adopted by Host', host.id, '(' + host.userdata.nick + ')')
  })

  room.addEventListener('initializedAsHost', function(){
    console.warn(prefix, 'Initializaed as host')
    if (room.name == 'ChatRoom') return;

    var map = new Map(30,10);
    var gameroom = new GameRoom(jqcontatiner,map)
  })

  room.addEventListener('hostMessage', function(message){
    console.warn(prefix, 'HostMessage:', message.value)
  })

  room.addEventListener('peerMessage', function(config){
    console.warn(prefix, 'PeerMessage from', config.peer.id, '(' + config.peer.userdata.nick + '):',config.message.value)
  })
})

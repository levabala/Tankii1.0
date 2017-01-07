var connector = new SignalingServerConnector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom', 'OfficialRoom'])

connector.addEventListener('roomInstanceCreated', function(room){
  //console.warn('Room instance created:', room)

  var prefix = '|'+room.name+'|';
  room.addEventListener('adoptedByHost', function(host){
    room.sendToHost(new Message('request','roomsnap'))
    console.warn(prefix, 'Adopted by Host', host.id, '(' + host.userdata.nick + ')')
  })

  room.addEventListener('initializedAsHost', function(){
    console.warn(prefix, 'Initializaed as host', host.id, '(' + host.userdata.nick + ')')
  })

  room.addEventListener('hostMessage', function(message){
    console.warn(prefix, 'HostMessage:', message.value)
  })

  room.addEventListener('peerMessage', function(config){    
    console.warn(prefix, 'PeerMessage from', config.peer.id, '(' + config.peer.userdata.nick + '):',config.message.value)
  })
})

/*connector.addEventListener('adoptedByHost', function(host){
  connector.sendToHost(new Message('request','roomsnap'))
  console.warn('Adopted by Host', host.id, '(' + host.userdata.nick + ')')
})

connector.addEventListener('hostMessage', function(message){
  console.warn('HostMessage from', host.id, '(' + host.userdata.nick + '):',message)
})

connector.addEventListener('peerMessage', function(peer,message){
  console.warn('PeerMessage from', peer.id, '(' + peer.userdata.nick + '):',message)
})*/

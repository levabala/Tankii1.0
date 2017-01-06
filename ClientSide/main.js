var connector = new SignalingServerConnector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom'])

connector.addEventListener('adoptedByHost', function(host){
  console.warn('Adopted by Host', host.userdata.nick)
})

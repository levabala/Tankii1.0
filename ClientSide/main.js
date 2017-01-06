<<<<<<< HEAD
var connector = new SignalingServerConnector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom'])

connector.addEventListener('adoptedByHost', function(host){
  console.warn('Adopted by Host', host.userdata.nick)
})
=======
>>>>>>> parent of 9a2e64d... v0.1.2

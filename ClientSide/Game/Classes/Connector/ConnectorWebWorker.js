/*importScripts('../../../ExternalLibs/socket.io.js')
importScripts('../../../Game/Classes/Connector/connector.js')

var connector;
var SIGNALING_SERVER = 'http://127.0.0.1:3030'
var ROOM = 'OfficialRoom'
var CHAT_ROOM = 'ChatRoom'
var ICE_SERVERS = [
  {url:"stun:stun.l.google.com:19302"}
];

self.addEventListener("connect", function(e) {
  connector = new Connector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom', 'OfficialRoom'])
}, false);*/


setInterval(function(){
  var sum = 0;
  for (var i = 0; i < 3000000; i++)
    sum += Math.sin(i) + Math.cos(sum) * Math.sqrt(i) + i * i + 2;
},3000)

self.addEventListener("connect",function(e){

})

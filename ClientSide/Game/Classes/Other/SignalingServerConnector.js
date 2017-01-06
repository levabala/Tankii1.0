var SIGNALING_SERVER = 'http://127.0.0.1:3030'
var ROOM = 'OfficialRoom'
var ICE_SERVERS = [
  {url:"stun:stun.l.google.com:19302"}
];

function SignalingServerConnector(ip,userdata){
  var ssc = this;
  this.signaling_server = io.connect(ip)
  this.userdata = userdata || {};

  this.peers = {};
  this.host = null;

  var ss = this.signaling_server;
  //default listeners
  ss.on('connect', function(){
    console.log('Connected to',ip);
  });
  ss.on('disconnect', function(){
    console.log('Disconnected from',ip);
  });
  ss.on('joinedRoom', function(host){
    if (!host.peer_id){
      
    }
  });

  this.joinRoom = function(room){
    signaling_socket.emit('join', {"channel": room, "userdata": ssc.userdata});
  }
}

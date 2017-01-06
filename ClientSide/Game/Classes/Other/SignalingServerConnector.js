var SIGNALING_SERVER = 'http://127.0.0.1:3030'
var ROOM = 'OfficialRoom'
var CHAT_ROOM = 'ChatRoom'
var ICE_SERVERS = [
  {url:"stun:stun.l.google.com:19302"}
];

function SignalingServerConnector(ip,userdata,constantRooms){
  Reactor.apply(this,[]); //events adding ability

  this.registerEvent('newPeer');
  this.registerEvent('adoptedByHost');
  this.registerEvent('initializedAsHost');

  var ssc = this;
  this.signaling_socket = io.connect(ip)
  this.userdata = userdata || {};
  this.constantRooms = constantRooms;

  this.peers = {};
  this.host = null;

  var ss = this.signaling_socket;
  //default listeners
  ss.on('connect', function(){
    console.log('Connected to',ip);
    console.log('Rooms to join:',ssc.constantRooms)
    for (var r in ssc.constantRooms)
      ssc.joinRoom(ssc.constantRooms[r])
  });
  ss.on('disconnect', function(){
    console.log('Disconnected from',ip);
    
    ssc.peers = {};
    ssc.host = null;
  });
  ss.on('joinedRoom', function(config){
    console.log(config)
    console.log('Joined room',config.roomName)
    var host = ssc.connectToPeer(config);
    ssc.host = host;
    var opened = 0;
    host.peerConnection.addEventListener('datachannel', function(e){
      opened++;
      if (opened == 2) ssc.dispatchEvent('adoptedByHost',host)
    })
    host.sendDataChannel.addEventListener('open', function(e){
      opened++;
      if (opened == 2) ssc.dispatchEvent('adoptedByHost',host)
    })
  });
  ss.on('roomCreated', function(config){
    console.log('Room', config.roomName, 'created')
    ssc.dispatchEvent('initializedAsHost')
  });
  ss.on('error', function(err){
    console.warn(err)
  });
  ss.on('addPeer', function(config){
    ssc.connectToPeer(config)
  })

  this.connectToPeer = function(config){
    var peer_id = config.peer_id;
    var userdata = config.userdata
    if (!userdata.nick) userdata.nick = peer_id

    if (peer_id in ssc.peers) {
        console.log("Already connected to peerConnection ", peer_id);
        return false;
    }
    var peer_connection = new RTCPeerConnection(
        {"iceServers": ICE_SERVERS},
        {"optional": [{"DtlsSrtpKeyAgreement": true}]}
    );
    ssc.peers[peer_id] = {id: peer_id, userdata: userdata};
    ssc.peers[peer_id].peerConnection = peer_connection;
    var sdchannel = peer_connection.createDataChannel(peer_id);

    sdchannel.onopen = function() {
      sdchannel.send(JSON.stringify({type: 'notification', value:'Hi!'}));
      //activePeers.push(sdchannel.label)
    };
    ssc.peers[peer_id].peerConnection.ondatachannel = function(rdchannel) {
      ssc.peers[peer_id].recevingDataChannel = rdchannel.channel;
    }
    ssc.peers[peer_id].sendDataChannel = sdchannel;

    console.log('Connected with',peer_id,JSON.stringify(userdata))

    peer_connection.onicecandidate = function(event) {
      if (event.candidate)
        ss.emit('relayICECandidate', {
          'peer_id': peer_id,
          'ice_candidate': {
            'sdpMLineIndex': event.candidate.sdpMLineIndex,
            'candidate': event.candidate.candidate
          }
        });
    }

    if (config.should_create_offer)
      peer_connection.createOffer(
        function(local_description) {
          peer_connection.setLocalDescription(local_description,
            function() {
              ss.emit('relaySessionDescription', {
                'peer_id': peer_id,
                'session_description': local_description
              });
            },
            function() {
              Alert("Offer setLocalDescription failed!");
            }
          );
        },
        function(error) {
          console.error("Error sending offer: ", error);
        });
    console.log(ssc.peers,peer_id)
    return ssc.peers[peer_id];
  }

  this.joinRoom = function(room){
    ss.emit('join', {"channel": room, "userdata": ssc.userdata});
  }

  this.createRoom = function(roomName){
    ss.emit('createRoom', {"roomName": roomName});
  }
}

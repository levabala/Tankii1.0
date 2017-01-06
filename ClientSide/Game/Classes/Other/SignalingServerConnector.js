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
  this.myid;

  this.peers = {};
  this.host = null;

  var ss = this.signaling_socket;
  //default listeners
  ss.on('connect', function(myid){
    console.log('Connected to',ip);
    console.log('My id:', ss.id);
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
    console.warn('Joined room',config.roomName,'by',config.peer_id)
    var host = ssc.connectToPeer(config);
    if (!host) return;
    ssc.host = host;
    var opened = host.peerConnection.opened;
    host.peerConnection.addEventListener('datachannel', function(e){
      opened++;
      console.warn('datachannel',opened)
      if (opened == 2) ssc.dispatchEvent('adoptedByHost',host)
    })
    host.sendDataChannel.addEventListener('open', function(e){
      opened++;
      console.warn('open',opened)
      if (opened == 2) ssc.dispatchEvent('adoptedByHost',host)
    })
  });
  ss.on('roomCreated', function(config){
    console.warn('Room', config.roomName, 'created')
    ssc.dispatchEvent('initializedAsHost')
  });
  ss.on('error', function(err){
    console.warn(err)
  });
  ss.on('addPeer', function(config){
    ssc.connectToPeer(config)
  })
  ss.on('removePeer', function(config){
    if (config.peer_id in ssc.peers) {
      console.log('Disconnected from',config.peer_id,Object.keys(ssc.peers).length)
      delete ssc.peers[config.peer_id];
    }
  });
  ss.on('sessionDescription', function(config) {
    var peer_id = config.peer_id;
    var peerConnection = ssc.peers[peer_id].peerConnection;
    var remote_description = config.session_description;
    var desc = new RTCSessionDescription(remote_description);
    var stuff = peerConnection.setRemoteDescription(desc,
      function() {
        if (remote_description.type == "offer") {
          peerConnection.createAnswer(
            function(local_description) {
              peerConnection.setLocalDescription(local_description,
                function() {
                  ss.emit('relaySessionDescription', {
                    'peer_id': peer_id,
                    'session_description': local_description
                  });
                },
                function() {
                  Alert("Answer setLocalDescription failed!");
                }
              );
            },
            function(error) {
              console.error("Error creating answer: ", error);
              console.warn(peerConnection);
            });
        }
      },
      function(error) {
        console.error("setRemoteDescription error: ", error);
      }
    );
  });
  ss.on('iceCandidate', function(config) {
    var peer = ssc.peers[config.peer_id];
    var ice_candidate = config.ice_candidate;
    peer.peerConnection.addIceCandidate(new RTCIceCandidate(ice_candidate));
  });

  this.connectToPeer = function(config){
    var peer_id = config.peer_id;
    var userdata = config.userdata
    if (!userdata.nick) userdata.nick = peer_id

    if (peer_id in ssc.peers)
        return false;

    var peer_connection = new RTCPeerConnection(
        {"iceServers": ICE_SERVERS},
        {"optional": [{"DtlsSrtpKeyAgreement": true}]}
    );
    ssc.peers[peer_id] = {id: peer_id, userdata: userdata};
    ssc.peers[peer_id].peerConnection = peer_connection;
    var sdchannel = peer_connection.createDataChannel(peer_id);

    sdchannel.onopen = function() {
      sdchannel.send(JSON.stringify({type: 'notification', value:'Hi!'}));
    };    
    ssc.peers[peer_id].peerConnection.ondatachannel = function(rdchannel) {
      ssc.peers[peer_id].recevingDataChannel = rdchannel.channel;
    }
    ssc.peers[peer_id].sendDataChannel = sdchannel;

    console.log('Connected to',peer_id,JSON.stringify(userdata),Object.keys(ssc.peers).length)

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

    if (config.should_create_offer){
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
    }
    return ssc.peers[peer_id];
  }

  this.joinRoom = function(room){
    ss.emit('join', {"channel": room, "userdata": ssc.userdata});
  }

  this.createRoom = function(roomName){
    ss.emit('createRoom', {"roomName": roomName});
  }
}

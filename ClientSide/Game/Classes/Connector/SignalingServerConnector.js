var SIGNALING_SERVER = 'http://127.0.0.1:3030'
var ROOM = 'OfficialRoom'
var CHAT_ROOM = 'ChatRoom'
var ICE_SERVERS = [
  {url:"stun:stun.l.google.com:19302"}
];

function SignalingServerConnector(ip,userdata,constantRooms){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('joinedRoom');
  this.registerEvent('roomInstanceCreated');
  this.registerEvent('peerMessage');

  var ssc = this;
  this.signaling_socket = io.connect(ip)
  this.userdata = userdata || {};
  this.constantRooms = constantRooms;
  this.myid;

  this.rooms = {}; //{roomName}
  this.allPeers = {};

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
    ssc.allPeers = {};
    ssc.host = {};
  });
  ss.on('joinedRoom', function(config){
    console.warn('Joined room',config.roomName,'by',config.peer_id)
    var hostId = ssc.connectToPeer(config);
    var host = ssc.allPeers[hostId];
    if (!host) return;

    var room = new Room(config.roomName,host);
    ssc.rooms[config.roomName] = room;
    ssc.dispatchEvent('roomInstanceCreated',room)
  });
  ss.on('roomCreated', function(config){
    console.warn('Room', config.roomName, 'created')

    var room = new Room(config.roomName);
    ssc.rooms[config.roomName] = room;
    ssc.dispatchEvent('roomInstanceCreated',room)
  });
  ss.on('serverError', function(err){
    console.warn(err)
  });
  ss.on('addPeer', function(config){
    ssc.connectToPeer(config)
  })
  ss.on('removePeer', function(config){
    if (config.peer_id in ssc.allPeers) {
      console.log('Disconnected from',config.peer_id,Object.keys(ssc.allPeers).length)
      delete ssc.allPeers[config.peer_id];
    }
  });
  //<editor-fold>Two things whick I don't understand (sessionDescription&iceCandidate)
  ss.on('sessionDescription', function(config) {
    var peer_id = config.peer_id;
    var peerConnection = ssc.allPeers[peer_id].peerConnection;
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
    var peer = ssc.allPeers[config.peer_id];
    var ice_candidate = config.ice_candidate;
    peer.peerConnection.addIceCandidate(new RTCIceCandidate(ice_candidate));
  });
  //</editor-fold>

  this.connectToPeer = function(config){
    var peer_id = config.peer_id;
    var userdata = config.userdata
    var roomName = config.roomName;
    if (!userdata.nick) userdata.nick = peer_id

    if (peer_id in ssc.allPeers)
        return peer_id;

    var peer_connection = new RTCPeerConnection(
        {"iceServers": ICE_SERVERS},
        {"optional": [{"DtlsSrtpKeyAgreement": true}]}
    );
    var peer = {id: peer_id, userdata: userdata};
    peer.peerConnection = peer_connection;

    var sdchannel = peer_connection.createDataChannel(peer_id);

    sdchannel.onopen = function() {
      sdchannel.send(JSON.stringify({type: 'notification', value:'Hi!'}));
    };
    peer.peerConnection.ondatachannel = function(rdchannel) {
      peer.recevingDataChannel = rdchannel.channel;
      peer.recevingDataChannel.addEventListener('message', function(e){
        ssc.dispatchEvent('peerMessage',ssc.allPeers[peer_id],Message.fromJSON(e.data))
      });
    }
    peer.sendDataChannel = sdchannel;

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

    ssc.allPeers[peer_id] = peer;
    if (ssc.rooms[roomName]) ssc.rooms[roomName].addPeer(peer)

    console.log('Connected to',peer_id,JSON.stringify(userdata),Object.keys(ssc.allPeers).length)

    return peer_id;
  }

  this.joinRoom = function(room){
    ss.emit('join', {"channel": room, "userdata": ssc.userdata});
  }

  this.createRoom = function(roomName){
    ss.emit('createRoom', {"roomName": roomName});
  }
}

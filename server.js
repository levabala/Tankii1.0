var ERRORS = {
  0: 'Room already created',
  1: 'Invalid room name'
}

var os = require('os');
var PORT = 3030;
var nodeStatic = require('node-static');
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var countplayers = 0;
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/Client/index.html');
});

app.use('/', express.static(__dirname + '/Client'))

http.listen(PORT, function() {
  console.log('listening on *:' + PORT);
});


var channels = {};
var creators = {};
var sockets = {};

io.sockets.on('connection', function(socket) {
  socket.channels = {};
  sockets[socket.id] = socket;
  sendServersList();

  console.log("[" + socket.id + "] connection accepted");
  socket.on('disconnect', function() {
    for (var channel in socket.channels) {
      part(channel);
    }
    console.log("[" + socket.id + "] disconnected");
    delete sockets[socket.id];
  });

  socket.on('getServers', function() {
    sendServersList();
  });

  function sendServersList() {
    var list = [];
    for (var c in channels)
      list.push(c)
    socket.emit('Servers', list)
  }

  socket.on('getPlayersCount', function() {
    socket.emit('PlayersCount', Object.keys(sockets).length);
  });

  socket.on('createRoom', function(config) {
    var roomName = config.roomName;
    if (channels[roomName]) {
      socket.emit('error', ERRORS[0])
      return;
    }

    channels[channel] = {
      peers: {

      },
      creator: socket.id
    };
  });

  socket.on('join', function(config) {
    var channel = config.channel;
    var userdata = config.userdata || {};
    if (!userdata.nick) userdata.nick = socket.id;
    socket['userdata'] = userdata;
    console.log(userdata)

    console.log("Player [" + socket.id + "](" + userdata.nick + ") joined ");
    console.log("Count of players: " + (countplayers + 1));

    if (channel in socket.channels) {
      console.log("[" + socket.id + "] ERROR: already joined ", channel);
      return;
    }

    if (!(channel in channels)) {
      if (channel in sockets) {
        socket.emit('error', ERRORS[1])
        return;
      }
      channels[channel] = {
        peers: {},
        creator: socket
      };
      socket.emit('roomCreated', {roomName: channel});
      console.log('New Channel Created. Creator: ', socket.id)
    } else socket.emit('joinedRoom', {
      'peer_id': channels[channel].creator.id,
      'should_create_offer': true,
      'userdata': channels[channel].creator.userdata,
      'roomName': channel
    });    

    for (id in channels[channel].peers) {
      channels[channel].peers[id].emit('addPeer', {
        'peer_id': socket.id,
        'should_create_offer': false,
        'userdata': userdata
      });
      socket.emit('addPeer', {
        'peer_id': id,
        'should_create_offer': true,
        'userdata': channels[channel].peers[id].userdata
      });
    }

    channels[channel].peers[socket.id] = socket;
    socket.channels[channel] = channel;
  });

  function part(channel) {
    console.log("[" + socket.id + "] part ");

    if (!(channel in socket.channels)) {
      console.log("[" + socket.id + "] ERROR: not in ", channel);
      return;
    }

    delete socket.channels[channel];
    delete channels[channel].peers[socket.id];

    if (socket.id == channels[channel].creator) {
      console.log('Channel [', channel, '] has been closed')
      for (id in channels[channel].peers) {
        channels[channel].peers[id].emit('RoomClosed');
        delete sockets[id].channels[channel];
      }
      delete channels[channel];
      return;
    }

    for (id in channels[channel].peers) {
      channels[channel].peers[id].emit('removePeer', {
        'peer_id': socket.id
      });
      socket.emit('removePeer', {
        'peer_id': id
      });
      return;
    }

    if (Object.keys(channels[channel].peers).length == 0 && channel != 'OfficialRoom' && channel != 'ChatRoom')
      delete channels[channel];
  }
  socket.on('part', part);

  socket.on('relayICECandidate', function(config) {
    var peer_id = config.peer_id;
    var ice_candidate = config.ice_candidate;
    if (peer_id in sockets)
      sockets[peer_id].emit('iceCandidate', {
        'peer_id': socket.id,
        'ice_candidate': ice_candidate
      });
  });
  socket.on('relaySessionDescription', function(config) {
    var peer_id = config.peer_id;
    var session_description = config.session_description;
    if (peer_id in sockets)
      sockets[peer_id].emit('sessionDescription', {
        'peer_id': socket.id,
        'session_description': session_description
      });
  });
});

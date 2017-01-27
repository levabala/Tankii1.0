function Room(name){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('newPeer');
  this.registerEvent('adoptedByHost');
  this.registerEvent('initializedAsHost');
  this.registerEvent('hostMessage');
  this.registerEvent('peerMessage');

  var room = this;

  this.name = name;
  this.host = null;
  this.peers = {}; 

  this.setHost = function(host){
    room.host = host;
    if (host){
      var opened = 0;
      host.peerConnection.ondatachannel = function(rdchannel){
        host.recevingDataChannel = rdchannel.channel;
        host.recevingDataChannel.addEventListener('message', function(e){
          var m = Message.fromJSON(e.data)
          room.dispatchEvent('hostMessage',m)
        });
        opened++;
        if (opened == 2) room.dispatchEvent('adoptedByHost',host)
      }

      host.sendDataChannel.onopen = function(e){
        opened++;
        if (opened == 2) room.dispatchEvent('adoptedByHost',host)
      }
    }
    else {
      room.dispatchEvent('initializedAsHost')
    }
  }

  this.addPeer = function(peer){
    room.peers[peer.id] = peer;
    peer.peerConnection.addEventListener('datachannel', function(rdchannel) {
      peer.recevingDataChannel = rdchannel.channel;
      peer.recevingDataChannel.addEventListener('message', function(e){
        console.log(e.data)
        var m = Message.fromJSON(e.data);
        room.dispatchEvent('peerMessage', {peer: peer, message: m})
      });
    });
  }

  this.sendToHost = function(mess){
    room.host.sendDataChannel.send(mess.toJSON());
  }
}

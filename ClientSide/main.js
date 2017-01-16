var connector = new Connector(SIGNALING_SERVER, {nick: 'anonymous'}, ['ChatRoom', 'OfficialRoom'])
var svg = $('#SVGRoom');
var snap = Snap('#SVGRoom');

connector.addEventListener('roomInstanceCreated', function(room){
  var prefix = '|'+room.name+'|';
  room.addEventListener('adoptedByHost', function(host){
    room.sendToHost(new Message('request','roomsnap'))
    console.warn(prefix, 'Adopted by Host', host.id, '(' + host.userdata.nick + ')')
  })

  room.addEventListener('initializedAsHost', function(){
    console.warn(prefix, 'Initializaed as host')
    if (room.name == 'ChatRoom') return;

    var map = new Map(50,40);
    window.getMap = function(){
      console.log(map.generateTextView())
    }
    map.fitToContainer(svg.width(),svg.height())
    svg.append(map.generateMesh());
    var gameroom = new GameRoom(snap,map)

    //setInterval(function(){console.log(map.generateTextView())},100);

    var ago1 = new Tank(new Pos(5,5),3,3,[0,0,1,0],5,snap,{
      speed: 8
    })
    gameroom.addObject(ago1)

    //setInterval(function(){ago1.actions.toLeft();},16);

    var mActioner = new ActionManager();
    var rActioner = new ActionManager(mActioner);
    mActioner.addEventListener('end',function(){console.warn('move end. pos:',tank.pos)});

    var keyMapDownTemplate = function(obj){
      return {
        38: function(){
          ago1.actions.toTop();
        },
        39: function(){
          ago1.actions.toRight();
        },
        40: function(){
          ago1.actions.toBottom();
        },
        37: function(){
          ago1.actions.toLeft();
        }
      }
    }

    var keymapdown1 = keyMapDownTemplate(ago1);

    var k = new KeyboardController(window,keymapdown1,{})

    /*var action1 = new MoveToRightAction(obj.pos,1,1)
    action1.id = 1;
    var action2 = new MoveToRightAction(obj.pos,1,1)
    action2.id = 2;
    var action3 = new MoveToRightAction(obj.pos,1,1)
    action3.id = 3;
    var rotateAction1 = new RotateAction(obj,[1,0,0,0])
    var rotateAction2 = new RotateAction(obj,[0,0,1,0])
    mActioner.initAction(action1);
    rActioner.initAction(rotateAction1);
    mActioner.initAction(action2);
    setTimeout(function(){mActioner.initAction(action3);},4000);
    setTimeout(function(){rActioner.initAction(rotateAction2);},3000);*/
  })

  room.addEventListener('hostMessage', function(message){
    console.warn(prefix, 'HostMessage:', message.value)
  })

  room.addEventListener('peerMessage', function(config){
    console.warn(prefix, 'PeerMessage from', config.peer.id, '(' + config.peer.userdata.nick + '):',config.message.value)
  })
})

function GameObject(pos,width,height,rotation,hp,snap,other){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('move')
  this.registerEvent('createObject')
  this.registerEvent('destructed')
  this.registerEvent('kill')

  var gobj = this;

  this.pos = pos;
  this.width = width;
  this.height = height;
  this.physical = 1;
  this.snap = snap;
  this.rotation = rotation || [1,0,0,0];
  this.rotationAngle = gobj.rotation[0] * 180 + gobj.rotation[1] * 270 + gobj.rotation[3] * 90;
  this.hp = (hp == 'immortal') ? 1 : hp;
  this.hpPercentage = 1;
  this.maxHp = this.hp;
  this.mortal = (hp == 'immortal') ? 0 : 1;
  this.MoveGroup = snap.group();
  this.RotateGroup = snap.group();
  this.RotateGroup.appendTo(this.MoveGroup)
  this.MoveMatrix = new Snap.Matrix();
  this.RotateMatrix = new Snap.Matrix();
  this.speed = 0;
  for (var o in other) this[o] = other[o];

  this.actions = {
    setPosition: function(p){
      gobj.dispatchEvent('move', p); //GameRoom'll move us
      var spl = gobj.MoveMatrix.split();      
      gobj.MoveMatrix.translate(-spl.dx, -spl.dy) //reset translation
      gobj.MoveMatrix.translate(gobj.pos.X, gobj.pos.Y)
      //requestAnimationFrame(function(){
        gobj.MoveGroup.transform(gobj.MoveMatrix);
      //});
      gobj.pos = p.clone();
    },
    setMapPosition: function(p){
      //p.X = Math.round(p.X)
      //p.Y = Math.round(p.Y)
      gobj.dispatchEvent('move', p); //GameRoom'll move us
    },
    setRotation: function(r){
      gobj.rotation = r;
      gobj.RotateMatrix.rotate(-gobj.rotationAngle, gobj.width / 2, gobj.height / 2);
      gobj.rotationAngle = (r) ? r[0] * 180 + r[1] * 270 + r[3] * 90 : 0;
      gobj.RotateMatrix.rotate(gobj.rotationAngle, gobj.width / 2, gobj.height / 2);
      requestAnimationFrame(function(){
        gobj.RotateGroup.transform(gobj.RotateMatrix);
      })
    },
    setHp: function(hp){
      gobj.hp = hp;
      gobj.hpPerc = gobj.hp / gobj.maxhp;
      gobj.MoveGroup.attr({'fill-opacity': gobj.hpPerc})
    },
    setSpeed: function(speed){
      gobj.speed = speed;
    }
  }

  this.damage = function(damage, damager){
    if (gobj.mortal) return;
    gobj.hp -= gobj.mortal * damage;
    if (gobj.hp <= 0){
      damager.dispatchEvent('kill', gobj);
      gobj.destructSelf();
    }
  }

  this.destructSelf = function(){
    gobj.hp = 0;
    gobj.MoveGroup.remove();
    gobj.dispatchEvent('destructed',gobj)
  }

  //generate and set "body" tag
  this.createSVGView = function(obj){
    obj.rotationAngle = (obj.rotation) ? obj.rotation[0] * 180 + obj.rotation[1] * 270 + obj.rotation[3] * 90 : 0;
    obj.MoveMatrix.translate(obj.pos.X, obj.pos.Y)
    obj.RotateMatrix.rotate(obj.rotationAngle, obj.width / 2, obj.height / 2);

    obj.MoveGroup.transform(obj.MoveMatrix);
    obj.RotateGroup.transform(obj.RotateMatrix);
    /*setAttr(obj.snapGroup, 'width', obj.width);
    setAttr(obj.snapGroup, 'height', obj.height);*/
  }
  this.createSVGView(this)

  //custom view
  this.generateView = function(obj){

  }
}

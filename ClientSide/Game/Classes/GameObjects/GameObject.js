function GameObject(pos,width,height,rotation,hp,other){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('move')
  this.registerEvent('destructed')
  this.registerEvent('kill')

  var gobj = this;

  this.pos = pos;
  this.width = width;
  this.height = height;
  this.physical = 1;
  this.rotation = rotation || [1,0,0,0];
  this.rotationAngle = gobj.rotation[0] * 180 + gobj.rotation[1] * 270 + gobj.rotation[3] * 90;
  this.hp = (hp == 'immortal') ? 1 : hp;
  this.hpPercentage = 1;
  this.maxHp = this.hp;
  this.mortal = (hp == 'immortal') ? 0 : 1;
  this.svgBody = document.createElementNS("http://www.w3.org/2000/svg",'g');
  this.oneCellMoveDuration = 0;  
  for (var o in other) this[o] = other[o];

  this.actions = {
    setPosition: function(p){
      gobj.dispatchEvent('move', p); //GameRoom'll move us
      setAttr(gobj.svgBody, 'transform', 'translate(' + gobj.pos.X + ',' + gobj.pos.Y  + ') rotate(' + gobj.rotationAngle + ',' + gobj.width/2 + ',' + gobj.height/2 + ')');
    },
    setRotation: function(r){
      gobj.rotation = r;
      gobj.rotationAngle = (r) ? r[0] * 180 + r[1] * 270 + r[3] * 90 : 0;
      setAttr(gobj.svgBody, 'transform', 'translate(' + gobj.pos.X + ',' + gobj.pos.Y  + ') rotate(' + gobj.rotationAngle + ',' + gobj.width/2 + ',' + gobj.height/2 + ')');
    },
    setHp: function(hp){
      gobj.hp = hp;
      gobj.hpPerc = gobj.hp / gobj.maxhp;
      gobj.svgBody.setAttributeNS(null,'fill-opacity', gobj.hpPerc)
    },
    setOneCellMoveDuration: function(duration){
      console.log('oneCellMoveDuration:', duration + 'ms')
      gobj.oneCellMoveDuration = duration;
      setAttr(gobj.animationTag, 'dur', '1s');//duration + 'ms');
    }
  }

  this.damaged = function(damage, damager){
    gobj.hp -= gobj.mortal * damage;
    if (gobj.hp <= 0){
      damager.dispatchEvent('kill', gobj);
      gobj.destructSelf();
    }
  }

  this.destructSelf = function(){
    gobj.hp = 0;
    gobj.dispatchEvent('destructed')
  }

  //generate and set "body" tag
  this.createSvgBody = function(obj){
    obj.rotationAngle = (obj.rotation) ? obj.rotation[0] * 180 + obj.rotation[1] * 270 + obj.rotation[3] * 90 : 0;
    setAttr(obj.svgBody, 'transform', 'translate(' + obj.pos.X + ',' + obj.pos.Y  + ') rotate(' + obj.rotationAngle + ',' + obj.width/2 + ',' + obj.height/2 + ')');
    setAttr(obj.svgBody, 'width', obj.width);
    setAttr(obj.svgBody, 'height', obj.height);
  }
}

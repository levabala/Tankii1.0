function GameObject(pos,width,height,hp,other){
  Reactor.apply(this,[]); //events adding ability
  this.registerEvent('destructed')
  this.registerEvent('kill')

  var gobj = this;

  this.pos = pos;
  this.width = width;
  this.height = height;
  this.hp = (hp == 'immortal') ? 1 : hp;
  this.mortal = (hp == 'immortal') ? 0 : 1;
  for (var o in other) this.[o] = other[o];

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
  this.createBaseBody = function(obj){
    var r = (obj.rotation) ? obj.rotation[0] * 180 + obj.rotation[1] * 270 + obj.rotation[3] * 90 : 0;
    obj.svgBody = document.createElementNS("http://www.w3.org/2000/svg",'g');
    setAttr(obj.svgBody, 'transform', 'translate(' + obj.pos.X + ',' + obj.pos.Y  + ') rotate(' + r + ',' + obj.width/2 + ',' + obj.height/2 + ')');
    setAttr(obj.svgBody, 'width', obj.width);
    setAttr(obj.svgBody, 'height', obj.height);
  }
}

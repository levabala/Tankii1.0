function Tank(){
  ActiveGameObject.apply(this,arguments);

  var tank = this;

  this.maxAmmo = 30;
  this.ammunition = [];
  for (var i = 0; i < this.maxAmmo; i++)
    this.ammunition.push(new Shell(new Pos(0,0),1,1,tank.rotation,1,snap,{speed: 15, color: 'black', owner: tank}));

  this.actioners['sActiner'] = new ActionManager();
  this.actions['shoot'] = function(){
    var x = tank.mapPos.X+tank.rotation[3]*-1+tank.rotation[1]*tank.width+(1-(tank.rotation[1]+tank.rotation[3]))*Math.floor(tank.width/2);
    var y = tank.mapPos.Y+tank.rotation[0]*-1+tank.rotation[2]*tank.height+(1-(tank.rotation[0]+tank.rotation[2]))*Math.floor(tank.height/2);    
    if (!tank.ammunition.length){
      console.warn('Out of ammo')
      return;
    }
    if (tank.map.isPhysical(x,y)) {
      console.warn('Can\'t shoot')
      return;
    }
    var shell = tank.ammunition[tank.ammunition.length-1];
    shell.mapPos = new Pos(x,y)
    shell.actions.setPosition(new Pos(x,y));
    shell.actions.setRotation(tank.rotation);
    shell.rotationIndex = tank.rotation.indexOf(1);
    tank.dispatchEvent('createObject', shell)
    shell.fly();
    tank.ammunition.pop();
  }

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height).attr({fill: tank.color})
    var turret = obj.snap.rect(1,1,obj.width-2,2).attr({fill: 'darkred'})
    var gun = obj.snap.rect(obj.width*0.4,2,obj.width*0.2,obj.height-2).attr({fill: 'red'})

    rect.appendTo(obj.RotateGroup);
    turret.appendTo(obj.RotateGroup);
    gun.appendTo(obj.RotateGroup);
  }
  this.generateView(this)
}

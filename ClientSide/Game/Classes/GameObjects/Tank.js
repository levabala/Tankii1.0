function Tank(){
  ActiveGameObject.apply(this,arguments);

  var tank = this;

  this.aliveShells = 0;
  this.actioners['sActiner'] = new ActionManager();
  this.actions['shoot'] = function(){
    var x = tank.pos.X+tank.rotation[3]*-1+tank.rotation[1]*tank.width+(1-(tank.rotation[1]+tank.rotation[3]))*Math.floor(tank.width/2);
    var y = tank.pos.Y+tank.rotation[0]*-1+tank.rotation[2]*tank.height+(1-(tank.rotation[0]+tank.rotation[2]))*Math.floor(tank.height/2);
    //console.log(x,y)    
    var shell = new Shell(new Pos(x,y),1,1,tank.rotation,1,snap,{
      speed: 25,
      color: 'black'
    })
    shell.owner = tank;
    tank.dispatchEvent('createObject', shell)
    shell.fly();
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

function Shell(){
  ActiveGameObject.apply(this,arguments)

  var shell = this;

  var damageAndDestructSelf = function(obj){
    obj.damage(1, shell.owner)
    shell.destructSelf();
  }
  this.collisionCaseAction = function(obj){
    damageAndDestructSelf(obj);
  }

  var funs = [
    function(){
      var collResult = shell.checkCollisionFuns[0]();
      if (collResult)
        damageAndDestructSelf(collResult)
      else shell.movings.moveToTop();
    },
    function(){
      var collResult = shell.checkCollisionFuns[1]();
      if (collResult)
        damageAndDestructSelf(collResult)
      else shell.movings.moveToRight();
    },
    function(){
      var collResult = shell.checkCollisionFuns[2]();
      if (collResult)
        damageAndDestructSelf(collResult)
        else shell.movings.moveToBottom();
    },
    function(){
      var collResult = shell.checkCollisionFuns[3]();
      if (collResult)
        damageAndDestructSelf(collResult)
      else shell.movings.moveToLeft();
    }
  ]

  var r = this.rotation.indexOf(1);
  this.fly = function(){
    funs[r]();
  }
  this.actioners.mActioner.addEventListener('end',function(){        
    shell.fly();
  })

  this.generateView = function(obj){
    var rect = obj.snap.rect(0,0,obj.width,obj.height).attr({fill: 'black'})
    rect.appendTo(obj.RotateGroup);
  }
  this.generateView(this);
}

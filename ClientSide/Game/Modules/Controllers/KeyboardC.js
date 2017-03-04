function KeyboardC(){
  Controller.apply(this,arguments);

  var kc = this;

  this.keyBindings = {
    keydown: {
      38: function(){kc.targetObject.actions.setPath([0,0,0,0]).actions.followPath();},
      39: function(){kc.targetObject.actions.setPath([1,1,1,1]).actions.followPath();},
      40: function(){kc.targetObject.actions.setPath([2,2,2,2]).actions.followPath();},
      37: function(){kc.targetObject.actions.setPath([3,3,3,3]).actions.followPath();},
    },
    keypress: {},
    keyup: {
      38: function(){kc.shortcuts.stopMoving()},
      39: function(){kc.shortcuts.stopMoving()},
      40: function(){kc.shortcuts.stopMoving()},
      37: function(){kc.shortcuts.stopMoving()},
    }
  };

  /*document.body.addEventListener('keydown',function(e){    
    if (e.keyCode in kc.keyBindings.keydown)
      kc.keyBindings.keydown[e.keyCode]();
  });
  document.body.addEventListener('keyup',function(e){
    if (e.keyCode in kc.keyBindings.keydown)
      kc.keyBindings.keyup[e.keyCode]();
  });*/

  var element = document.body;
  var buffer = [];
  var enabled = true;
  element.addEventListener('keydown', keydown);
  element.addEventListener('keyup', keyup);

  function keyup(e){
    if (typeof kc.keyBindings.keyup[e.keyCode] != 'undefined')
      kc.keyBindings.keyup[e.keyCode]();

    var bnew = [];
    for (var b = 0; b < buffer.length; b++)
      if (buffer[b] != e.keyCode)
        bnew[bnew.length] = buffer[b];
    buffer = bnew;
  }

  function keydown(e){
    if (typeof kc.keyBindings.keydown[e.keyCode] != 'undefined')
      buffer.push(e.keyCode);
  }

  !function tick(){if (buffer.length > 0)
    if (typeof kc.keyBindings.keydown[buffer[buffer.length-1]] != 'undefined')
      kc.keyBindings.keydown[buffer[buffer.length-1]]();
    requestAnimationFrame(tick);
  }();  

  this.disable = function(){
    //clearInterval(interval);
    enabled = false;
    element.removeEventListener('keydown', keydown);
    element.removeEventListener('keyup', keyup);
  }
}
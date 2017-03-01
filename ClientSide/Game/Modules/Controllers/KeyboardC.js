function KeyboardC(){
  Controller.apply(this,arguments);

  var kc = this;

  this.keyBindings = {
    keydown: {
      38: function(){kc.executeAction('move',[0])},
      39: function(){kc.executeAction('move',[1])},
      40: function(){kc.executeAction('move',[2])},
      37: function(){kc.executeAction('move',[3])},
    },
    keypress: {},
    keyup: {
      38: function(){kc.shortcuts.stopMoving()},
      39: function(){kc.shortcuts.stopMoving()},
      40: function(){kc.shortcuts.stopMoving()},
      37: function(){kc.shortcuts.stopMoving()},
    }
  };

  document.body.addEventListener('keydown',function(e){
    if (e.keyCode in kc.keyBindings.keydown)
      kc.keyBindings.keydown[e.keyCode]();
  });
  document.body.addEventListener('keyup',function(e){
    if (e.keyCode in kc.keyBindings.keydown)
      kc.keyBindings.keyup[e.keyCode]();
  });
}
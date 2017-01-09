function KeyboardController(element, keymapdown, keymapup){
  var elements = {};
  var buffer = [];
  element.addEventListener('keydown', keydown);
  element.addEventListener('keyup', keyup);

  function keyup(e){
    if (typeof keymapup[e.keyCode] != 'undefined')
      keymapup[e.keyCode]();

    var bnew = [];
    for (var b = 0; b < buffer.length; b++)
      if (buffer[b] != e.keyCode)
        bnew[bnew.length] = buffer[b];
    buffer = bnew;
  }

  function keydown(e){
    if (typeof keymapdown[e.keyCode] != 'undefined' || typeof keymapup[e.keyCode] != 'undefined')
      buffer[buffer.length] = e.keyCode;
  }

  var interval = setInterval(function(){
    if (buffer.length > 0)
      if (typeof keymapdown[buffer[buffer.length-1]] != 'undefined')
        keymapdown[buffer[buffer.length-1]]();
  }, 16);

  this.disable = function(){
    clearInterval(interval);
    element.removeEventListener('keydown', keydown);
    element.removeEventListener('keyup', keyup);
  }
}
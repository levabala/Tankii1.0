function Map(width,height){
  var map = this;
  this.width = width-1;
  this.height = height-1;
  this.field = [];
  this.xcoeff = 1;
  this.ycoeff = 1;

  //fill the field
  for (var w = 0; w < width; w++){
    this.field[w] = [];
    for (var h = 0; h < height; h++){
      this.field[w][h] = {pos: new Pos(w,h), obj: {physical: false}};
    }
  }

  this.isPhysical = function(x,y){
    return map.field[x][y].obj.physical;
  }

  this.setObject = function(obj){
    for (var dx = 0; dx < obj.width; dx++)
      for (var dy = 0; dy < obj.height; dy++)
        map.field[obj.pos.X + dx][obj.pos.Y + dy].obj = obj;
    //console.log(map.generateTextView())
  }

  this.removeObject = function(obj){
    //console.log('remove obj',obj)
    for (var dx = 0; dx < obj.width; dx++)
      for (var dy = 0; dy < obj.height; dy++)
        map.field[obj.pos.X + dx][obj.pos.Y + dy].obj = {physical: false};
    //console.log(map.generateTextView())
  }

  this.moveObjectByOneCell = [
    function toTop(obj){
      for (var dx = 0; dx < obj.width; dx++){
        map.field[obj.pos.X + dx][obj.pos.Y + obj.height].obj = {physical: false};
        map.field[obj.pos.X + dx][obj.pos.Y - 1].obj = obj;
      }
    },
    function toRight(obj){
      for (var dy = 0; dy < obj.height; dy++){
        map.field[obj.pos.X][obj.pos.Y + dy].obj = {physical: false};
        map.field[obj.pos.X + obj.width][obj.pos.Y + dy].obj = obj;
      }
    },
    function toBottom(obj){
      for (var dx = 0; dx < obj.width; dx++){
        map.field[obj.pos.X + dx][obj.pos.Y].obj = {physical: false};
        map.field[obj.pos.X + dx][obj.pos.Y + obj.height].obj = obj;
      }
    },
    function toLeft(obj){
      for (var dy = 0; dy < obj.height; dy++){
        map.field[obj.pos.X + obj.width - 1][obj.pos.Y + dy].obj = {physical: false};
        map.field[obj.pos.X - 1][obj.pos.Y + dy].obj = obj;
      }
    }
  ]

  this.fitToContainer = function(width,height){
    map.xcoeff = width / (map.field[map.field.length-1][0].pos.X + 1);
    map.ycoeff = height / (map.field[0][map.field[0].length-1].pos.Y + 1);

    if (map.xcoeff > map.ycoeff) map.xcoeff = map.ycoeff;
    else map.ycoeff = map.xcoeff;
  }

  this.generateMesh = function(snap,totalGroup){
    var g = snap.group();//document.createElementNS("http://www.w3.org/2000/svg",'g');    
    for (var ff in map.field[map.field.length-1]){      
      var line = snap.line(
        0, 
        map.field[map.field.length-1][ff].pos.Y,
        map.field[map.field.length-1][map.field[map.field.length-1].length-1].pos.X,
        map.field[map.field.length-1][ff].pos.Y
      );
      line.attr({
        strokeWidth: 0.1,
        stroke: 'red',
        'stroke-opacity': 0.5         
      });
      line.appendTo(totalGroup);
    }
    for (var ff in map.field){
      var line = snap.line(
        map.field[ff][0].pos.X, 
        0,
        map.field[ff][0].pos.X,
        map.field[0][map.field[0].length-1].pos.Y
      );
      line.attr({
        strokeWidth: 0.1,
        stroke: 'red',
        'stroke-opacity': 0.5         
      });
      line.appendTo(totalGroup);
    }    
  }

  this.generateTextView = function(){
    var str = '';
    for (var y = 0; y < map.field[0].length; y++){
      for (var x = 0; x < map.field.length; x++)
        str += (map.field[x][y].obj.physical) ? 1 : 0 ;
      str += '\n';
    }
    return str;
  }
}

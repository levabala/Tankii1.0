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

  this.fitToContainer = function(width,height){
    map.xcoeff = width / map.field[map.field.length-1][0].pos.X;
    map.ycoeff = height / map.field[0][map.field[0].length-1].pos.Y;

    if (map.xcoeff > map.ycoeff) map.xcoeff = map.ycoeff;
    else map.ycoeff = map.xcoeff
  }

  this.generateMesh = function(){
    var g = document.createElementNS("http://www.w3.org/2000/svg",'g');

    for (var ff in map.field[map.field.length-1]){
      var line = document.createElementNS("http://www.w3.org/2000/svg",'line');
      setAttr(line,'x1',0);
      setAttr(line,'x2',map.field[map.field.length-1][map.field[map.field.length-1].length-1].pos.X * map.xcoeff);
      setAttr(line,'y1',map.field[map.field.length-1][ff].pos.Y * map.ycoeff);
      setAttr(line,'y2',map.field[map.field.length-1][ff].pos.Y * map.ycoeff);
      setAttr(line,'style','stroke:rgb(255,0,0);stroke-width:1;stroke-opacity:0.5');
      g.appendChild(line)
    }
    for (var ff in map.field){
      var line = document.createElementNS("http://www.w3.org/2000/svg",'line');
      setAttr(line,'x1',map.field[ff][0].pos.X * map.xcoeff);
      setAttr(line,'x2',map.field[ff][0].pos.X * map.xcoeff);
      setAttr(line,'y1',0);
      setAttr(line,'y2',map.field[0][map.field[0].length-1].pos.Y * map.ycoeff);
      setAttr(line,'style','stroke:rgb(255,0,0);stroke-width:1;stroke-opacity:0.5');
      g.appendChild(line)
    }
    return g;
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

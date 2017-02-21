var SVG_MODELS = {
  GameObject: CreateSvgModel(  
   function(snap,obj){
     var mgroup = snap.group();
     var rgroup = snap.group();
     rgroup.appendTo(mgroup)
     var rect1 = snap.rect(0,0,obj.width,obj.height);     
     rect1.appendTo(rgroup);
     return {
      moveGroup: mgroup,
      rotateGroup: rgroup,
      moveMatrix: new Snap.Matrix(),
      rotateMatrix: new Snap.Matrix(),
      rect1: rect1 
     };
   },
   function(){

   },
   function(){

   },
   function(){

   }
  )
}

function CreateSvgModel(createFun,moveStartFun,moveEndFun,changeFun){
  return {
   create: createFun || function(snap,obj){
     var mgroup = snap.group();
     var rgroup = snap.group();
     rgroup.appendTo(mgroup)   
     return {
      rotateGroup: rgroup,    
      moveGroup: mgroup,
      moveMatrix: new Snap.Matrix(),
      rotateMatrix: new Snap.Matrix()
     };
   },
   moveStart: moveStartFun || function(){

   },
   moveEnd: moveEndFun || function(){

   },
   change: changeFun || function(){

   }
  }
}

function Animation(prop,to,speed){
  this.msSpeed = speed / 1000;
  this.property = prop;
  this.targetValue = to;
}



var SVG_MODELS_STRING = {
  example_1: 
  '<svg width=\"640\" height=\"480\" xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:svg=\"http:\/\/www.w3.org\/2000\/svg\">\r\n <!-- Created with SVG-edit - http:\/\/svg-edit.googlecode.com\/ -->\r\n <g>\r\n  <title>Layer 1<\/title>\r\n  <rect stroke-opacity=\"0\" id=\"svg_2\" height=\"200\" width=\"200\" y=\"120\" x=\"120\" stroke-width=\"5\" stroke=\"#000000\" fill=\"#FF0000\"\/>\r\n  <rect stroke=\"#000000\" id=\"svg_3\" stroke-opacity=\"0\" height=\"50\" width=\"142.000001\" y=\"199\" x=\"177.999999\" stroke-width=\"5\" fill=\"#7f00ff\"\/>\r\n <\/g>\r\n<\/svg>',  
}

for (var s in SVG_MODELS_STRING){
  var parser = new DOMParser();
  var doc = parser.parseFromString(SVG_MODELS_STRING[s], "image/svg+xml");  
  document.getElementById('tag1').appendChild(doc.firstChild)
}
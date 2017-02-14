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
      moveGroup: mgroup 
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
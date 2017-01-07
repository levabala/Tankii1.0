function Message(type,value){
  var mess = this;
  this.type = type;
  this.value = value;

  this.toJSON = function(){
    return JSON.stringify({type: mess.type, value: mess.value});
  }
}

Message.fromJSON = function(json){
  var m = JSON.parse(json);
  return new Message(m.type,m.value);
}

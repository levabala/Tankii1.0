function addScript(src) {
   var a = document.head || document.getElementsByTagName('head')[0];
   var b = document.createElement('script');
   b.type = 'text/javascript';
   b.src = src;
   a.appendChild(b);
}
var sources = [];
sources.push("../../../ExternalLibs/adapter.js");
sources.push("../../../ExternalLibs/jquery.js");
sources.push("../../../ExternalLibs/socket.io.js");
sources.push("../../../ExternalLibs/download.js");
sources.push("../../../ExternalLibs/fileDrop.js");
sources.push("../../../Game/common.js");
sources.push("../../../Game/Classes/Team.js");
sources.push("../../../Game/Classes/Event.js");
sources.push("../../../Game/Classes/Map.js");
sources.push("../../../Game/Classes/Bot.js");
sources.push("../../../Game/Classes/GameObjects/GameObject.js");
sources.push("../../../Game/Classes/GameObjects/MovableGameObject.js");
sources.push("../../../Game/Classes/GameObjects/Shell.js");
sources.push("../../../Game/Classes/GameObjects/Tank.js");
sources.push("../../../Game/Classes/GameObjects/Wall.js");
sources.push("../../../Game/Classes/TanksRoom.js");
sources.push("../../../Game/Classes/TanksRoomClient.js");
sources.push("../../../Game/Classes/TanksRoomServer.js");
for(i in sources)addScript(sources[i]);
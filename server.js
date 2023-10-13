const ws = require("ws");
const uuid = require("uuid");

const CLIENT_LIST = [];

const wss = new ws.WebSocketServer({
    port: 9999,
});

console.log("\x1b[32m Server is running...")

wss.on("connection", function (ws) {
    console.log("接続完了！");
    CLIENT_LIST.push(ws);

    ws.on("close", () => {
      CLIENT_LIST.forEach((user, index) => {
        if(user === ws){
          CLIENT_LIST.slice(index, 1);
        }
      });
    });

    ws.on("message", function (rawData) {
        const content = JSON.parse(rawData.toString());

        CLIENT_LIST.forEach(user => {
          if(user !== ws) {
            if("direction" in content){
              const direction = content.direction;
              switch(direction){
                case "left":
                  sendCommand("/setblock -23 -60 3 redstone_block");
                  break;
                case "center":
                  sendCommand("/setblock -23 -60 -1 redstone_block");
                  break;
                case "right":
                  sendCommand("/setblock -23 -60 -5 redstone_block");
                  break;
              } 
            }
            else if("header" in content){
              if(content.header.eventName === "PlayerMessage"){
                const command = content.body.message.split("] ")[1]
                user.send(command)
              }
            }
            else{
              user.send(rawData.toString())
            }
          }
        });
    
    });

    const subscribeMessageJSON = {
        "header": {
          "version": 1, // プロトコルのバージョンを指定。1.18.2の時点では1で問題ない
          "requestId": uuid.v4(), // UUIDv4を指定
          "messageType": "commandRequest",  // "commandRequest" を指定
          "messagePurpose": "subscribe", // "subscribe" を指定
        },
        "body": {
          "eventName": "PlayerMessage" // イベント名を指定。(PlayerMessage)
        },
      };
    
      // イベント購読用のJSONをシリアライズ（文字列化）して送信
      ws.send(JSON.stringify(subscribeMessageJSON));

      function sendCommand(cmd) {
        const requestId = uuid.v4()
      
        CLIENT_LIST.forEach(user => {
          user.send(JSON.stringify({
            header: {
                version: 1,
                requestId: requestId,
                messageType: "commandRequest",
                messagePurpose: "commandRequest",
                commandSetId: "",
            },
            body: {
                origin: {
                    type: "player", // 誰がコマンドを実行するかを指定
                },
                version: 1,
                commandLine: cmd, // マイクラで実行したいコマンドを指定
            },
          }));
        });

      
        return requestId;
      }
});



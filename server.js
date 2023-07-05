const ws = require("ws");
const uuid = require("uuid");
require('dotenv').config();
const nodeFetch = require("node-fetch");

const wss = new ws.WebSocketServer({
    port: 9999,
});

console.log("\x1b[32m Server is running...")

wss.on("connection", function (ws) {
    console.log("接続完了！");

    ws.on("message", function (rawData) {
        const content = JSON.parse(rawData.toString());

        if("body" in content){
            const chatMsg = content.body.message;

            if(chatMsg.includes("gpt: ")){
                getGpt(chatMsg.split("gpt: ")[1]);
            }
        }
    
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

        ws.send(JSON.stringify({
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

        return requestId;
    }

    function getGpt(chatMsg){
        const URL = process.env.URL
        const API_KEY = process.env.API_KEY

        nodeFetch(URL, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                "Content-type": "application/json"
             },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", "content": chatMsg}]
            })
        }).then((res) => {
            return res.json();
        }).then((json) => {
            sendCommand(`/say ${json.choices[0].message.content}`);
        });
    }
});
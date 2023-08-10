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

            if(chatMsg.includes("open")){
                openLocker();
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


    function openLocker(){
        const URL = process.env.URL
        const API_KEY = process.env.API_KEY

        nodeFetch(URL, {
            method: "POST",
            headers:{
                Authorization: `Basic ${btoa(API_KEY)}`
            }
        })
    }
});
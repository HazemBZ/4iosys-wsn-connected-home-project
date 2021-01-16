let mqtt = require('mqtt')
const WebSocket = require('ws')



// websocket Server setup
const server = new WebSocket.Server({
  port:8000
})

let sockets = []
server.on('connection', (socket) => {
  sockets.push(socket)

  socket.on('message', (msg)=>{
    sockets.forEach( s => s.send(msg))
    console.log("[Received] " + msg);
  })
  socket.on('close', ()=>{
    sockets.filter( s => s !== socket)
  })
})

// mqtt setup 
const IP = "192.168.1.13";
const PORT ="1883";
const ENDPOINT = `mqtt://${IP}:${PORT}`;


let options = {
  clientId:"mqttjs01",
  username:"steve",
  password:"password",
  clean:true
};

let client = mqtt.connect(ENDPOINT)


console.log("starting client");

// on CONNECT
client.on('connect', ()=>{
  console.log("connected  "+client.connected);
})

// ON ERROR
client.on('error', (err)=>{
  console.log(`Error ${err}`);
})


// let delay = 5000 // 5s
// setInterval(()=>{client.publish(/*...*/)}, delay)

// PUBLISH
console.log("publishing");
function publish(topic, message) {
  if(client.connected == true) { // check if connected
    client.publish(topic, message)
    console.log("published message");
  } else {
    console.log("NOT CONNECTED");
  }
}

let timer = setInterval(()=>{publish("advertise","9999");publish("state/9999", "AOK")}, 3000)


// SUBSCRIBE
console.log("subscribing");
let subTopic=""
let subTopics = ["advertise", "state/123", "command/123"]
client.subscribe(subTopics, {qos:1})

// RECEIVE
console.log("receiving");
client.on('message', (topic, message, packet) => {
  console.log(`[received] Topic: ${topic}, Message:${message}, Packet:${packet}`);
})



// terminate connection
// client.end()
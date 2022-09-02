import { io } from 'socket.io-client'
import jsonpatch from 'fast-json-patch'

let client = io("ws://localhost:3000")

var data = {}

client.on('data', (obj) => {
    console.log("Received data", obj)
    data = obj
})
client.on('data-update', (patches) => {
    //console.log("Received data update", patches)
    jsonpatch.applyPatch(data, patches, true, true)
        //console.log("Data:", data)
})
client.on('event', (scope, event, _data) => {
    //console.log("Event:", scope, event, data)
    if (scope == "counter") {
        console.log("Counter:", data.counter)
    }
    if (scope == "manual-counter") {
        console.log("Manual counter:", data.manualCounter)
    }
})
client.on("ready", () => {
    client.emit("subscribe", "counter", "updated")
    client.emit("subscribe", "manual-counter", "updated")
        /*setInterval(() => {
            client.emit("publish", "manual-counter", "increment")
        }, 2000)*/
})
client.emit("join")
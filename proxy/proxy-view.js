import { View } from "@croquet/croquet"
import jsonpatch from 'fast-json-patch';
import { Channel } from "../src/model/subscriptions/channel.js";

export class ProxyView extends View {

    constructor(model) {
        super(model)
        this.model = model
        this.sockets = []
        this.observer = jsonpatch.observe(this.model.data)
        this.subscriptions = {}
    }

    addSocket(socket) {
        this.sockets.push(socket)

        console.log("Emitting data to client", this.model.data)
        socket.emit("data", this.model.data)

        socket.on("subscribe", (scope, event) => {
            let subscription = new Channel(scope, event)
            if (!this.subscriptions[subscription.key]) {
                this.subscriptions[subscription.key] = []
                this.subscribe(subscription.scope, subscription.event, (data) => this.handleEvent(scope, event, data))
            }
            this.subscriptions[subscription.key].push(socket)
        })

        socket.on("unsubscribe", (scope, event) => {
            let subscription = new Channel(scope, event)
            if (this.subscriptions[subscription.key]) {
                this.subscriptions[subscription.key].splice(this.subscriptions[subscription.key].indexOf(socket), 1)
                if (this.subscriptions[subscription.key].length == 0) {
                    delete this.subscriptions[subscription.key]
                    this.unsubscribe(subscription.scope, subscription.event)
                }
            }
        })

        socket.on("publish", (scope, event, data) => {
            this.publish(scope, event, data)
        })

        socket.emit("ready")
    }

    removeSocket(socket) {
        this.sockets.splice(this.sockets.indexOf(socket), 1)
            // remove all reference from subscriptions
        Object.keys(this.subscriptions).forEach(key => {
            this.subscriptions[key].splice(this.subscriptions[key].indexOf(socket), 1)
            if (this.subscriptions[key].length == 0) {
                delete this.subscriptions[key]
            }
        })
    }

    checkDataUpdate() {
        let patches = jsonpatch.generate(this.observer)
        if (patches.length > 0) {
            console.log("Emitting data update", patches)
            this.sockets.forEach(socket => {
                socket.emit("data-update", patches)
            })
        }
    }

    handleEvent(scope, event, data) {
        this.checkDataUpdate()
        let subscription = new Channel(scope, event)
        if (this.subscriptions[subscription.key]) {
            this.subscriptions[subscription.key].forEach(socket => {
                console.log("Emitting event", scope, event, data)
                socket.emit("event", scope, event, data)
            })
        }
    }

}
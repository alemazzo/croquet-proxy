import { Session } from "@croquet/croquet";
import { Server } from "socket.io";
import { CroquetProxyHandler } from "./proxy-handler.js";
import { ProxyView } from "./proxy-view.js";

export class CroquetProxyServer {

    static start(mainModelClass, allModelClasses, apiKey, appId, name, password, port = 3000) {
        let server = new CroquetProxyServer(mainModelClass, allModelClasses, apiKey, appId, name, password)
        server.run(port)
    }

    constructor(mainModelClass, allModelClasses, apiKey, appId, name, password) {
        this.apiKey = apiKey;
        this.appId = appId;
        this.name = name;
        this.password = password;
        allModelClasses.forEach(modelClass => {
            modelClass.register(modelClass.constructor.name)
        });
        this.mainModelClass = mainModelClass
    }

    handleNewConnection(socket) {
        this.sockets.push(socket)
        socket.on('join', () => {
            if (this.view == null) {
                Session.join({
                    apiKey: this.apiKey,
                    appId: this.appId,
                    name: this.name,
                    password: this.password,
                    step: "manual",
                    model: this.mainModelClass,
                    view: ProxyView
                }).then(({ id, model, view, step, leave }) => {
                    setInterval(step, 100)
                    this.model = model
                    this.view = view
                    this.leave = leave
                    this.view.addSocket(socket)
                });
            } else {
                this.view.addSocket(socket)
            }
        })
        socket.on('disconnect', () => {
            this.view.removeSocket(socket)
            this.sockets.splice(this.sockets.indexOf(socket), 1)
            if (this.sockets.length == 0) {
                this.view.detach()
                this.leave()
                this.model = null
                this.view = null
            }
        })
    }

    run(port) {
        this.io = new Server(port)
        console.log(`Server started on port`, port)
        this.sockets = []
        this.io.on("connection", (socket) => this.handleNewConnection(socket))
    }

}
import { Session } from "@croquet/croquet";
import { Server } from "socket.io";
import { ProxyView } from "./proxy-view.mjs";

export class CroquetProxyServer {

    static start(options) {
        let server = new CroquetProxyServer(options.mainModelClass, options.allModelClasses, options.apiKey, options.appId, options.name, options.password)
        server.run(options.port)
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
        socket.on('join', () => {
            this.view.addSocket(socket)
        })
        socket.on('disconnect', () => {
            this.view.removeSocket(socket)
        })
        socket.emit("connection-ready")
    }

    run(port) {
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
            this.leave = leave
            this.view = view

            this.io = new Server(port)
            console.log(`Server started on port`, port)
            this.io.on("connection", (socket) => this.handleNewConnection(socket))

        });

    }

}
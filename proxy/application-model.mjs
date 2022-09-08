import { Model, Session } from "@croquet/croquet";
import { DataModel } from "./data-model.mjs";
import { ProxyView } from "./proxy-view.mjs";
import { Server } from "socket.io";

export class ApplicationModel extends Model {

    init(options) {
        super.init(options);
        this.dataModel = DataModel.create()
        this.models = {}
    }

    registerComponent(modelClass) {
        modelClass.register(modelClass.prototype.constructor.name)
        let model = modelClass.create({ dataModel: this.dataModel })
        this.models[modelClass.name] = model
    }

    registerData(key, value) {
        this.dataModel.addData(key, value)
    }

    registerData(dict) {
        Object.keys(dict).forEach(key => {
            this.dataModel.addData(key, dict[key])
        })
    }

    getData() {
        return this.dataModel.getData()
    }

    static startProxy(options = { apiKey: "", appId: "", name: "", password: "", port: 3000 }) {
        this.register(this.prototype.constructor.name)
        Session.join({
            apiKey: options.apiKey,
            appId: options.appId,
            name: options.name,
            password: options.password,
            step: "manual",
            model: this,
            view: ProxyView
        }).then(({ id, model, view, step, leave }) => {
            setInterval(step, 100)
            let port = options.port || 3000
            this.io = new Server(port)
            console.log(`Server started on port`, port)
            this.io.on("connection", (socket) => {
                socket.on('join', () => {
                    view.addSocket(socket)
                })
                socket.on('disconnect', () => {
                    view.removeSocket(socket)
                })
                socket.emit("connection-ready")
            })
        });
    }
}

ApplicationModel.register("ApplicationModel")
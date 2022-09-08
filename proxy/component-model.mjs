import { DataModel } from "./data-model.mjs";
import { Model } from "@croquet/croquet";

export class ComponentModel extends Model {
    init(options) {
        super.init(options);
        this.dataModel = options.dataModel
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
}
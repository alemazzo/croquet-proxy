import { Model } from "@croquet/croquet"
export class DataModel extends Model {

    init() {
        this.data = {}
    }

    addData(key, value) {
        this.data[key] = value
    }

    getData() {
        return this.data
    }
}

DataModel.register("DataModel")
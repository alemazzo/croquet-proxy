import { Model } from "@croquet/croquet";

export class CounterModel extends Model {

    init(options) {
        super.init(options)
        this.data = { counter: 0, manualCounter: 0 }
        this.subscribe("manual-counter", "increment", this.onManualCounterIncrement)
        this.future(1000).tick();
    }

    tick() {
        this.data.counter++;
        this.publish("counter", "updated")
        this.future(1000).tick()
    }

    onManualCounterIncrement() {
        this.data.manualCounter++;
        this.publish("manual-counter", "updated")
    }

    onManualCounterDecrement() {
        this.data.manualCounter--;
        this.publish("manual-counter", "updated")
    }

}
export class Channel {
    constructor(scope, event) {
        this.scope = scope
        this.event = event
        this.key = `${scope}.${event}`
    }
}
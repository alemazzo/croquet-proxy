# croquet-proxy
A proxy for the Croquet platform.

## How to use
1. Install [Node.js](https://nodejs.org/en/download/)
2. Clone this repository
3. Run `npm install` in the repository directory
4. Define your own Model
```javascript
// my-model.js
import { Model } from '@croquet/croquet';
class MyModel extends Model {
    init(options) {
        super.init(options);

        // Define your model data always in the 'data' property
        this.data = { counter = 0 }

        this.future(1000).tick()
    }

    tick() {
        this.data.counter++
        this.publish('counter', 'updated')
        this.future(1000).tick()
    }
}
```
5. Define the starting point of your application
```javascript
// my-app.js
import { CroquetProxyServer } from './proxy/proxy-server.js';
import { MyModel } from './my-model.js';
const apiKey = ""
const appId = ""
const name = ""
const password = ""


CroquetProxyServer.start({
    mainModelClass: MyModel,
    allModelClasses: [MyModel],
    apiKey: apiKey,
    appId: appId,
    name: name,
    password: password,
    port: 3000
})
```
6. Run `node my-app.js`
# croquet-proxy
A proxy for the Croquet platform.

## How to use
1. Install [Node.js](https://nodejs.org/en/download/)
2. Create the project directory and navigate to it
3. Run `npm init` and follow the instructions
4. Run `npm install croquet-proxy`
5. Define your own Model
```javascript
// my-model.js
import { Model } from '@croquet/croquet';
class MyModel extends Model {
    init(options) {
        super.init(options);

        // Define your model data always in the 'data' property
        this.data = { counter: 0 }

        this.future(1000).tick()
    }

    tick() {
        this.data.counter++
        this.publish('counter', 'updated')
        this.future(1000).tick()
    }
}
```
6. Define the starting point of your application
```javascript
// my-app.js
import { CroquetProxyServer } from 'croquet-proxy';
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
import { config } from 'dotenv'
import { CounterModel } from "./counter-model.js";
import { CroquetProxyServer } from './proxy/proxy-server.js';
config()
const apiKey = process.env.API_KEY
const appId = process.env.APP_ID
const name = "test-new-version"
const password = "password"


CroquetProxyServer.start({
    mainModelClass: CounterModel,
    allModelClasses: [CounterModel],
    apiKey: apiKey,
    appId: appId,
    name: name,
    password: password,
    port: 3000
})
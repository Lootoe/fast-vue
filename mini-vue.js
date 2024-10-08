import { Observer } from "./Observer.js"
import { Compiler } from './Compile.js'

export class MiniVue {
    constructor(options) {
        this.$data = options.data
        this.$methods = options.methods
        this.$el = options.el

        // 代理data
        // 用户可以通过访问this，来间接访问data
        this.proxyData(this.$data)
        new Observer(this)
        new Compiler(this)
    }
    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newVal) {
                    data[key] = newVal
                }
            })
        })
    }
}
import { Dep } from "./Dep.js"

export class Observer {
    constructor(vm) {
        this.vm = vm
        this.observe(vm.$data)
    }
    observe(data) {
        if (typeof data !== 'object') return
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }
    defineReactive(data, key, value) {
        // 递归变成响应式
        this.observe(value)
        const dep = new Dep()
        const self = this
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get(){
                Dep.target && dep.add(Dep.target)
                return value
            },
            set(newVal){
                // data[key] = newVal
                value = newVal
                self.observe(newVal)
                dep.notify()
            }
        })
    }
}
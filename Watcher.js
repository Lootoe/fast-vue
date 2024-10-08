import { Dep } from './Dep.js'

export class Watcher {
    constructor(vm, key, updater) {
        this.vm = vm
        this.key = key
        this.updater = updater
        // 通过访问vm[key]触发get劫持，让Dep收集了这个watcher
        Dep.target = this
        this.oldVal = vm[key]
        Dep.target = null
    }
    update() {
        // 这里也会触发劫持，但是Dep.target不存在，所以不会再次收集该依赖
        const newVal = this.vm[this.key]
        if (this.oldVal !== newVal) {
            this.updater(newVal)
            this.oldVal = newVal
        }
    }
}

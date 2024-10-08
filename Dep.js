export class Dep {
    watchers = []
    constructor() {}
    add(watcher) {
        this.watchers.push(watcher)
    }
    notify() {
        this.watchers.forEach(v => v.update && v.update())
    }
}
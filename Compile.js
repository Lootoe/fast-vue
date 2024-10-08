import { Watcher } from "./Watcher.js"

export class Compiler {
    constructor(vm) {
        this.vm = vm
        this.methods = vm.$methods
        const root = document.querySelector(vm.$el)
        const nodes = root.childNodes
        this.compile(nodes)
    }
    compile(nodes) {
        // 将类数组转换为数组
        Array.from(nodes).forEach(node => {
            if (this.isTextNode(node)) {
                this.compileTextNode(node)
            } else if (this.isElementNode(node)) {
                this.compileElementNode(node)
            }
            if (node.childNodes.length > 0) {
                this.compile(node.childNodes)
            }
        })
    }
    compileTextNode(node) {
        const reg = /\{\{(.*)\}\}/
        const content = node.textContent
        if (reg.test(content)) {
            const key = reg.exec(content)[1]
            const actualText = this.vm[key]
            this.updateText(node, actualText)
            new Watcher(this.vm, key, (text) => {
                this.updateText(node, text)
            })
        }
    }
    updateText(node, text) {
        node.textContent = text
    }
    compileElementNode(node) {
        const attrs = node.attributes
        if (attrs.length > 0) {
            Array.from(attrs).forEach(attr => {
                const name = attr.name
                // v-text,v-on:click,v-model
                if (this.isDirective(name)) {
                    // 拿到指令的名称
                    const attrName = name.indexOf(':') === -1 ? name.slice(2) : name.slice(5)
                    console.log('attrName',attrName)
                    // 拿到指令的值
                    const attrValue = attr.value
                    console.log('attrValue',attrValue)
                    this.updateDOM(node, attrName, attrValue)
                }
            })
        }
    }
    isTextNode(node) {
        return node.nodeType === 3
    }
    isElementNode(node) {
        return node.nodeType === 1
    }
    isDirective(attr) {
        return attr.startsWith('v-')
    }
    updateDOM(node, attrName, attrValue) {
        if (attrName === 'text') {
            const text = this.vm[attrValue]
            node.textContent = text
            new Watcher(this.vm, attrValue, (newText) => {
                node.textContent = newText
            })
        }
        if (attrName === 'model') {
            node.value = this.vm[attrValue]
            new Watcher(this.vm, attrValue, (newVal) => {
                node.value = newVal
            })
            node.addEventListener('input', (e) => {
                this.vm[attrValue] = e.target.value
            })
        }
        if (attrName === 'click') {
            const method = this.methods[attrValue]
            node.addEventListener('click', method.bind(this.vm))
        }
    }
}
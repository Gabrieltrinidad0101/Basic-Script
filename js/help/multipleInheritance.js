function MultipleInheritance(...args){
    for(const parentClass of args){
        const parentClassInstance = new parentClass()
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(parentClassInstance))
                        .concat(Object.keys(parentClassInstance))
        methods.shift()
        methods.forEach(method=>{
            this[method] = parentClassInstance[method]
        })
        this.prototype = parentClass.prototype
    }
}

export default MultipleInheritance
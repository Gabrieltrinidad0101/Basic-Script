class SymbolTable{
    constructor(parent=null){
        this.symbols = new Map
        this.parent = parent
    }
    get(name){
        const value = this.symbols.get(name)
        if(!value && this.parent){
            return this.parent.get(name)
        }
        return value
    }

    set(name,value){
        this.symbols.set(name,value)
    }

    remove(name){
        this.symbols.delete(name)
    }
}

export default SymbolTable
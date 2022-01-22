class SymbolTable{
    constructor(){
        this.symbols = new Map()
    }

    set(name,value){
        this.symbols.set(name,value)
    }

    get(name){
        return this.symbols.get(name)
    }

    remove(name){
        return this.symbols.delete(name)
    }

}

export default SymbolTable
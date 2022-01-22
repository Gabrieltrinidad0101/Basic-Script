class NumberNode{
    constructor(tok){
        this.tok = tok
        this.posStart = tok.posStart
        this.posEnd = tok.posEnd
    }

    toString(){
        return `${this.tok.value ? this.tok.value : this.tok.type}`
    }
}

export default NumberNode
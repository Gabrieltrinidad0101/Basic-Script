class NumberNode{
    constructor(tok){
        this.tok = tok
        this.pos_start = this.tok.pos_start
        this.pos_end = this.tok.pos_end
    }

    toString(){
        return `${this.tok.toString()}`
    }
}

export default NumberNode
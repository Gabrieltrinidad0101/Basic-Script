class UnaryOpNode{
    constructor(op_tok,node){
        this.opTok = op_tok
        this.node = node
        this.pos_start = this.opTok.pos_start
        this.pos_end = this.node.pos_end
    }

    toString() {
        return `(${this.op_tok}, ${this.node})`
    }
}

export default UnaryOpNode
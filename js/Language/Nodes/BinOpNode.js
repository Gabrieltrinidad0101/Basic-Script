class BinOpNode{
    constructor(leftNode,opTok,rightNode){
        this.leftNode  = leftNode
        this.rightNode = rightNode    
        this.opTok     = opTok
        this.pos_start = this.leftNode.pos_start
        this.pos_end = this.rightNode.pos_end
    }

    toString(){
        return `(${this.leftNode.toString()}, ${this.opTok.toString()}, ${this.rightNode.toString()})`
    }
}

export default BinOpNode 
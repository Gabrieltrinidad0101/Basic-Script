class BinOpNode{
    constructor(leftNode,op,rightNode){
        this.leftNode = leftNode
        this.op = op
        this.rightNode = rightNode 
    }

    toString(){
        return `(${this.leftNode.toString()} ${this.op.toString()} ${this.rightNode.toString()})`
    }
}


export default BinOpNode;
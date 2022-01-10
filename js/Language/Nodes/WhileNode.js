class WhileNode{
    constructor(conditionNode,bodyNode,shouldReturnNull){
        this.conditionNode = conditionNode
        this.bodyNode = bodyNode
        this.shouldReturnNull = shouldReturnNull
        this.pos_start = this.conditionNode.pos_start
        this.pos_end = this.bodyNode.pos_end
    }
}

export default WhileNode
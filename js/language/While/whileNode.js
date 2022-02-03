class WhileNode{
    constructor(conditionNode,bodyNode){
        this.conditionNode = conditionNode    
        this.bodyNode = bodyNode

        this.posStart = this.conditionNode.posStart
        this.posEnd = this.conditionNode.posEnd
    }
}

export default WhileNode
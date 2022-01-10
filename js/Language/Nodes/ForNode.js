class ForNode{
    constructor(varNameTok,startValueNode,endValueNode,stepValueNode,bodyNode,shouldReturnNull){
        this.varNameTok = varNameTok
        this.startValueNode = startValueNode
        this.endValueNode = endValueNode
        this.stepValueNode = stepValueNode
        this.bodyNode = bodyNode        
        this.shouldReturnNull = shouldReturnNull

        this.pos_start = this.varNameTok.pos_start
        this.pos_end = this.bodyNode.pos_end

    }
}

export default ForNode
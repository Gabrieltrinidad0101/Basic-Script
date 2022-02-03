class ForNode{
    constructor(varNameTok,startValueNode,endValueNode,stepValueNode,bodyNode){
        this.varNameTok = varNameTok
        this.startValueNode = startValueNode
        this.endValueNode = endValueNode
        this.stepValueNode = stepValueNode    
        this.bodyNode = bodyNode

        this.posStart = this.varNameTok.posStart
        this.posEnd = this.varNameTok.posEnd
    }
}
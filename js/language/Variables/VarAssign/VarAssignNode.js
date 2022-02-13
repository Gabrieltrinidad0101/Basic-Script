class VarAssignNode{
    constructor(varNameTok,valueNode){
        this.varNameTok = varNameTok
        this.valueNode = valueNode

        this.posStrat =  varNameTok.posStart
        this.posEnd = valueNode.posEnd; 
    }
}

export default VarAssignNode
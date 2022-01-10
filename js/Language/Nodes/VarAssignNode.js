class VarAssignNode{
    constructor(varNameTok,valueNode){
        this.varNameTok = varNameTok
        this.valueNode = valueNode
        
        this.pos_start = this.varNameTok.pos_start 
        this.pos_end = this.varNameTok.pos_end
    }
}

export default VarAssignNode
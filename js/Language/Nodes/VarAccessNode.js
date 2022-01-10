class VarAccessNode{
    constructor(varNameTok){
        this.varNameTok = varNameTok
        this.pos_start = this.varNameTok.pos_start 
        this.pos_end = this.varNameTok.pos_end
    }
}

export default VarAccessNode
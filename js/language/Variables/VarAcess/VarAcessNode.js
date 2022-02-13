class VarAcessNode{
    constructor(varNameTok){
        this.varNameTok = varNameTok
        this.posStart =  varNameTok.posStart
        this.posEnd = varNameTok.posEnd; 
    }
}

export default VarAcessNode
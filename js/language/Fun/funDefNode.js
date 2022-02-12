class FunDefNode{
    constructor(varNameTok,argNameToks,bodyNode){
        this.varNameTok = varNameTok
        this.argNameToks = argNameToks
        this.bodyNode = bodyNode    

        if(this.varNameTok)
            this.posStart = this.this.varNameTok.posStart
        else if(this.argNameToks.length > 0)
            this.posStart = this.this.argNameToks[0].posStart
        else
            this.posStart = this.bodyNode.posStart
        this.posEnd = this.bodyNode.posEnd
    }
}

export default FunDefNode
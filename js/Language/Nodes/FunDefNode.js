class FunDefNode{
    constructor(varNameTok,argNameToks,bodyNode,shouldToReturn){
        this.varNameTok = varNameTok            
        this.argNameToks = argNameToks            
        this.bodyNode = bodyNode      
        this.shouldToReturn = shouldToReturn
        
        if(this.varNameTok){
            this.pos_start = this.varNameTok.pos_start
        }else if(this.argNameToks.length > 0){
            this.pos_start = this.varNameTok.pos_start
        }else{
            this.pos_start = this.bodyNode.pos_start
        }
        this.pos_end = this.bodyNode.pos_end
    }
}

export default FunDefNode
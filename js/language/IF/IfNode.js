class IfNode{
    constructor(cases,elseCase){
        this.cases = cases
        this.elseCase = elseCase
        this.posStart = this.cases[0][0]
        this.posEnd = (this.elseCase || this.cases.at(-1)).posEnd 
    }
}

export default IfNode
class IfNode{
    constructor(cases,else_case,shouldReturnNull){
        this.cases = cases
        this.elseCase = else_case
        this.shouldReturnNull = shouldReturnNull

        this.pos_start = this.cases[0][0].posStart
        this.pos_end = (this.else_case || this.cases[this.cases.length - 1])[0].pos_end 
    }
}

export default IfNode
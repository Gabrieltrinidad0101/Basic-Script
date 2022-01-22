class Error{
    constructor(posStart,posEnd,errorName,details){
        this.posStart = posStart
        this.posEnd = posEnd
        this.errorName = errorName
        this.details = details
    }

    toString(){
        let error = `${this.errorName}: ${this.details}\n`
        error += `line = ${this.posStart.ln + 1} column = ${this.posStart.col}`
        return error
    }
}

export default Error;
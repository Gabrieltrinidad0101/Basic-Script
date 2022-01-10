import errorStyle from "../help/errorStyle.js"
class Error{
    constructor(pos_start,pos_end,error_name,details=""){
        this.pos_start = pos_start
        this.pos_end = pos_end
        this.error_name = error_name
        this.details = details
    }

    toString(){
        let result = `${this.error_name}: ${this.details}\n`
        result += `File ${this.pos_start.fn}, line ${this.pos_start.ln + 1} , column ${this.pos_start.col + 1}` 
        result += "\n\n" + errorStyle(this.pos_start.ftxt,this.pos_start,this.pos_end)
        return result
    }   
}

export default Error
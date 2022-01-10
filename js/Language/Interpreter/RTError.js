import Error from "../Error/error.js"
import errorStyle from "../help/errorStyle.js";
class RTError extends Error{
    constructor(pos_start,pos_end,details="",context){
        super(pos_start,pos_end,'Runtime Error',details);
        this.context = context
    }

    toString(){
        let result = this.generate_traceback()
        result += `${this.error_name}: ${this.details}\n`
        result += "\n" + errorStyle(this.pos_start.ftxt,this.pos_start,this.pos_end)
        return result
    }

    generate_traceback(){
        let result = ""
        let pos = this.pos_start
        let ctx = this.context
        while (ctx){
            result += ` File ${pos.fn},line ${pos.ln + 1} column ${pos.col + 1}, in ${ctx.displayName}\n`
            pos = ctx.parentEntryPos
            ctx = ctx.parent
        }
        return result

    }
}   

export default RTError
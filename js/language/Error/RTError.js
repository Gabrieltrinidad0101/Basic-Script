import Error from "./error.js"
class RTError extends Error {
        constructor(posStart,posEnd,details,context){
            super(posStart,posEnd,"Runtime Error",details)
            this.context = context
        }

         toString(){
             let error = this.generatorTraceback()
             error += `${this.errorName}: ${this.details}\n`
             return error
         }


        generatorTraceback(){
            let result = ""
            let pos = this.posStart
            let ctx = this.context
            while(ctx){
                result += `line = ${this.posStart.ln + 1} column = ${this.posStart.col} in ${ctx.displayName} \n`
                pos = ctx.parentEntryPos
                ctx = ctx.parent
            }

            return `Traceback (most recent call last):\n ${result}`
        }
}

export default RTError
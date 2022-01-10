import RTResult from "../Interpreter/RTResult.js"
import Context from "../Interpreter/context.js"
import SymbolTable from "../Interpreter/SymbolTable.js"
import Value from "../ValueTypes/Value.js"
import RTError from "../Interpreter/RTError.js"
class BaseFunction extends Value{
    constructor(name){
        super()
        this.name = name || "<anonymous>"
    }

    generateNewContext(){
        const newContext = new Context(this.name,this.context,this.pos_start)
        newContext.symbolTable = new SymbolTable(newContext.parent.symbolTable)
        return newContext
    }

    checkArgs(argNames,args){
        const res = new RTResult()
        if(args.length > argNames.length){
            return res.failure(
                new RTError(
                    this.pos_start,this.pos_end,
                    `${args.length - this.argNames.length} too many args passed into ${this.name}`
                )
            )
        }else if(args.length < this.argNames.length){
            return res.failure(
                new RTError(
                    this.pos_start,this.pos_end,
                    `${this.argNames.length - args.length} too few args passed into ${this.name}`
                )
            )
        }
        return res.success(null)
    }

    populateArgs(argNames,args,execCtx){
        for(const i in args){
            const argName = argNames[i]
            const argValue = args[i]
            argValue.setContext(execCtx)
            execCtx.symbolTable.set(argName,argValue)
        }
    }

    checkAndPopularArgs(argNames,args,execCtx){
        const res = new RTResult()
        res.register(this.checkArgs(argNames,args))
        if(res.error) return res
        this.populateArgs(argNames,args,execCtx)
        return res.success(null)
    }


}

export default BaseFunction
import RTResult from "../Interpreter/RTResult.js"
import BaseFunction from "./baseFunction.js"
import CLI from "../../Interfaces/Cli.js"
import Number from "../ValueTypes/Number.js"
import String from "../ValueTypes/String.js"
import List from "../ValueTypes/ListNode.js"

class BuiltInFunction extends BaseFunction{
    constructor(name){
        super(name)
        this.cli  = new CLI()
    }

    execute(args){
        const res = new RTResult()
        const execCtx = this.generateNewContext()
        if(!this[this.name]) return this.methodNoExist(this.name)
        this[this.name]()
        res.register(this.checkAndPopularArgs(this.argNames,args,execCtx))
        if(res.error) return res
        const returnValue = res.register(this.run(execCtx))
        if(res.error) return res

        return res.success(returnValue)
    }

    methodNoExist(methodString){
        const res = new RTResult()
        return res.failure(`The method ${methodString} no exist`)
    }

    copy(){
        const copy = new BuiltInFunction(this.name)
        copy.setContext(this.context)
        copy.set_pos(this.pos_start,this.pos_end)
        return copy
    }

    toString(){
        return `<built-in function ${this.name}>`
    }


    print(){
        this.argNames = ["value"]
        this.run = this.printRun
    }

    
    printRun(execCtx){
        const result = execCtx.symbolTable.get("value")
        this.cli.log(result.toString())
        return new RTResult().success(Number.null)
    }

    clear(){
        this.argNames = []
        this.run = this.clearRun
    }

    
    clearRun(execCtx){
        this.cli.clear()
        return new RTResult().success( Number.null) 
    }

    isNumber(){
        this.argNames = ["value"]
        this.run = this.isNumberRun
    }

    isNumberRun(execCtx){
        const instanceofResult = execCtx.symbolTable.get("value") instanceof Number
        return new RTResult().success(instanceofResult? Number.true : Number.false) 
    }

    isString(){
        this.argNames = ["value"]
        this.run = this.isStringRun
    }

    isStringRun(execCtx){
        const instanceofResult = execCtx.symbolTable.get("value") instanceof String
        return new RTResult().success(instanceofResult? Number.true : Number.false) 
    }

    isList(){
        this.argNames = ["value"]
        this.run = this.isListRun
    }

    isListRun(execCtx){
        const instanceofResult = execCtx.symbolTable.get("value") instanceof List
        return new RTResult().success(instanceofResult? Number.true : Number.false) 
    }

    isFunction(){
        this.argNames = ["value"]
        this.run = this.isFunctionRun
    }

    isFunctionRun(execCtx){
        const instanceofResult = execCtx.symbolTable.get("value") instanceof Function
        return new RTResult().success(instanceofResult? Number.true : Number.false) 
    }

}

export default BuiltInFunction
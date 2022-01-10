import RTResult from "../Interpreter/RTResult.js"
import Interpreter from "../Interpreter/interpreter.js"
import BaseFunction from "../baseFunction/baseFunction.js"
import List from "./ListNode.js"
import Number from "./Number.js"
import String from "./String.js"
class Function extends BaseFunction{
    constructor(name,bodyNode,argNames,shouldToReturn){
        super(name)
        this.bodyNode = bodyNode
        this.argNames = argNames        
        this.shouldToReturn = shouldToReturn    
    }

    execute(args){
        const res = new RTResult()
        const interpreter = new Interpreter()
        const newContext = this.generateNewContext()
        res.register(this.checkAndPopularArgs(this.argNames,args,newContext))
        if (res.shouldReturn()) return res
        const value = res.register(interpreter.run(this.bodyNode,newContext))
        if(res.shouldReturn() && res.funcReturnValue === null) return res
        const retValue = (this.shouldToReturn ? this.makeType(value) : null) || this.makeType(res.funcReturnValue) || Number.null 

        return res.success(retValue)
    }

    makeType(node){
        if(!node) return
        if(typeof(node.value) === "number" ){
            return new Number(node.value).set_pos(node.pos_start,node.pos_end).setContext(node.context)
        }else if(typeof(node.value) === "string" ){
            return new String(node.value).set_pos(node.pos_start,node.pos_end).setContext(node.context)
        }else if(node.elements?.constructor.name === "Array" ){
            return new List(node.elements).set_pos(node.pos_start,node.pos_end).setContext(node.context)
        }
    }

    copy(){
        const copy = new Function(this.name,this.bodyNode,this.argNames,this.shouldToReturn)
        copy.setContext(this.context)
        copy.set_pos(this.pos_start,this.pos_end)
        return copy
    }

    toString(){
        return `&#60;function ${this.name}&#62;`
    }
}

export default Function
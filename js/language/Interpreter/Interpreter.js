import RTResult from "./RTRsult.js"
import * as TOKENS from "../TOKEN/TT_TOKENS.js"
import Context from "../Context/context.js"
import MultipleInheritance from "../../help/multipleInheritance.js"
import IfInterpreter from "../IF/ifInterpreter.js"
import ForInterpreter from "../For/forInterpreter.js"
import WhileInterpreter from "../While/whileInterpreter.js"
import NumberInterpreter from "../Number/numberInterpreter.js"
import VarAssignInterpreter from "../Variables/VarAssign/varAssignInterpreter.js"
import VarAcessInterpreter from "../Variables/VarAcess/varAcessInterpreter.js"
import RTError from "../Error/RTError.js"

class Interpreter extends MultipleInheritance{
    constructor(){
        super(
            IfInterpreter,
            ForInterpreter,
            WhileInterpreter,
            VarAssignInterpreter,
            VarAcessInterpreter,
            NumberInterpreter
        )
        this.context = new Context()
    }
    run(node,context){
        const methodString = node.constructor.name
        const result = this[methodString] ? this[methodString](node,context) : this.methodNoExist(methodString)
        return result
    }
    
    makeError({posStart,posEnd},description,context){
        return new RTResult().failure(new RTError(posStart,
            posEnd,description,context))
    }

    methodNoExist(methodString,context){
        return new RTResult().failure(
            `The method ${methodString} no exist`
        )
    }

    BinOpNode(node,context){
        const res = new RTResult()
        const {leftNode,op,rightNode} = node
        const left = res.register(this.run(leftNode,context))
        if(res.error) return res
        const right = res.register(this.run(rightNode,context))
        if(res.error) return res
        let result = null
        let error = null
        if(op.type === TOKENS.TT_PLUS){
            result = left.addedTo(right)
        }else if(op.type === TOKENS.TT_MINUS){
            result = left.subbedTo(right)
        }else if(op.type === TOKENS.TT_MUL){
            result = left.multedBy(right)
        }else if(op.type === TOKENS.TT_DIV){
            [result,error] = left.divedBy(right)
        }else if(op.type === TOKENS.TT_POW){
            result = left.powerBy(right)
        }else if(op.type === TOKENS.TT_EE){
            result = left.getComparisonEq(right)
        }else if(op.type === TOKENS.TT_NE){
            result = left.getComparisonNe(right)
        }else if(op.type === TOKENS.TT_GT){
            result = left.getComparisonGt(right)
        }else if(op.type === TOKENS.TT_LT){
            result = left.getComparisonLt(right)
        }else if(op.type === TOKENS.TT_GTE){
            result = left.getComparisonGte(right)
        }else if(op.type === TOKENS.TT_LTE){
            result = left.getComparisonLte(right)
        }else if(op.matches("AND",TOKENS.TT_KEYWORD)){
            result = left.andedBy(right)
        }else if(op.matches("OR",TOKENS.TT_KEYWORD)){
            error = left.ordedBy(right)
        }
        if(error) return res.failure(error)
        return res.success(result)
    }
}

export default Interpreter
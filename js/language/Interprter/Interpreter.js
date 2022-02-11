import RTResult from "./RTRsult.js"
import Error from "../Error/error.js"
import Number from "../Number/numberType.js"
import * as TOKENS from "../TOKEN/TT_TOKENS.js"
import Context from "../Context/context.js"
class Interpreter{
    constructor(){
        this.context = new Context()
    }
    run(node,context){
        const methodString = node.constructor.name
        const result = this[methodString] ? this[methodString](node,context) : this.methodNoExist(methodString)
        return result
    }
    
    makeError(title,description,context){
        return new Error(node.posStart,
            node.posEnd,title,description)
    }

    methodNoExist(methodString,context){
        return new RTResult().failure(
            `The method ${methodString} no exist`
        )
    }

    NumberNode(node,context){
        const res = new RTResult()
        return res.success( new Number(node.tok.value).setPos(node.posStart,node.posEnd).setContext(context) )
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
            console.log(result);
        }else if(op.matches("OR",TOKENS.TT_KEYWORD)){
            error = left.ordedBy(right)
        }
        if(error) return res.failure(error)
        return res.success(result)
    }

    VarAssignNode(node,context){
        const res = new RTResult()
        const name = node.varNameTok.value
        const value =  res.register(this.run(node.valueNode,context))
        if(res.error) return res
        context.symbolTable.set(name,value)
        return res.success(value)
    }


    VarAcessNode(node,context){
        const res = new RTResult()
        const varName = node.varNameTok.value
        const value = context.symbolTable.get(varName)
        if(!value){
            return res.failure(new Error(
                node.posStart,node.posEnd,`${varName} is not defined`,context
            ))
        }
        return res.success(value)
    }

    IfNode(node,context){
        const res = new RTResult()
        for(const [condition,expr] of node.cases){
            const conditionValue = res.register(this.run(condition ,context))
            if(conditionValue.isTrue()){
                const exprValue = res.register(this.run(expr,context))
                if(res.error) return res
                return res.success(exprValue)
            }
        }

        if(node.elseCase){
            const elseValue = res.register(this.run(node.elseCase,context))
            if(res.error) return res
            return res.success(elseValue)
        }      
    }

    ForNode(node,context){
        const res = new RTResult()
        const {varNameTok, startValueNode, endValueNode, stepValueNode, bodyNode,} = node
        const startValue = res.register(this.run(startValueNode,context))
        if(res.error) return

        const endValue = res.register(this.run(endValueNode,context))
        if(res.error) return

        let stepValue = new Number(1)
        if(stepValueNode){
            stepValue = res.register(this.run(stepValueNode,context))
            if(res.error) return
        }   
        let i = startValue.value
        let condition = stepValue.value
        if(stepValue.value >= 0){
            condition = _=> i < endValue.value
        }else{
            condition = _=> i > endValue.value
        }
        
        while(condition()){
            context.symbolTable.set(varNameTok.value,new Number(i))
            i += stepValue.value

            res.register(this.run(bodyNode,context))
            if(res.error) return res
        }

        return res.success(null)
    }

    WhileNode(node,context){
        const res = new RTResult()
        while(true){
            const condition = res.register(this.run(node.conditionNode,context))
            if(res.error) return res
            console.log(condition)
            if(!condition.isTrue()) break

            res.register(this.run(node.bodyNode,context))
            if(res.error) return res
        }
        return res.success(null)
    }
}

export default Interpreter
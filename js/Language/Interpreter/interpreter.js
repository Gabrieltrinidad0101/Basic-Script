import Number from "../ValueTypes/Number.js"
import TOKENS from "../constants/TOKENS.js"
import RTResult from "./RTResult.js"
import RTError from "./RTError.js"
import Function from "../ValueTypes/Function.js"
import String from "../ValueTypes/String.js"
import List from "../ValueTypes/ListNode.js"

class Interpreter{
    run(node,context){ 
        const methodString = node.constructor.name 
        const value = this[methodString] ? 
                      this[methodString](node,context) :
                      this.methodNoExist(methodString)
        return value
    }

    methodNoExist(methodString){
        const res = new RTResult()
        return res.failure(`The method ${methodString} no exist`)
    }

    VarAccessNode(node,context){
        const res= new RTResult()
        const varName = node.varNameTok.value
        let value = context.symbolTable.get(varName)
        if(!value){
            return res.failure(new RTError(
                node.pos_start,node.pos_end,`${varName} is not defined`,context
                ))
            }
        value = value.copy().set_pos(node.pos_start,node.pos_end).setContext(context)
        return res.success(value)
    }

    VarAssignNode(node,context){
        const res =  new RTResult()
        const varName = node.varNameTok.value
        const varValue = res.register(this.run(node.valueNode,context))
        if(res.shouldReturn()) res
        context.symbolTable.set(varName,varValue)
        return res.success(varValue)
    }   

    NumberNode(node,context){
        const newValue = new Number(node.tok.value).setContext(context).set_pos(node.pos_start,node.pos_end)
        return new RTResult().success(newValue)
    }
    //Transaction declined by the issuing bank. Please try a different card or contact your card issuer. (GWD7022)

    BinOpNode(node,context){
        const res = new RTResult()
        const left =  res.register(this.run(node.leftNode,context))
        if(res.shouldReturn()) return res
        const right = res.register(this.run(node.rightNode,context))
        if(res.shouldReturn()) return res
        let result = null
        let error = null
        if(node.opTok.type === TOKENS.TT_PLUS){
            [result,error] = left.added_to(right)
        }else if(node.opTok.type === TOKENS.TT_MINUS){
            [result,error] = left.subbed_by(right)
        }else if(node.opTok.type === TOKENS.TT_MUL){
            [result,error] = left.multed_by(right)
        }else if(node.opTok.type === TOKENS.TT_DIV){
            [result,error] = left.dived_by(right)
        }else if(node.opTok.type === TOKENS.TT_POW){
            [result,error] = left.powed_by(right)
        }else if(node.opTok.type === TOKENS.TT_EE){
            [result,error] = left.getComparisonEq(right)
        }else if(node.opTok.type === TOKENS.TT_NE){
            [result,error] = left.getComparisonNe(right)
        }else if(node.opTok.type === TOKENS.TT_GT){
            [result,error] = left.getComparisonGt(right)
        }else if(node.opTok.type === TOKENS.TT_LT){
            [result,error] = left.getComparisonLt(right)
        }else if(node.opTok.type === TOKENS.TT_LTE){
            [result,error] = left.getComparisonLte(right)
        }else if(node.opTok.type === TOKENS.TT_GTE){
            [result,error] = left.getComparisonGte(right)
        }else if(node.opTok.matches(TOKENS.TT_KEYWORD,"AND")){
            [result,error] = left.anded_by(right)
        }else if(node.opTok.matches(TOKENS.TT_KEYWORD,"OR")){
            [result,error] = left.orded_by(right)
        }
        if(error) return res.failure(error)
        return res.success(result.set_pos(node.pos_start,node.pos_end))
    }


    UnaryOpNode(node,context){
        const res = new RTResult()
        let number = res.register(this.run(node.node,context))
        if(res.shouldReturn()) return res
        let error = null
        if(node.opTok.type == TOKENS.TT_MINUS){
            number,error = number.multed_by(new Number(-1))
        }else if(node.opTok.matches(TOKENS.TT_KEYWORD,"NOT")){
            number,error = number.notted()
        }
        if(error){
            return res.failure(error)
        }
        return res.success(number.set_pos(node.pos_start,node.pos_end))
    }

    IfNode(node,context){
        const res = new RTResult()
        for(const IF of node.cases){
            const [condition,expr,shouldReturnNull] = IF
            const condition_value = res.register(this.run(condition,context))

            if(res.shouldReturn()) return res

            if(condition_value.isTrue()){
                const exprValue = res.register(this.run(expr,context))
                if(res.shouldReturn()) return res
                return res.success(shouldReturnNull ? Number.null : exprValue)
            }
            if(node.elseCase){
                const [expr,shouldReturnNull] = node.elseCase
                const elseValue = res.register(this.run(expr,context))
                if(res.shouldReturn()) return res
                return res.success(shouldReturnNull ? Number.null : elseValue)
            }

        }
        return res.success(null)
    }

    ForNode(node,context){
        const res = new RTResult()
        const elements = []
        const startValue = res.register(this.run(node.startValueNode,context))
        if(res.shouldReturn()) return res

        const endValue = res.register(this.run(node.endValueNode,context))
        if(res.shouldReturn()) return res

        let stepValue = null
        if(node.stepValueNode){
            stepValue = res.register(this.run(node.stepValueNode,context))
        }else{
            stepValue = new Number(1)
        }

        let i = startValue.value
        let condition = null
        if (stepValue.value >= 0){
            condition = _=> i < endValue.value
        }else{
            condition = _=> i > endValue.value
        }

        while(condition()){
            context.symbolTable.set(node.varNameTok.value,new Number(i))
            i += stepValue
            const value = res.register(this.run(node.bodyNode,context))
            if(res.shouldReturn() && res.loopShouldBreak === false && res.loopShouldContinue === false) return res
            if(res.loopShouldBreak) break
            elements.push(value)
            if(res.loopShouldContinue) continue
        }

        return res.success(
            node.shouldReturnNull ? 
            Number.null :
            new List(elements).setContext(context).set_pos(node.pos_start,node.pos_end)
        )

    }

    WhileNode(node,context){
        const res = new RTResult()
        const elements = []
        while(true){
            const condition = res.register(this.run(node.conditionNode,context))
            if(res.shouldReturn()) return res

            if(!condition.isTrue()) break

            const value = res.register(this.run(node.bodyNode,context))
            if(res.shouldReturn() && res.loopShouldBreak === false && res.loopShouldContinue === false) return res
            if(res.loopShouldBreak) break
            elements.push(value)
            if(res.loopShouldContinue) continue
        }
            
        return res.success(
            node.shouldReturnNull ? 
            Number.null :
            new List(elements).setContext(context).set_pos(node.pos_start,node.pos_end)
        )
    }

    FunDefNode(node,context){
        const res = new RTResult()

        const funcName = node.varNameTok?.value
        const bodyNode = node.bodyNode
        const argNames = this.getArgFunction(node.argNameToks)
        const funcValue = new Function(funcName,bodyNode,argNames,node.shouldToReturn).setContext(context).set_pos(node.pos_start,node.pos_end)
        if(node.varNameTok){
            context.symbolTable.set(funcName,funcValue)
        }
        return res.success(funcValue)
    }

    CallNode(node,context){
        const res = new RTResult()
        const args = []
        const valueToCall = res.register(this.run(node.nodeToCall,context))
        if(res.shouldReturn()) return res
        for(const argNode of node.argNodes){
            args.push(res.register(this.run(argNode,context)))
            if(res.shouldReturn()) return res
        }
        const returnValue = res.register(valueToCall.execute(args))
        if(res.shouldReturn()) return res
        return res.success(returnValue)
    }

    StringNode(node,context){
        return new RTResult().success(
            new String(node.tok.value).setContext(context).set_pos(node.pos_start,node.pos_end)
        )
    }

    ListNode(node,context){
        const res = new RTResult()
        const elements = []
        for(const elementNodes of node.elementNodes){
            const result = this.run(elementNodes,context)
            elements.push(res.register(result))
            if(res.shouldReturn()) return res
        }
        return res.success(
            new List(elements).setContext(context).set_pos(node.pos_start, node.pos_end)
        )
    }

    ReturnNode(node,context){
        const res = new RTResult()
        let value = null
        if(node.nodeToReturn){
            value = res.register(this.run(node.nodeToReturn,context))
            if(res.shouldReturn()) return res
        }else{
            value = Number.null
        }

        return res.successReturn(value)
    }

    ContinueNode(){
        return new RTResult().successContinue()
    }

    BreakNode(){
        return new RTResult().successBreak()
    }

    getArgFunction(names){
        const args = []
        for(const name of names){
            args.push(name.value)
        }
        return args
    }
}



export default Interpreter
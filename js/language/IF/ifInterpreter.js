import RTResult from "../Interpreter/RTRsult.js"

class IfInterpreter{
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
}

export default IfInterpreter
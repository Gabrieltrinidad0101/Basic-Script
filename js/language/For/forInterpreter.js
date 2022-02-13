import RTResult from "../Interpreter/RTRsult.js"
import Number from "../Number/numberType.js"

class ForInterpreter{
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
}

export default ForInterpreter
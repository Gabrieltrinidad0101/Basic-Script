import Number from "./numberType.js"
import RTResult from "../Interpreter/RTRsult.js"

class NumberInterpreter{
    NumberNode(node,context){
        const res = new RTResult()
        return res.success( new Number(node.tok.value).setPos(node.posStart,node.posEnd).setContext(context) )
    }
}

export default NumberInterpreter
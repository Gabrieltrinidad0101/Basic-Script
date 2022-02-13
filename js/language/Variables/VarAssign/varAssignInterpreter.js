import RTResult from "../../Interpreter/RTRsult.js"

class VarAssignInterpreter{
    VarAssignNode(node,context){
        const res = new RTResult()
        const name = node.varNameTok.value
        const value =  res.register(this.run(node.valueNode,context))
        if(res.error) return res
        context.symbolTable.set(name,value)
        return res.success(value)
    }
}

export default VarAssignInterpreter
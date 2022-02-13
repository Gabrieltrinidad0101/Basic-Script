import RTResult from "../../Interpreter/RTRsult.js"
class VarAcessInterpreter{
    VarAcessNode(node,context){
        const res = new RTResult()
        const varName = node.varNameTok.value
        const value = context.symbolTable.get(varName)
        if(!value){
            return this.makeError(
                node,`${varName} is not defined`,context
            )
        }
        return res.success(value)
    }
}

export default VarAcessInterpreter
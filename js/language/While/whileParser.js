import WhileNode from "./whileNode.js"
import ParserResult from "../Parser/parserResult.js"
class WhileParser{
    whileExpr(){
        const res = new ParserResult()

        this.advance()
        const condition = res.register(this.expr())
        if(res.error) return res


        let error = this.eat(this.TOKENS.TT_KEYWORD,"THEN")
        if(error) return error

        const body = res.register(this.expr())
        if(res.error) return res

        return res.success(new WhileNode(condition,body))
    }
}

export default WhileParser
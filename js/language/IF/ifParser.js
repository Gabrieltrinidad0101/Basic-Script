import IfNode from "./ifNode.js"
import ParserResult from "../Parser/parserResult.js"
class IfParser{
    ifExpr(){
        const res = new ParserResult()
        const cases = []
        let elseCase = null
        this.advance()

        const condition = res.register(this.expr())
        if(res.error) return res

        let error = this.eatMathces("THEN")
        if(error) return error

        const expr = res.register(this.expr())
        if(res.error) return res
        cases.push([condition,expr])

        while(this.currentToken.matches("ELIF",this.TOKENS.TT_KEYWORD)){
            this.advance()
            const condition = res.register(this.expr())
            if(res.error) return res

            let error = this.eatMathces("THEN")
            if(error) return error

            const expr = res.register(this.expr())
            cases.push([condition,expr])

            
        }
        if(this.currentToken.matches("ELSE",this.TOKENS.TT_KEYWORD)){
            this.advance()

            const expr = res.register(this.expr())
            if(res.error) return res

            elseCase = expr
        }
        return res.success(new IfNode(cases,elseCase))
    }
}

export default IfParser
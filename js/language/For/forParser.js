import ForNode from "./forNode.js"
import ParserResult from "../Parser/parserResult.js"
class ForParse{
    forExpr(){
        const res = new ParserResult()
        let stepValue = null
        this.advance()
        const varName = this.currentToken

        let error = this.eat(this.TOKENS.TT_IDENTIFIER,"identifier")
        if(error) return error
        
        error = this.eat(this.TOKENS.TT_EQ,"=")
        if(error) return error
        
        const startValue = res.register(this.expr())
        if(res.error) return res
        
        
        error = this.eat(this.TOKENS.TT_KEYWORD,"TO")
        if(error) return error

        const endValue = res.register(this.expr())
        if(res.error) return res
        if(this.currentToken.matches("STEP",this.TOKENS.TT_KEYWORD)){
            this.advance()
            stepValue = res.register(this.expr())
            if(res.error) return res
        }

        error = this.eat(this.TOKENS.TT_KEYWORD,"THEN")
        if(error) return error

        const body = res.register(this.expr())
        if(res.error) return res
        return res.success(new ForNode(varName,startValue,endValue,stepValue,body))
    }

}

export default ForParse
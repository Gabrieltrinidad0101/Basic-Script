import * as TOKENS from "../TOKEN/TT_TOKENS.js"
import BinOpNode from "./BinOpNode/BinOpNode.js"
import NumberNode from "../Number/numberNode.js"
import IN from "../help/IN.js"
import ParserResult from "./parserResult.js"
import Error from "../Error/error.js"
import UnaryOpNode from "./UnaryOpNode/UnaryOpNode.js"
import KEYWORD from "../constants/KEYWORD.js"
import VarAssignNode from "../Variables/VarAssignNode.js"
import VarAcessNode from "../Variables/VarAcessNode.js"
class Parser{
    constructor(tokens){
        this.tokens = tokens
        this.idx = 0
        this.advance()
    }

    advance(){
        if(this.idx < this.tokens.length){
            this.currentToken = this.tokens[this.idx]
            this.idx += 1
        }
    }

    makeError(title,description){
        return new Error(this.currentToken.posStart,
            this.currentToken.posEnd,title,description)
    }

    eat(tokenType,expected){
        if(this.currentToken.type === tokenType){
            this.advance()
            return
        }
        
        return this.makeError("Invalid Syntax",
        `Expected '${expected}'`)
    } 

    parse(){
        const result = this.expr()
        if(this.currentToken.type !== TOKENS.TT_EOF && !result.error){
            result.failure(this.makeError(
            "Invalid Syntax",
            "Expected '+','-','*','/'"
            ))
        }
        return result
    }

    atom(){
        const res = new ParserResult()
        const token = this.currentToken
        if(IN(token.type, [TOKENS.TT_INT,TOKENS.TT_FLOAT])){
            this.advance()
            return  res.success(new NumberNode(token))
        }else if(token.type === TOKENS.TT_LPAREN){
            this.advance()
            const expr = res.register(this.expr())
            if(res.error) return res
            res.failure(this.eat(TOKENS.TT_RPAREN,")"))
            if(res.error) return res
            return res.success(expr)
        }else if(token.type === TOKENS.TT_IDENTIFIER){
            this.advance()
            return res.success(new VarAcessNode(token))
        }
        return res.failure(this.makeError("Invelid Syntax","Expected int, float, '+', '-', '(', identifier "))
    }

    power(){
        return this.binOp(_=>this.atom(),[TOKENS.TT_POW],_=>this.factor())
    }

    factor(){
        const res = new ParserResult()
        const token = this.currentToken
        if(IN(token.type, [TOKENS.TT_PLUS,TOKENS.TT_MINUS])){
            this.advance()
            const factor = res.register(this.factor())
            if(res.error) return res
            return  res.success(new UnaryOpNode(this.currentToken,factor))
        }
        return this.power()
    }

    term(){
        return this.binOp(_=>this.factor(),[TOKENS.TT_MUL,TOKENS.TT_DIV])
    }

    arithExpr(){
        return this.binOp(_=>this.term(),[TOKENS.TT_PLUS,TOKENS.TT_MINUS])
    }

    compExpr(){
        const res = new ParserResult()
        if(this.currentToken.matches(TOKENS.TT_KEYWORD,"NOT")){
            const opTok = this.currentToken
            this.advance()
            const node = res.register(this.compExpr())
            if(res.error) return res
            return res.success(new UnaryOpNode(opTok,node))
        }

        const node = res.register(this.binOp(_=>this.arithExpr(),[TOKENS.TT_EE,TOKENS.TT_NE,TOKENS.TT_GT,TOKENS.TT_LT,TOKENS.TT_GTE,TOKENS.TT_LTE]))
        if(res.error){
            return res.failure(this.makeError("Invalid Syntax","Expected int,float, identifier, '+','-','(','NOT'"))
        }

        return res.success(node)
    }
    
    expr(){
        const res = new ParserResult()
        if(this.currentToken.matches(KEYWORD[0],TOKENS.TT_KEYWORD)){
            this.advance()
            const varName = this.currentToken
            res.failure(this.eat(TOKENS.TT_IDENTIFIER,"VAR"))
            if(res.error) return res
            console.log(this.currentToken);
            res.failure(this.eat(TOKENS.TT_EQ,"="))
            if(res.error) return res
            
            const expr = res.register(this.expr())
            if(res.error) return res
            return res.success(new VarAssignNode(varName,expr))
        }
        return this.binOp(_=>this.compExpr(),[[TOKENS.TT_KEYWORD,"AND"],[TOKENS.TT_KEYWORD,"OR"]])
    }

    binOp(cbA,ops,cbB=null){
        if(!cbB) cbB = cbA
        const res = new ParserResult()
        let left = res.register(cbA())
        if(res.error) return res
        while (IN(this.currentToken.type,ops) || IN([this.currentToken.type,this.currentToken.value],ops)){
            const op = this.currentToken
            this.advance()
            const right = res.register(cbB())
            if(res.error) return res
            left = new BinOpNode(left,op,right)
        }
        return  res.success(left)

    }
}

export default Parser
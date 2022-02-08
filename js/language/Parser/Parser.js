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
import IfNode from "../IF/IfNode.js"
import ForNode from "../For/forNode.js"
import WhileNode from "../While/whileNode.js"
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

    eatMathces(expected){
        if(this.currentToken.matches(expected,TOKENS.TT_KEYWORD)){
            this.advance()
            return
        }
        
        return this.makeError("Invalid Syntax",
        `Expected '${expected}'`)
    }

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

        while(this.currentToken.matches("ELIF",TOKENS.TT_KEYWORD)){
            this.advance()
            const condition = res.register(this.expr())
            if(res.error) return res

            let error = this.eatMathces("THEN")
            if(error) return error

            const expr = res.register(this.expr())
            cases.push([condition,expr])

            
        }
        if(this.currentToken.matches("ELSE",TOKENS.TT_KEYWORD)){
            this.advance()

            const expr = res.register(this.expr())
            if(res.error) return res

            elseCase = expr
        }

        return res.success(new IfNode(cases,elseCase))

    }

    forExpr(){
        const res = new ParserResult()
        let stepValue = null
        this.advance()
        let error = this.eat(TOKENS.TT_KEYWORD,"identifier")
        if(error) return error

        const varName = this.currentToken
        this.advance()

        
        const startValue = res.register(this.expr())
        if(res.error) return res
        
        error = this.eat(TOKENS.TT_EQ,"=")
        if(error) return error
        
        error = this.eat(TOKENS.TT_KEYWORD,"TO")
        if(error) return error

        const endValue = res.register(this.expr())
        if(res.error) return res

        if(this.currentToken.matches(TOKENS.TT_KEYWORD,"STEP")){
            this.advance()
            stepValue = res.register(this.expr())
            if(res.error) return res
        }

        error = this.eat(TOKENS.TT_KEYWORD,"THEN")
        if(error) return error

        this.advance()
        body = res.register(this.expr())
        if(res.error) return res

        return res.success(new ForNode(varName,startValue,endValue,stepValue,body))
    }

    whileExpr(){
        const res = new ParserResult()

        const condition = res.register(this.expr())
        if(res.error) return res

        let error = this.eat(TOKENS.TT_KEYWORD,"THEN")
        if(error) return error

        const body = res.register(this.expr())
        if(res.error) return res

        return res.success(new WhileNode(condition,body))
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
        }else if(token.matches("IF",TOKENS.TT_KEYWORD)){
            const ifExpr = res.register(this.ifExpr())
            if(res.error) return res
            return res.success(ifExpr)
        }else if(token.matches("FOR",TOKENS.TT_KEYWORD)){
            const forExp = res.register(this.forExpr())
            if(res.error) return res
            return res.success(forExp)
        }else if(token.matches("WHILE",TOKENS.TT_KEYWORD)){
            const whileExpr = res.register(this.whileExpr())
            if(res.error) return res
            return res.success(whileExpr)
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
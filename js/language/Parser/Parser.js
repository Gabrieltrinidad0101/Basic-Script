import * as TOKENS from "../TOKEN/TT_TOKENS.js"
import BinOpNode from "./BinOpNode/BinOpNode.js"
import NumberNode from "../Number/numberNode.js"
import IN from "../help/IN.js"
import ParserResult from "./parserResult.js"
import Error from "../Error/error.js"
import UnaryOpNode from "./UnaryOpNode/UnaryOpNode.js"
import KEYWORD from "../constants/KEYWORD.js"
import VarAssignNode from "../Variables/VarAssign/VarAssignNode.js"
import VarAcessNode from "../Variables/VarAcess/VarAcessNode.js"
import IfParser from "../IF/ifParser.js"
import ForParse from "../For/forParser.js"
import WhileParser from "../While/whileParser.js"
import MultipleInheritance from "../../help/multipleInheritance.js"

class Parser extends MultipleInheritance{
    constructor(tokens){
        super(IfParser,ForParse,WhileParser)
        this.tokens = tokens
        this.idx = 0
        this.TOKENS = TOKENS
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
        if(this.currentToken.matches(expected,this.TOKENS.TT_KEYWORD)){
            this.advance()
            return
        }
        
        return this.makeError("Invalid Syntax",
        `Expected '${expected}'`)
    }

    parse(){
        const result = this.expr()
        if(this.currentToken.type !== this.TOKENS.TT_EOF && !result.error){
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
        if(IN(token.type, [this.TOKENS.TT_INT,this.TOKENS.TT_FLOAT])){
            this.advance()
            return  res.success(new NumberNode(token))
        }else if(token.type === this.TOKENS.TT_LPAREN){
            this.advance()
            const expr = res.register(this.expr())
            if(res.error) return res
            res.failure(this.eat(this.TOKENS.TT_RPAREN,")"))
            if(res.error) return res
            return res.success(expr)
        }else if(token.type === this.TOKENS.TT_IDENTIFIER){
            this.advance()
            return res.success(new VarAcessNode(token))
        }else if(token.matches("IF",this.TOKENS.TT_KEYWORD)){
            const ifExpr = res.register(this.ifExpr())
            if(res.error) return res
            return res.success(ifExpr)
        }else if(token.matches("FOR",this.TOKENS.TT_KEYWORD)){
            const forExp = res.register(this.forExpr())
            if(res.error) return res
            return res.success(forExp)
        }else if(token.matches("WHILE",this.TOKENS.TT_KEYWORD)){
            const whileExpr = res.register(this.whileExpr())
            if(res.error) return res
            return res.success(whileExpr)
        }else if(token.matches("FUN",this.TOKENS.TT_KEYWORD)){
            const funExpr = res.register(this.funExpr())
            if(res.error) return res
            return res.success(funExpr)
        }


        return res.failure(this.makeError("Invelid Syntax","Expected int, float, '+', '-', '(', identifier "))
    }

    power(){
        return this.binOp(_=>this.atom(),[this.TOKENS.TT_POW],_=>this.factor())
    }

    factor(){
        const res = new ParserResult()
        const token = this.currentToken
        if(IN(token.type, [this.TOKENS.TT_PLUS,this.TOKENS.TT_MINUS])){
            this.advance()
            const factor = res.register(this.factor())
            if(res.error) return res
            return  res.success(new UnaryOpNode(this.currentToken,factor))
        }
        return this.power()
    }

    term(){
        return this.binOp(_=>this.factor(),[this.TOKENS.TT_MUL,this.TOKENS.TT_DIV])
    }

    arithExpr(){
        return this.binOp(_=>this.term(),[this.TOKENS.TT_PLUS,this.TOKENS.TT_MINUS])
    }

    compExpr(){
        const res = new ParserResult()
        if(this.currentToken.matches(this.TOKENS.TT_KEYWORD,"NOT")){
            const opTok = this.currentToken
            this.advance()
            const node = res.register(this.compExpr())
            if(res.error) return res
            return res.success(new UnaryOpNode(opTok,node))
        }

        const node = res.register(this.binOp(_=>this.arithExpr(),[this.TOKENS.TT_EE,this.TOKENS.TT_NE,this.TOKENS.TT_GT,this.TOKENS.TT_LT,this.TOKENS.TT_GTE,this.TOKENS.TT_LTE]))
        if(res.error){
            return res.failure(this.makeError("Invalid Syntax","Expected int,float, identifier, '+','-','(','NOT'"))
        }

        return res.success(node)
    }
    
    expr(){
        const res = new ParserResult()
        if(this.currentToken.matches(KEYWORD[0],this.TOKENS.TT_KEYWORD)){
            this.advance()
            const varName = this.currentToken
            res.failure(this.eat(this.TOKENS.TT_IDENTIFIER,"VAR"))
            if(res.error) return res
            res.failure(this.eat(this.TOKENS.TT_EQ,"="))
            if(res.error) return res
            
            const expr = res.register(this.expr())
            if(res.error) return res
            return res.success(new VarAssignNode(varName,expr))
        }
        return this.binOp(_=>this.compExpr(),[[this.TOKENS.TT_KEYWORD,"AND"],[this.TOKENS.TT_KEYWORD,"OR"]])
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
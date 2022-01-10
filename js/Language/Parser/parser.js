import TOKENS from "../constants/TOKENS.js"
import BinOpNode from "../Nodes/BinOpNode.js"
import IN from "../help/in.js"
import NumberNode from "../Nodes/NumberNode.js"
import parserResult from "./parserResult.js"
import Error from "../Error/error.js"
import UnaryOpNode from "../Nodes/UnaryOpNode.js"
import VarAccessNode from "../Nodes/VarAccessNode.js"
import VarAssignNode from "../Nodes/VarAssignNode.js"
import IfNode from "../Nodes/IfNode.js"
import ForNode from "../Nodes/ForNode.js"
import WhileNode from "../Nodes/WhileNode.js"
import FunDefNode from "../Nodes/FunDefNode.js"
import CallNode from "../Nodes/CallNode.js"
import StringNode from "../Nodes/StringNode.js"
import ListNode from "../Nodes/ListNode.js"
import ReturnNode from "../Nodes/ReturnNode.js"
import ContinueNode from "../Nodes/ContinueNode.js"
import BreakNode from "../Nodes/BreakNode.js"

class Parser{
    constructor(tokens){
        this.tokens = tokens
        this.idx = -1
        this.advance()
    }
    advance(){
        this.idx += 1
        this.updateCurrenttok()
        return this.currentToken 
    }

    reverse(amount=1){
        this.idx -= amount
        this.updateCurrenttok()
        return this.currentToken
    }

    updateCurrenttok(){
        if(this.idx < this.tokens.length)
            this.currentToken = this.tokens[this.idx]
    }

    parse(){
        const result = this.statements()
        if(!result.error && this.currentToken != TOKENS.TT_EOF){
            const error =  new Error(
                this.currentToken.pos_start, this.currentToken.pos_end,
                "Invalid Syntax",
                'Expected "+", "-", "*" or "/"'
                )
            return result.failure(error)
        }
        return result
    }


    ///////////////////////////////////////////

    statements(){
        const res = new parserResult()
        const statements = []
        const posStart = this.currentToken.pos_start

        while(this.currentToken.type === TOKENS.TT_NEWLINE){
            res.registerAdvancement()
            this.advance()
        }
        const statement = res.register(this.statement())
        if(res.error) return res
        statements.push(statement)

        let moreStatements = true
        while(true){
            let newLineCount = 0
            while(this.currentToken.type === TOKENS.TT_NEWLINE){
                res.registerAdvancement()
                this.advance()
                newLineCount += 1
            }
            if(newLineCount === 0){
                moreStatements = false
            }
            if(!moreStatements) break
            const statement = res.tryRegister(this.statement())
            if(!statement){
                this.reverse(res.to_reverse_count)
                moreStatements = false
                continue
            }
            statements.push(statement)
        }
        return res.success(new ListNode(
            statements,
            posStart,
            this.currentToken.type.pos_end
        ))
    }

    statement = _=>{
        const res = new parserResult()
        const pos_start = this.currentToken.pos_start.copy()

        if(this.currentToken.matches(TOKENS.TT_KEYWORD,"RETURN")){
            res.registerAdvancement()
            this.advance()
            const expr = res.tryRegister(this.expr())
            if(!expr){
                this.reverse(res.to_reverse_count)
            }
            return res.success(new ReturnNode(expr,pos_start,this.currentToken.pos_start.copy()))
        }else if(this.currentToken.matches(TOKENS.TT_KEYWORD,"CONTINUE")){
            res.registerAdvancement()
            this.advance()
            return res.success(new ContinueNode(pos_start,this.currentToken.pos_start.copy()))
        }else if(this.currentToken.matches(TOKENS.TT_KEYWORD,"BREAK")){
            res.registerAdvancement()
            this.advance()
            return res.success(new BreakNode(pos_start,this.currentToken.pos_start.copy()))
        }

        const expr = res.register(this.expr())
        if(res.error) return res.failure(new Error(
            this.currentToken.pos_start,
            this.currentToken.pos_end,
            "Expected 'BREAK', 'CONTINUE', 'RETURN','VAR', 'IF', 'FOR', 'WHILE', 'FUN', int, float, identifier, '+', '-', '(' or 'NOT'"
        ))
        return res.success(expr)
    }

    listExpr(){
        const res =  new parserResult()
        const elementNodes = []
        const posStart = this.currentToken.pos_start.copy()
        
        res.registerAdvancement()
        this.advance()

        if(this.currentToken.type === TOKENS.TT_RSQUARE){
            res.registerAdvancement()
            this.advance()
        }else{
            elementNodes.push(res.register(this.expr()))
            if(res.error){
                return res.failure(new Error(
                    this.currentToken.pos_start,
                    this.currentToken.pos_end,
                    "Expected ']', 'VAR', 'IF', 'FOR', 'WHILE', 'FUN', int, float, identifier, '+', '-', '(' or 'NOT'"
                ))
            }
            while(this.currentToken.type === TOKENS.TT_COMMA){
                res.registerAdvancement()
                this.advance()
                elementNodes.push(res.register(this.expr()))
                if(res.error) return res
            }    

            let error = this.checkNextToken(TOKENS.TT_RSQUARE,"Expected , or ]")
            if(error) return error

            res.registerAdvancement()
            this.advance()
        }
        return res.success(new ListNode(
            elementNodes,
            posStart,
            this.currentToken.pos_start.copy()
        ))
        
    }
    
    ifExpr(){
        const res = new parserResult()
        const allCases = res.register(this.ifExprCases("IF"))
        if(res.error) return res
        const [cases,elseCase] = allCases
        return res.success(new IfNode(cases,elseCase))
    }

    ifExprB(){
        return this.ifExprCases("ELIF")
    }

    ifExprC(){
        const res = new parserResult()
        let elseCase = null

        if(this.currentToken.matches(TOKENS.TT_KEYWORD,'ELSE')){
            res.registerAdvancement();
            this.advance();

            if(this.currentToken.type === TOKENS.TT_NEWLINE){
                res.registerAdvancement();
                this.advance();
    
                const statements = res.register(this.statements())
                if(res.error) return res
                elseCase = [statements,true]
    
                if(this.currentToken.matches(TOKENS.TT_KEYWORD,"END")){
                    res.registerAdvancement();
                    this.advance();
                }else{
                    return res.failure(new Error(this.currentToken.pos_start, this.currentToken.pos_end,
                        "InvalidSyntaxError","Expected END"))
                }
            }else{
                const statements = res.register(this.statement())
                if(res.error) return res
                elseCase = [statements,false]
            }
        }
        return res.success(elseCase)
    }

    ifExprCases(caseKeyWord){
        const res = new parserResult()
        const cases = []
        let elseCase = null

        if(!this.currentToken.matches(TOKENS.TT_KEYWORD,caseKeyWord)){
            return res.failure(new Error(
                this.currentToken.pos_start, this.currentToken.pos_end,
                "InvalidSyntaxError",`Expected ${caseKeyWord}`
            ))
        }

        res.registerAdvancement()
        this.advance()

        const condition = res.register(this.expr())
        if(res.error) return res
        if(!this.currentToken.matches(TOKENS.TT_KEYWORD,"THEN")){
            return res.failure(new Error(
                this.currentToken.pos_start, this.currentToken.pos_end,
                "InvalidSyntaxError","Expected THEN"
            ))
        }

        res.registerAdvancement()
        this.advance()

        if(this.currentToken.type === TOKENS.TT_NEWLINE){
            res.registerAdvancement();  
            this.advance();

            const statements = res.register(this.statements())
            if(res.error) return res
            cases.push([condition,statements,true])

            if(this.currentToken.matches(TOKENS.TT_KEYWORD,"END")){
                res.registerAdvancement();
                this.advance();
            }else{
                const allCases = res.register(this.ifExprBOrC())
                if(res.error) return res
                const [newCases,newElseCase] = allCases
                elseCase = newElseCase
                cases.push(...newCases)
            }
        }else{
            const statements = res.register(this.statement())
            if(res.error) return res
            cases.push([condition,statements,false])

            const allCases = res.register(this.ifExprBOrC())
            console.log(allCases)
            if(res.error) return res
            const [newCases,newElseCase] = allCases
            elseCase = newElseCase
            cases.push(...newCases)
        }
        return res.success([cases,elseCase])
    }

    ifExprBOrC(){
        const res = new parserResult()
        let cases = []
        let else_case = null

        if (this.currentToken.matches(TOKENS.TT_KEYWORD, 'ELIF')){
            all_cases = res.register(this.ifExprB())
            if(res.error) return res
            [cases, else_case] = all_cases
        }
        else{
            else_case = res.register(this.ifExprC())
            if(res.error) return res
        }
        
        return res.success([cases, else_case])
    }


    forExpr(){
        const res =  new parserResult()

        res.registerAdvancement()
        this.advance()

        let error = this.checkNextToken(TOKENS.TT_IDENTIFIER,"identifier")
        if(error) return error

        const varName = this.currentToken
        res.registerAdvancement()
        this.advance()

        error = this.checkNextToken(TOKENS.TT_EQ,"=")
        if(error) return error

        res.registerAdvancement()
        this.advance()

        const startValue = res.register(this.expr())
        if(res.error) return res
        if(!this.currentToken.matches(TOKENS.TT_KEYWORD,"TO")){
            return res.failure(new Error(
                this.currentToken.pos_start, this.currentToken.pos_end,
                "InvalidSyntaxError","Expected TO"
            ))
        }

        res.registerAdvancement()
        this.advance()

        const endValue = res.register(this.expr())
        if(res.error) return res
        
        let stepValue = 0
        if(this.currentToken.matches(TOKENS.TT_KEYWORD,"STEP")){
            res.registerAdvancement()
            this.advance()

            stepValue = res.register(this.expr())
            if(res.error) return res
        }else{
            stepValue = null 
        }

        if(!this.currentToken.matches(TOKENS.TT_KEYWORD,"THEN")){
            return res.failure(new Error(
                this.currentToken.pos_start, this.currentToken.pos_end,
                "InvalidSyntaxError","Expected THEN"
            ))
        }

        res.registerAdvancement()
        this.advance()

        if(this.currentToken.type === TOKENS.TT_NEWLINE){
            res.registerAdvancement();  
            this.advance();

            const body = res.register(this.statements())
            if(res.error) return res

            if(this.currentToken.matches(TOKENS.TT_KEYWORD,"END")){
                res.registerAdvancement();
                this.advance();
            }

            res.registerAdvancement();  
            this.advance();
            return res.success(new ForNode(varName,startValue,endValue,stepValue,body,true))
        }


        const body = res.register(this.statement())
        if(res.error) return res

        return res.success(new ForNode(varName,startValue,endValue,stepValue,body,false))
    }

    whileExpr(){
        const res = new parserResult()
        let body = null
        if(!this.currentToken.matches(TOKENS.TT_KEYWORD, "WHILE")){
            return res.failure(new Error(this.currentToken.pos_start,
                this.currentToken.pos_end,
                "Invalid Syntax Error",
                "Expected 'WHILE'"
                ))
        }

        res.registerAdvancement()
        this.advance()

        const condition = res.register(this.expr())
        if(res.error) return res

        if(!this.currentToken.matches(TOKENS.TT_KEYWORD,"THEN")){
            return res.failure(new Error(
                this.currentToken.pos_start,
                this.currentToken.pos_end,
                "Invalid Syntax",
                "Expected 'THEN'"
            ))
        }

        res.registerAdvancement()
        this.advance()
        
        if(this.currentToken.type === TOKENS.TT_NEWLINE){
            res.registerAdvancement();  
            this.advance();

            body = res.register(this.statements())
            if(res.error) return res

            if(this.currentToken.matches(TOKENS.TT_KEYWORD,"END")){
                res.registerAdvancement();
                this.advance();
            }

            res.registerAdvancement();  
            this.advance();
            return res.success(new WhileNode(condition,body,true))
        }
        body = res.register(this.statement())
        if(res.error) return res

        return res.success(new WhileNode(condition,body,false))
    }

    power = _=>{
        return this.binOp(_=>this.call(),([TOKENS.TT_POW]),_=>this.factor())
    }

    call(){
        const res = new parserResult()
        const atom = res.register(this.atom())
        if(res.error) return res
        if(this.currentToken.type === TOKENS.TT_LPAREN){
            res.registerAdvancement()
            this.advance()
            const argNodes = []
            if(this.currentToken.type == TOKENS.TT_RPAREN){
                res.registerAdvancement()
                this.advance()
            }else{
                argNodes.push(res.register(this.expr()))
                if(res.error){
                    return res.failure(new Error(
                        this.currentToken.pos_start,
                        this.currentToken.pos_end,
                        "Expected ')', 'VAR', 'IF', 'FOR', 'WHILE', 'FUN', int, float, identifier, '+', '-', '(' or 'NOT'"
                    ))
                }
                while(this.currentToken.type === TOKENS.TT_COMMA){
                    res.registerAdvancement()
                    this.advance()
                    argNodes.push(res.register(this.expr()))
                    if(res.error) return res
                }    

                let error = this.checkNextToken(TOKENS.TT_RPAREN,"Expected , or )")
                if(error) return error

                res.registerAdvancement()
                this.advance()
            }
            return res.success(new CallNode(atom,argNodes))
        }
        return res.success(atom)
    }

    atom(){
        const res = new parserResult()
        const tok = this.currentToken
        if(IN(tok.type,[TOKENS.TT_INT,TOKENS.TT_FLOAT])){
            const number = new NumberNode(tok)
            res.registerAdvancement()
            this.advance()
            return res.success(number)
        }else if(tok.type === TOKENS.TT_STRING){
            const number = new StringNode(tok)
            res.registerAdvancement()
            this.advance()
            return res.success(number)
        }else if(tok.type === TOKENS.TT_IDENTIFIER){
            res.registerAdvancement()
            this.advance();
            return res.success(new VarAccessNode(tok))
        }else if(tok.type === TOKENS.TT_LPAREN){
            res.registerAdvancement()
            this.advance()
            const expr = res.register(this.expr())
            if(res.error) return res  
            if(this.currentToken.type == TOKENS.TT_RPAREN){
                res.registerAdvancement()
                this.advance()
                return res.success(expr)
            }else{
                return res.failure(new Error(
                    this.currentToken.pos_start,this.currentToken.pos_end,"InvalidSyntaxError","Expected ')'")
                )
            }
        }else if(tok.type === TOKENS.TT_LSQUARE){
            const listExpr = res.register(this.listExpr())
            if (res.error) return res
            return res.success(listExpr)
        }else if(tok.matches(TOKENS.TT_KEYWORD,"IF")){
            const ifExpr = res.register(this.ifExpr())
            if (res.error) return res
            return res.success(ifExpr)
        }else if(tok.matches(TOKENS.TT_KEYWORD,"FOR")){
            const forExpr = res.register(this.forExpr())
            if (res.error) return res
            return res.success(forExpr)
        }else if(tok.matches(TOKENS.TT_KEYWORD,"WHILE")){
            const whileExpr = res.register(this.whileExpr())
            if (res.error) return res
            return res.success(whileExpr)
        }else if(tok.matches(TOKENS.TT_KEYWORD,"FUN")){
            const funDef = res.register(this.funDef())
            if (res.error) return res
            return res.success(funDef)
        }

        const error = new Error(this.currentToken.pos_start, this.currentToken.pos_end,
            "Invelid Syntax","Expected int, float, identifier, '+', '-', '(', 'IF', 'FOR', 'WHILE', 'FUN'")
        return res.failure(error)
    }

    factor = _=>{
        const res = new parserResult()
        const tok = this.currentToken
        if(IN(tok.type,[TOKENS.TT_MINUS,TOKENS.TT_PLUS])){
            res.registerAdvancement()
            this.advance()
            const factor = res.register(this.factor())
            if(res.error) return res
            const unaryOpNode = new UnaryOpNode(tok,factor)
            return res.success(unaryOpNode)
        }

        return this.power()
    }

    term(){ 
        return this.binOp(_=>this.factor(),[TOKENS.TT_MUL,TOKENS.TT_DIV])
    }

    checkNextToken = (token,error)=>{
        const res = new parserResult()
        if(this.currentToken.type != token || this.currentToken.matches(token)){
            return res.failure(new Error(
                this.currentToken.pos_start,this.currentToken.pos_end,
                "Invalid SyntaxError",`Expected ${error}`
            ))
        }
    }

    arithExpr(){
        return this.binOp(_=>this.term(),[TOKENS.TT_PLUS,TOKENS.TT_MINUS])
    }

    comp_expr(){
        const res = new parserResult()
        if(this.currentToken.matches(TOKENS.TT_KEYWORD,"NOT")){
            const opTok = this.currentToken
            res.registerAdvance()
            this.advance()
            const node = res.register(this.comp_expr())
            if(res.error) return res
            return res.success(new UnaryOpNode(opTok,node))
        }

        const node = res.register(this.binOp(_=>this.arithExpr(), 
            [TOKENS.TT_EE,TOKENS.TT_NE,TOKENS.TT_LT,TOKENS.TT_LTE,TOKENS.TT_GT,TOKENS.TT_GTE]
        ))
        if(res.error){
            return res.failure(new Error(
                this.currentToken.pos_start,this.currentToken.pos_end,
                "Expected int, float, identifier, +, -, (, NOT"
            ))
        }
        return res.success(node)
    }

    expr(){
        const res = new parserResult()
        if(this.currentToken.matches(TOKENS.TT_KEYWORD,"VAR")){
            res.registerAdvancement()
            this.advance()
            let errorIdentifier = this.checkNextToken(TOKENS.TT_IDENTIFIER,"identifier")
            if(errorIdentifier) return errorIdentifier

            const varName = this.currentToken
            res.registerAdvancement()
            this.advance()

            let errorEqual = this.checkNextToken(TOKENS.TT_EQ,"=")
            if(errorEqual) return errorEqual

            res.registerAdvancement()
            this.advance()
            const expr = res.register(this.expr())
            if(res.error) return res
            return res.success(new VarAssignNode(varName,expr))
        }
        const node = res.register(
            this.binOp(_=>this.comp_expr(),[[TOKENS.TT_KEYWORD,"AND"],[TOKENS.TT_KEYWORD,"OR"]])
        )

        if(res.error)
            return res.failure(
                new Error(this.currentToken.pos_start, this.currentToken.pos_end,
                    "Invelid Syntax",'Expected int,identifier, VAR, float, +, - or (')
            )
        return res.success(node)
    }

    binOp = (funcA,ops,funcB)=>{
        if(!funcB) funcB = funcA
        const res = new parserResult()
        let left = res.register(funcA())
        if(res.error) return res
        while(IN(this.currentToken.type,ops) || IN([this.currentToken.type,this.currentToken.value],ops,true)){
            const opTok = this.currentToken
            res.registerAdvancement()
            this.advance()
            const right = res.register(funcB())
            if(res.error) return res
            left = new BinOpNode(left,opTok,right)
        }
        return res.success(left)
    }

    funDef(){
        const res = new parserResult()
        let varNameTok = null
        res.registerAdvancement()
        this.advance()
        
        if(this.currentToken.type === TOKENS.TT_IDENTIFIER){
            varNameTok  = this.currentToken
            res.registerAdvancement()
            this.advance()
        }
        let error = this.checkNextToken(TOKENS.TT_LPAREN,"(")
        if(error) return error
        
        res.registerAdvancement()
        this.advance()
        const argNameToks = []
            
        if(this.currentToken.type === TOKENS.TT_IDENTIFIER){
            argNameToks.push(this.currentToken)
            res.registerAdvancement()
            this.advance()

            while(this.currentToken.type == TOKENS.TT_COMMA){
                res.registerAdvancement()
                this.advance()

                error = this.checkNextToken(TOKENS.TT_IDENTIFIER,"identifier")
                if(error) return error

                argNameToks.push(this.currentToken)
                res.registerAdvancement()
                this.advance() 
            }

            error = this.checkNextToken(TOKENS.TT_RPAREN,", or )")
            if(error) return error
        }else{
            error = this.checkNextToken(TOKENS.TT_RPAREN,"identifier or )")
            if(error) return error
        }
        res.registerAdvancement()
        this.advance()

        if(this.currentToken.type === TOKENS.TT_ARROW){
            res.registerAdvancement()
            this.advance()

            const body = res.register(this.expr())
            if(res.error) return res

            return res.success(new FunDefNode(
                varNameTok,
                argNameToks,
                body,
                true,
            ))

        }
        
        error = this.checkNextToken(TOKENS.TT_NEWLINE,"'->' or NEWLINE")
        if(error) return error
        res.registerAdvancement();  
        this.advance();

        const body = res.register(this.statements())
        if(res.error) return res

        if (!this.currentToken.matches(TOKENS.TT_KEYWORD, 'END')){
            return res.failure(new Error(
                this.currentToken.pos_start, this.currentToken.pos_end,
                "InvalidSyntaxError",
                "Expected 'END'"
            ))
        }
        res.registerAdvancement();  
        this.advance();
        return res.success(new FunDefNode(
            varNameTok,
            argNameToks,
            body,
            false,
        ))
    }
}

export default Parser
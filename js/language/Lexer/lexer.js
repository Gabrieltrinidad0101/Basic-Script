import IN from "../help/IN.js"
import * as TOKENS from "../TOKEN/TT_TOKENS.js"
import Token from "../TOKEN/token.js"
import NUMBERS from "../constants/NUMBERS.js"
import Position from "./position.js"
import Error from "../Error/error.js"
import LETTER from "../constants/LETTER.js"
import KEYWORD from "../constants/KEYWORD.js"

class Lexer{
    constructor(text){
        this.text =  text
        this.pos = new Position(0,0,0)
        this.advance()

    }

    advance(){
        this.currentChar = this.text[this.pos.idx]
        this.pos.advance()
    }

    makeTokenType(type){
        const newToken = new Token(null,type,this.pos)
        this.tokens.push(newToken)
        this.advance()
    }

    makeTokens(){
        this.tokens = []
        while(this.currentChar){
            if(IN(this.currentChar," \t")){
                this.advance()
            }else if(IN(this.currentChar,LETTER)){
                this.tokens.push(this.makeIdentifier())
            }else if(this.currentChar === "+"){
                this.makeTokenType(TOKENS.TT_PLUS)
            }else if(this.currentChar === "-"){
                this.makeTokenType(TOKENS.TT_MINUS)
            }else if(this.currentChar === "*"){
                this.makeTokenType(TOKENS.TT_MUL)
            }else if(this.currentChar === "/"){
                this.makeTokenType(TOKENS.TT_DIV)
            }else if(this.currentChar === "^"){
                this.makeTokenType(TOKENS.TT_POW)
            }else if(this.currentChar === "("){
                this.makeTokenType(TOKENS.TT_LPAREN)
            }else if(this.currentChar === ")"){
                this.makeTokenType(TOKENS.TT_RPAREN)
            }else if(this.currentChar === "="){
                this.tokens.push(this.makeEqual())
            }else if(this.currentChar === ">"){
                this.tokens.push(this.makeGreaterThan())
            }else if(this.currentChar === "<"){
                this.tokens.push(this.makeLessThan())
            }else if(this.currentChar === "!"){
                const [token,error] = this.makeNotEqual()
                if(error) return [null,error]
                this.tokens.push(token)
            }else if(IN(this.currentChar,NUMBERS)){
                this.tokens.push(this.makeNumber())
            }else{
                const error = new Error(this.pos,this.pos,"Illegal Character",`'${this.currentChar}'`)
                return [null,error]
            }
        }
        this.tokens.push(new Token(null,TOKENS.TT_EOF,this.pos))
        return [this.tokens,null]
    }

    makeNumber(){
        const posStart = this.pos.copy()
        let numberStr = ""
        let dotCount = 0
        while(IN(this.currentChar,NUMBERS + ".")){
            if(this.currentChar === "."){
                if(dotCount === 1) break;
                dotCount = 1
            }
            numberStr += this.currentChar
            this.advance()
        }
        if(dotCount === 0){
            return new Token(parseInt(numberStr),TOKENS.TT_INT,posStart,this.pos)
        }else{
            return new Token(parseFloat(numberStr),TOKENS.TT_FLOAT,posStart,this.pos)
        }
    }

    makeIdentifier(){
        let string = ""
        const posStart =  this.pos
        while(IN(this.currentChar,LETTER + "_")){
            string += this.currentChar 
            this.advance()
        }
        const typeToken = IN(string,KEYWORD) ? TOKENS.TT_KEYWORD : TOKENS.TT_IDENTIFIER
        return new Token(string,typeToken,posStart,this.pos)
    }

    makeNotEqual(){
        const posStart = this.pos.copy()
        this.advance()

        if(this.currentChar === "="){
            this.advance()
            return [new Token(null,TOKENS.TT_NE,posStart,this.pos),null]
        }
        return [null,new Error(posStart,this.pos,"Expected Character","'=' (after '!')")]
    }

    makeTokenAOrTokenB(tokenA,tokenB,char){
        let tokenType = tokenA
        const posStart = this.pos.copy()
        this.advance()
        if(this.currentChar === char){
            this.advance()
            tokenType = tokenB
        }

        return new Token(null,tokenType,posStart,this.pos)
    }

    makeEqual(){
        return this.makeTokenAOrTokenB(TOKENS.TT_EQ,TOKENS.TT_EE,"=")
    }

    makeGreaterThan(){
        return this.makeTokenAOrTokenB(TOKENS.TT_GT,TOKENS.TT_GTE,"=")
    }

    makeLessThan(){
        return this.makeTokenAOrTokenB(TOKENS.TT_LT,TOKENS.TT_LTE,"=")
    }

}


export default Lexer
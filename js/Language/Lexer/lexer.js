import Token from "../Token/token.js";
import TOKENS from "../constants/TOKENS.js";
import { DIGITS } from "../constants/DIGITS.js";
import IN from "../help/in.js";
import Error from "../Error/error.js";
import Position from "./position.js";
import {LETTERS,LETTERS_DIGITS} from "../constants/LETTERS.js";
import KEYWORDS from "../constants/KEYWORDS.js";

class Lexer{
    constructor(fn,text){
        this.text = text
        this.pos = new Position(-1,0, -1,fn,text)
        this.advance()
    }

    advance(){
        this.pos.advance()
        this.current_char = this.pos.idx < this.text.length ? this.text[this.pos.idx] : null
    }

    token(tokenType,pos_start){
        const newToken = new Token(tokenType,null,pos_start)
        this.tokens.push(newToken)
        this.advance()
    }

    make_tokens(){
        this.tokens = []
        while (this.current_char != null){
            if(IN(this.current_char," \t")){
                this.advance()
            }else if (IN(this.current_char,DIGITS + ".")){
                this.tokens.push(this.make_number())
            }else if (IN(this.current_char,"\n;")){
                this.pos.ln += 1
                this.pos.col = -1
                this.token(TOKENS.TT_NEWLINE,this.pos)
            }else if (IN(this.current_char,LETTERS)){
                this.tokens.push(this.make_identifier())
            }else if (this.current_char == '"'){
                this.tokens.push(this.makeString())
            }else if (this.current_char == "+"){
                this.token(TOKENS.TT_PLUS,this.pos)
            }else if (this.current_char == "-"){
                this.tokens.push(this.makeMinusOrArrow())
            }else if (this.current_char == "*"){
                this.token(TOKENS.TT_MUL,this.pos)
            }else if (this.current_char == "/"){
                this.token(TOKENS.TT_DIV,this.pos)
            }else if (this.current_char == "^"){
                this.token(TOKENS.TT_POW,this.pos)
            }else if (this.current_char == "("){
                this.token(TOKENS.TT_LPAREN,this.pos)
            }else if (this.current_char == ")"){
                this.token(TOKENS.TT_RPAREN,this.pos)
            }else if (this.current_char == "["){
                this.token(TOKENS.TT_LSQUARE,this.pos)
            }else if (this.current_char == "]"){
                this.token(TOKENS.TT_RSQUARE,this.pos)
            }else if (this.current_char == "!"){
                const [tok,error] = this.makeNotEquals()
                if (error) return {tokens: [],error}
                this.tokens.push(tok)
            }else if (this.current_char == "="){
                this.tokens.push(this.makeEquals())
            }else if (this.current_char == "<"){
                this.tokens.push(this.makeLessThan())
            }else if (this.current_char == ">"){
                this.tokens.push(this.makeGreaterThan())
            }else if (this.current_char == ","){
                this.token(TOKENS.TT_COMMA,this.pos)
            }else{
                const pos_start = this.pos.copy()
                const char = this.current_char
                this.advance()
                return {tokens: [],error:new Error(pos_start,this.pos,"Illegal Character",`'${char}'`)}
            }
        }
        this.token(TOKENS.TT_EOF,this.pos)
        return {tokens: this.tokens,error: null}
    }

    make_number(){
        let num_str = ""
        let dot_count = 0
        const pos_start = this.pos.copy()
        while(this.current_char != null && IN(this.current_char,DIGITS + ".")){
            if(this.current_char == "."){
                if(dot_count == 1) break;
                dot_count += 1
                num_str += "."
            }else{
                num_str += this.current_char
            }
            this.advance()
        }
        if(dot_count == 0){
            return new Token(TOKENS.TT_INT,parseInt(num_str),pos_start,this.pos)
        }else{
            return new Token(TOKENS.TT_FLOAT,parseFloat(num_str),pos_start,this.pos)
        }
    }


    make_identifier(){
        let id_str = ""
        let pos_start = this.pos.copy()

        while(this.current_char != null && IN(this.current_char,LETTERS_DIGITS + "_")){
            id_str += this.current_char
            this.advance()
        }

        const tokType = IN(id_str,KEYWORDS) ? TOKENS.TT_KEYWORD : TOKENS.TT_IDENTIFIER
        return new Token(tokType,id_str,pos_start,this.pos)
    }

    makeString(){
        let string = ""
        const posStart = this.pos
        this.advance()

        while(this.current_char != null && this.current_char != '"'){
            string += this.current_char
            this.advance()
        }
        this.advance()
        const token = new Token(
            TOKENS.TT_STRING,
            string,
            posStart,
            this.pos
        )
        return token
    }

    makeNotEquals(){
        const posStart = this.pos.copy()
        this.advance()
        if(this.current_char === "="){
            this.advance();
            return [new Token(TOKENS.TT_NE,posStart,this.pos),null]
        }
        this.advance()
        return [null,new Error(posStart,this.pos,"Expected Char Error", "'=' (after '!')")]
    }
    ComparisonsAndLogical(tokenA,tokenB){
        let tokType = tokenA
        const posStart = this.pos.copy()
        this.advance()
        if(this.current_char == "="){
            this.advance()
            tokType = tokenB
        }
        return new Token(tokType,posStart,this.pos)
    }
    makeEquals(){
        return this.ComparisonsAndLogical(TOKENS.TT_EQ,TOKENS.TT_EE)
    }

    makeLessThan(){
        return this.ComparisonsAndLogical(TOKENS.TT_LT,TOKENS.TT_LTE)
    }

    makeGreaterThan(){
        return this.ComparisonsAndLogical(TOKENS.TT_GT,TOKENS.TT_GTE)
    }

    makeMinusOrArrow(){
        let tokType = TOKENS.TT_MINUS
        const posStart = this.pos.copy()
        this.advance()

        if(this.current_char === ">"){
            tokType = TOKENS.TT_ARROW
            this.advance()
        }
        return new Token(tokType,null,posStart,this.pos)
    }
}

export default Lexer
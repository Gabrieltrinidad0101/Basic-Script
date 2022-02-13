import Lexer from "./Lexer/lexer.js"
import Parser from "./Parser/Parser.js"
import Interpreter from "./Interpreter/Interpreter.js"
import Context from "./Context/context.js"
import SymbolTable from "./SymbolTable/SymbolTable.js"

const symbolTable = new SymbolTable()

export default function run(text,file){
    const lexer = new Lexer(text)
    const [tokens,error] = lexer.makeTokens()
    if(error) return [null,error]
    
    const parser = new Parser(tokens)
    const ast = parser.parse()
    if(ast.error) return [null,ast.error.toString()]

    const context = new Context(file)
    context.symbolTable = symbolTable
    const interpreter = new Interpreter()   
    const result = interpreter.run(ast.node,context)
    if(result?.error) return  [null, result.error]
    return [result.value?.toString(),null]
}
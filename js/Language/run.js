import Lexer from "./Lexer/lexer.js"
import Parser from "./Parser/parser.js"
import Interpreter from "./Interpreter/interpreter.js"
import Context from "./Interpreter/context.js"
import SymbolTable from "./Interpreter/SymbolTable.js"
import Number from "./ValueTypes/Number.js"
import BuiltInFunction from "./baseFunction/BuiltInFunction.js"

function run(fn,text){
    let globalSymbolTable = new SymbolTable()
    
    globalSymbolTable.set("NULL",Number.null)
    globalSymbolTable.set("TRUE",Number.true)
    globalSymbolTable.set("FALSE",Number.false)
    globalSymbolTable.set("PRINT",new BuiltInFunction("print"))
    globalSymbolTable.set("CLEAR",new BuiltInFunction("clear"))
    globalSymbolTable.set("IS_NUMBER",new BuiltInFunction("isNumber"))
    globalSymbolTable.set("IS_STRING",new BuiltInFunction("isString"))
    globalSymbolTable.set("IS_LIST",new BuiltInFunction("isList"))
    globalSymbolTable.set("IS_FUNCTION",new BuiltInFunction("isFunction"))

    const lexer = new Lexer(fn,text)
    const {tokens,error} = lexer.make_tokens()
    if(error) return {result: null,error}

    const parser = new Parser(tokens)
    const ast = parser.parse()
    if(ast.error) return {result: null,error: ast.error}
    const context = new Context("'program'")
    const interpreter = new Interpreter()

    context.symbolTable = globalSymbolTable
    const result = interpreter.run(ast.node,context)
    if(result?.error) return {result: null,error: result.error}
    return {result: result?.value,error: null}
}

export default run
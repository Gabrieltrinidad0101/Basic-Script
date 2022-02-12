import Editor from "./Interfaces/editor.js"
import CLI from "./Interfaces/CLI.js"
import run from "./language/run.js"
const editor = new Editor()
const cli = new CLI()


cli.run(async text =>{
    if(text === "") return
    languaje(text,"CLI")
})

editor.run(text=>{
    if(text === "") return
    languaje(text,"<program>")
    cli.newInput()
})

function languaje(text,file){
    const [result,error] = run(text,file)
    if(error){
        cli.log(error.toString())
    }else if(result !== undefined){
        cli.log(result.toString())
    }

}
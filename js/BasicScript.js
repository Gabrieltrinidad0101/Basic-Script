import Editor from "./Interfaces/editor.js"
import CLI from "./Interfaces/CLI.js"
import run from "./language/run.js"
const editor = new Editor()
const cli = new CLI()

cli.run(async text =>{
    if(text === "") return
    languaje(text)
})

editor.run(text=>{
    if(text === "") return
    languaje(text)
    cli.newInput()
})

function languaje(text){
    const [result,error] = run(text)
    if(error){
        cli.log(error.toString())
    }else if(result){
        cli.log(result.toString())
    }

}
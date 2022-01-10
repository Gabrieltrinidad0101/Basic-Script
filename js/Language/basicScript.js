import Editor from "../Interfaces/editor.js"
import CLI from "../Interfaces/Cli.js"
import run from "./run.js"

const editor = new Editor()
const cli = new CLI()

editor.run(text=>{
    if(text === "") return
    languaje(text)
})

function languaje(text){
    let {result,error} = run('stdin',text)
    if(error){
        cli.log(error.toString())
    }
}
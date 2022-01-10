let editor = null
class Editor{
    constructor(){
        if(!editor){
            //create
            this.editor = monaco.editor.create(document.getElementById('editor'), {
                language: 'plaintext',
                theme: 'vs-dark',
            });

            editor = this.editor;

            //vars
            const runEditor = document.getElementById("runEditor")
            this.cb = null
    
            //events
            runEditor.addEventListener("click",_=> this.cb ? this.cb(this.editor.getValue()) : "")
            this.editor.onKeyDown(_=> this.#saveData())
            
            //functions
            this.#getData()
        }else{
            this.editor = editor
        }

    }

    run(cb){
        this.cb = cb
        this.#saveData()
    }

    #saveData(){
        localStorage.setItem("code",this.editor.getValue())
    }

    #getData(){
        var line = this.editor.getPosition();
        var range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
        var id = { major: 1, minor: 1 };             
        var text = localStorage.getItem("code");
        var op = {identifier: id, range: range, text: text, forceMoveMarkers: true};
        this.editor.executeEdits("hola mundo",[op])
    }

    getLine(line){
        return this.editor.getModel().getLineContent(line)
    }
}


export default Editor
class CLI{
    constructor(){
        //get elements
        this.container = document.getElementById("CliApp")
        
        //render
        this.#insertFirstHtml()

        //get elements
        this.inputText =  document.getElementById("inputCliApp")
        
        //vars
        this.isGetInput = false

        //events
        this.#keydown()

    }

    #keydown(){
        window.addEventListener("keydown",async e=>{
            if(this.inputText === document.activeElement && 13 == e.keyCode && !this.isGetInput){
                await this.fn(this.inputText.value);
                localStorage.setItem("inputText",this.inputText.value)
                this.newInputText()      
            }
        })
    }

    newInputText(simbol=">"){        
        const div = document.createElement("div");
        div.innerHTML = `<span>${simbol} <span>`
        
        this.inputText = document.createElement("input")
        this.inputText.id = this.id
        this.inputText.autocomplete="off"
        
        div.appendChild(this.inputText)
        this.container.appendChild(div)

        this.inputText.focus()
    }

    input = text => new Promise(res=>{
        this.inputText.disabled = true
        this.newInputText(text)      
        this.isGetInput = true
        window.addEventListener("keydown",e=>{
            if(this.inputText === document.activeElement && 13 == e.keyCode && this.isGetInput){
                res(this.inputText.value)
                this.isGetInput = false
            }
        })
    })

    #insertFirstHtml(){
        const html =  `
            <div>
                <span>> </span> <input type="text" id="inputCliApp" value="${localStorage.getItem("inputText") ?? ""}" autocomplete="off"></input> 
            </div>
        `
        this.container.innerHTML = html
    }

    log(html){
        this.inputText.disabled = true
        const div = document.createElement("code")
        div.innerText = html
        this.container.appendChild(div)
    }

    clear(){
        this.container.innerHTML = '';
    }

    run(fn){
        this.fn = fn
    }
}

export default CLI
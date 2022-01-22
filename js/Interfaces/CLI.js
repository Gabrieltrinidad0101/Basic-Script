class CLI{
    constructor(){
        //get elements
        this.container = document.getElementById("CliApp")
        
        //render
        this.#insertFirstHtml()

        //get elements
        this.input =  document.getElementById("inputCliApp")
        
        //events
        this.#keydown()
    }

    #keydown(){
        window.addEventListener("keydown",e=>{
            if(this.input === document.activeElement && 13 == e.keyCode && (!this.isGetInput || getInput)){
                this.fn(this.input.value);
                this.newInput()      
            }
        })
    }

    newInput(simbol=">"){        
        const div = document.createElement("div");
        div.innerHTML = `<span>${simbol} <span>`
        
        this.input = document.createElement("input")
        this.input.id = this.id
        this.input.autocomplete="off"
        
        div.appendChild(this.input)
        this.container.appendChild(div)

        this.input.focus()
    }

    #insertFirstHtml(){
        const html =  `
            <div>
                <span>> </span> <input type="text" id="inputCliApp" autocomplete="off"></input> 
            </div>
        `
        this.container.innerHTML = html
    }

    log(html){
        this.input.disabled = true
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
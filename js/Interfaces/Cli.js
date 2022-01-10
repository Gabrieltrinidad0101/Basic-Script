class CLI{
    constructor(){
        //get elements
        this.container = document.getElementById("CliApp")
        this.input =  document.getElementById("inputCliApp")
    }

    log(html){
        html = `${html}`
        html = this.#replace(html)
        if(html === undefined) return
        const div = document.createElement("code")
        div.innerHTML = html
        this.container.appendChild(div)
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    #replace(html){
        return html.replaceAll("\n","<br>")
    }
    
    clear(){
        this.container.innerHTML = ""
    }
    
}



export default CLI
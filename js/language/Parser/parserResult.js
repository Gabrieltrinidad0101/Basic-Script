class ParserResult{
    constructor(){
        this.node = null
        this.error = null
    }

    register(res){
        if(res.error) this.error = res.error
        return res.node
    }

    success(node){
        this.node = node
        return this
    }

    failure(error){
        this.error = error
        return this
    }
}

export default ParserResult
class parserResult{
    constructor(){
        this.error = null
        this.node = null
        this.advanceCount = 0
        this.toReversecount = 0
    }
    
    registerAdvancement(){
        this.advanceCount += 1 
    }

    register(res){
        this.advanceCount += res.advanceCount
        if(res.error) this.error = res.error
        return res.node
    }

    tryRegister(res){
        if(res.error){
            this.toReversecount = res.advanceCount
            return null
        }
        return this.register(res)
    }

    success(node){
        this.node = node
        return this
    }

    failure(error){
        if(!this.error || this.advanceCount === 0){
            this.error = error
        }
        return this
    }
}

export default parserResult
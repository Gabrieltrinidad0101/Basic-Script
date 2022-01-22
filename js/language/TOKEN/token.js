class Token{
    constructor(value=null,type,posStart,posEnd){
        this.value = value
        this.type = type 
        this.posStart = posStart
        this.posEnd = posStart
        if(posEnd) this.posEnd = posEnd
    }

    matches(value,type){
        return value === this.value && type === this.type 
    }

    toString(){
        return `${this.value ? this.value : this.type}`
    }
}

export default Token
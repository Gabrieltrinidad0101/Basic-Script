class Token{
    constructor(type_,value,pos_start,pos_end=null){
        this.type = type_
        this.value = value
        this.pos_start = pos_start.copy()
        this.pos_end = pos_start.copy()
        this.pos_end.advance()
        if(pos_end) this.pos_end = pos_end

    }

    matches(type,value){
        return this.type === type && this.value === value
    }
    toString(){
        if(this.value) return `${this.type}:${this.value}`
        return `${this.type}`
    }
}

export default Token
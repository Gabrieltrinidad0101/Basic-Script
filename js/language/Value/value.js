class Value{
    constructor(value){
        this.value = value
    }

    setPos(posStart,posEnd){
        this.posStart = posStart
        this.posEnd = posEnd
        return this
    }

    setContext(context){
        this.context = context
        return this
    }

    getComparisonEq(other){
        return new Value(this.value === other.value)
    }

    getComparisonNe(other){
        return new Value(this.value !== other.value)
    }

    andedBy(other){
        return new Value(this.value && other.value)
    }

    ordedBy(other){
        return new Value(this.value || other.value)
    }

    isTrue(){
        return this.value
    }

    toString(){
        return this.value
    }
}

export default Value
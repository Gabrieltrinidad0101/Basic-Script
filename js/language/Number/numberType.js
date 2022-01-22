import RTError from "../Error/RTError.js"
import Value from "../Value/value.js"
class Number extends Value{
    addedTo(other){
        return new Number(this.value + other.value)
    }
    
    subbedTo(other){
        return new Number(this.value - other.value)
    }
    
    multedBy(other){
        return new Number(this.value * other.value)
    }

    getComparisonLt(other){
        return new Value(this.value < other.value)
    }

    getComparisonGt(other){
        return new Value(this.value > other.value)
    }

    getComparisonLte(other){
        return new Value(this.value >= other.value)
    }

    getComparisonGte(other){
        return new Value(this.value <= other.value)
    }
    
    divedBy(other){
        if(other.value === 0){
            return [null,new RTError(
                other.posStart,other.posEnd,
                "Division by zero",
                this.context
            )]
        }
        return [new Number(this.value / other.value),null]
    }

    powerBy(other){
        return new Number(Math.pow(this.value, other.value))
    }

    toString(){
        return this.value
    }
}

export default Number
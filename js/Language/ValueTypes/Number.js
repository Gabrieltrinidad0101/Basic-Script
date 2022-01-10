import RTError from "../Interpreter/RTError.js"
import Value from "./Value.js";
class Number extends Value{
    static null = new Number(0)
    static false = new Number(false)
    static true = new Number(true)

    added_to(other){
        if(other instanceof Number){
            return [new Number(this.value + other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    subbed_by(other){
        if(other instanceof Number){
            return [new Number(this.value - other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    multed_by(other){
        if(other instanceof Number){
            return [new Number(this.value * other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }

    dived_by(other){
        if(other instanceof Number){
            if(other == 0){
                const error = new RTError(other.pos_start,other.pos_end,"Division by 0",this.context)
                return [null,error]
            }
            return [new Number(this.value / other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }

    powed_by(other){
        if(other instanceof Number){
            return [new Number(this.value ** other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }

    // getComparisonEq(other){
    //     if(other instanceof Number){
    //         return [new Number(this.value == other.value).setContext(this.context),null]
    //     }else{
    //         return [null,this.illegal_operation(this,other)]
    //     }
    // }

    // getComparisonNe(other){
    //     if(other instanceof Number){
    //         return [new Number(this.value != other.value).setContext(this.context),null]
    //     }else{
    //         return [null,this.illegal_operation(this,other)]
    //     }
    // }

    getComparisonGt(other){
        if(other instanceof Number){
            return [new Number(this.value > other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    getComparisonLt(other){
        if(other instanceof Number){
            return [new Number(this.value < other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    getComparisonLte(other){
        if(other instanceof Number){
            return [new Number(this.value <= other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    getComparisonGte(other){
        if(other instanceof Number){
            return [new Number(this.value >= other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    anded_by(other){
        if(other instanceof Number){
            return [new Number(this.value && other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    orded_by(other){
        if(other instanceof Number){
            return [new Number(this.value || other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }    

    notted(){
        return  new Number(this.value)
    }

    copy(){
		const copy = new Number(this.value)
		copy.set_pos(this.pos_start, this.pos_end)
		copy.setContext(this.context)
		return copy
    }

}

export default Number
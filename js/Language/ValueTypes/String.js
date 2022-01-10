import Value from "./Value.js";
import Number from "./Number.js"
class String extends Value{
    added_to(other){
        if(other instanceof String){
            return [new String(this.value + other.value).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    multed_by(other){
        if(other instanceof Number){
            return [new String(this.value.repeat(other.value)).setContext(this.context),null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }

    copy(){
		const copy = new String(this.value)
		copy.set_pos(this.pos_start, this.pos_end)
		copy.setContext(this.context)
		return copy
    }

    isTrue(){
        return this.value.length > 0
    }

    toString(){
        return `${this.value}`
    }

}


export default String
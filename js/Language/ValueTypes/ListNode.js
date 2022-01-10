import RTError from "../Interpreter/RTError.js"
import Value from "./Value.js";
import Number from "./Number.js";
class List extends Value{
    constructor(elements){
        super()
        this.elements = elements
    }
    added_to(other){
        const newList = this.copy()
        newList.elements.push(other)
        return [newList,null]
    }
    subbed_by(other){
        if(other instanceof Number){
            const newList = this.copy()
            const elementDelete = newList.elements.splice(other,1)
            if(elementDelete.length > 0)
                return [newList,null]
            return [null, new RTError(
              other.pos_start, other.pos_end,
              'Element at this index could not be removed from list because index is out of bounds',
              this.context
            )]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }
    multed_by(other){
        if(other instanceof List){
            const newList = this.copy()
            newList.elements.push(...other.elements)
            return [newList,null]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }

    dived_by(other){
        if(other instanceof Number){
            const element = this.elements[other.value]
            if(element)
                return [this.elements[other.value],null]
            return [null, new RTError(
                other.pos_start, other.pos_end,
                'Element at this index could not be retrieved from list because index is out of bounds',
                this.context
              )]
        }else{
            return [null,this.illegal_operation(this,other)]
        }
    }

    copy(){
		const copy = new List(this.elements)
		copy.set_pos(this.pos_start, this.pos_end)
		copy.setContext(this.context)
		return copy
    }

    isTrue(){
        return this.value
    }

    toString(){
        return `[${this.elements.map(value=>value)}]`
    }
}


export default List
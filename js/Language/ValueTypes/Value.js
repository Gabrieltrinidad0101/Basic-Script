import RTError from "../Interpreter/RTError.js"
class Value {
    constructor(value) {
        this.value = value
        this.context = null
        this.set_pos()
        this.setContext()
    }

    set_pos(posStart, posEnd) {
        this.pos_start = posStart
        this.pos_end = posEnd
        return this
    }

    setContext(context = null) {
        this.context = context
        return this
    }

    addedTo(other) {
        return [null, this.illegal_operation(other)]
    }

    subbedBy(other) {
        return [null, this.illegal_operation(other)]
    }

    multedBy(other) {
        return [null, this.illegal_operation(other)]
    }

    divedBy(other) {
        return [null, this.illegal_operation(other)]
    }

    powedBy(other) {
        return [null, this.illegal_operation(other)]
    }

    getComparisonEq(other){
        return [new Value(this.value == other.value).setContext(this.context),null]
    }

    getComparisonNe(other){
        return [new Value(this.value != other.value).setContext(this.context),null]
    }

    getComparisonLt(other) {
        return [null, this.illegal_operation(other)]
    }

    getComparisonGt(other) {
        return [null, this.illegal_operation(other)]
    }

    getComparisonLte(other) {
        return [null, this.illegal_operation(other)]
    }

    getComparisonGte(other) {
        return [null, this.illegal_operation(other)]
    }

    andedBy(other) {
        return [null, this.illegal_operation(other)]
    }

    oredBy(other) {
        return [null, this.illegal_operation(other)]
    }

    notted() {
        return [null, this.illegal_operation(other)]
    }

    execute(args) {
        return RTResult().failure(this.illegal_operation())
    }

    copy() {
        return RTResult().failure("No copy method ned")
    }

    isTrue(){
        return this.value
    }

    toString() {
        return this.value
    }

    illegal_operation(other = null) {
        console.log(other.pos_end.ln)
        return new RTError(
            this.pos_start, other.pos_end,
            'Illegal operation',
            this.context
        )
    }
}

export default Value
class Position{
    constructor(idx,ln,col){
        this.idx = idx
        this.col = col
        this.ln = ln
    }

    advance(){
        this.idx += 1
        this.col += 1
    }


    copy(){
        return new Position(this.idx,this.ln,this.col)
    }
}

export default Position;